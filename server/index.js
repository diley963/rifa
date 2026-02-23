// server/index.js
// Backend Express para la rifa BMX
// Código comentado para principiantes
// server/index.js
// Backend Express para la rifa BMX
// Código comentado para principiantes

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y JSON
app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
});

// Servir Angular compilado (dist/client)
app.use(express.static(path.join(__dirname, '../dist/client')));

// GET /api/numeros - Lista todos los números y su estado
app.get('/api/numeros', async (req, res) => {
  try {
    const result = await pool.query('SELECT numero, estado FROM numeros_rifa ORDER BY numero');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los números' });
  }
});

// POST /api/reservar/:numero - Reserva un número si está disponible
// POST /api/reservar-multiple - Reserva varios números
app.post('/api/reservar-multiple', async (req, res) => {
  const { numeros, nombre, telefono } = req.body;
  if (!Array.isArray(numeros) || numeros.length === 0) {
    return res.status(400).json({ error: 'Debes enviar una lista de números' });
  }
  try {
    await pool.query('BEGIN');
    // Validar todos los números
    const { rows } = await pool.query(
      'SELECT numero, estado FROM numeros_rifa WHERE numero = ANY($1) FOR UPDATE',
      [numeros]
    );
    if (rows.length !== numeros.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Algún número no existe' });
    }
    // Verificar que todos estén disponibles
    const noDisponibles = rows.filter(r => r.estado !== 'disponible').map(r => r.numero);
    if (noDisponibles.length > 0) {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'Números no disponibles', noDisponibles });
    }
    // Actualizar todos
    await pool.query(
      'UPDATE numeros_rifa SET estado = $1, fecha_reserva = NOW(), nombre = $2, telefono = $3 WHERE numero = ANY($4)',
      ['reservado', nombre || null, telefono || null, numeros]
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Error al reservar los números' });
  }
});
app.post('/api/reservar/:numero', async (req, res) => {
  const numero = parseInt(req.params.numero, 10);
  const { nombre, telefono } = req.body;
  try {
    await pool.query('BEGIN');
    const { rows } = await pool.query('SELECT estado FROM numeros_rifa WHERE numero = $1 FOR UPDATE', [numero]);
    if (!rows.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Número no encontrado' });
    }
    if (rows[0].estado !== 'disponible') {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'Número no disponible' });
    }
    await pool.query(
      'UPDATE numeros_rifa SET estado = $1, fecha_reserva = NOW(), nombre = $2, telefono = $3 WHERE numero = $4',
      ['reservado', nombre || null, telefono || null, numero]
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Error al reservar el número' });
  }
});

// POST /api/vender/:numero - Marca un número como vendido
app.post('/api/vender/:numero', async (req, res) => {
  const numero = parseInt(req.params.numero, 10);
  try {
    await pool.query('BEGIN');
    const { rows } = await pool.query('SELECT estado FROM numeros_rifa WHERE numero = $1 FOR UPDATE', [numero]);
    if (!rows.length) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Número no encontrado' });
    }
    if (rows[0].estado === 'vendido') {
      await pool.query('ROLLBACK');
      return res.status(409).json({ error: 'Número ya vendido' });
    }
    await pool.query(
      'UPDATE numeros_rifa SET estado = $1 WHERE numero = $2',
      ['vendido', numero]
    );
    await pool.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: 'Error al marcar como vendido' });
  }
});

// Fallback: servir index.html de Angular para rutas no API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/client/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
