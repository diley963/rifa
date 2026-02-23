-- Script para crear e inicializar la tabla de la rifa

CREATE TABLE IF NOT EXISTS numeros_rifa (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'disponible',
    fecha_reserva TIMESTAMP,
    nombre VARCHAR(100),
    telefono VARCHAR(20)
);

-- Inicializar números del 1 al 100 como disponibles
INSERT INTO numeros_rifa (numero, estado)
SELECT n, 'disponible'
FROM generate_series(1, 100) AS n
ON CONFLICT (numero) DO NOTHING;
