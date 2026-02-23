// Script Node.js para poblar la tabla numeros_rifa
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:HQkQdYKzUxniLrUsuCNbXPOyQUMxcLuL@yamabiko.proxy.rlwy.net:58544/railway',
  ssl: { rejectUnauthorized: false }
});

pool.query("INSERT INTO numeros_rifa (numero, estado) SELECT n, 'disponible' FROM generate_series(1, 100) AS n ON CONFLICT (numero) DO NOTHING;", (err) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  } else {
    console.log('Números insertados o ya existen.');
    process.exit(0);
  }
});
