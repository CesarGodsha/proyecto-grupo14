-- ============================================================================
-- ESQUEMA DE BASE DE DATOS - GRUPO 14: COMERCIO EXTERIOR JUNÍN
-- ============================================================================

-- 1. Tablas comunes del Grupo 14
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_rol (
  id_usuario INT REFERENCES usuarios(id) ON DELETE CASCADE,
  modulo VARCHAR(30),
  rol VARCHAR(20) CHECK (rol IN ('cliente','administrador','empleado')),
  PRIMARY KEY (id_usuario, modulo)
);

-- 2. Tabla de GORE Junín (Fernando Alex Ccencho Gamarra)
CREATE TABLE IF NOT EXISTS tramites_mesa_partes (
  id SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuarios(id),
  asunto VARCHAR(200),
  documento VARCHAR(200),
  estado VARCHAR(20) DEFAULT 'registrado',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla de LogísticaMax Perú - Caso 35 (Wilder Johan Zevallos Yauri)
CREATE TABLE IF NOT EXISTS cotizaciones_carga (
  id SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuarios(id),
  cliente VARCHAR(100),
  ruta VARCHAR(200),
  carga VARCHAR(200),
  toneladas NUMERIC(7,2) NOT NULL DEFAULT 1 CHECK (toneladas > 0),
  matpel BOOLEAN NOT NULL DEFAULT false,
  monto_calculado NUMERIC(10,2) NOT NULL DEFAULT 450.00 CHECK (monto_calculado >= 0),
  id_tramite INT REFERENCES tramites_mesa_partes(id),
  estado VARCHAR(20) DEFAULT 'registrado',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Asegura que si cotizaciones_carga ya existía en Neon, se agreguen las columnas nuevas sin borrar datos
ALTER TABLE cotizaciones_carga
  ADD COLUMN IF NOT EXISTS id_usuario INT REFERENCES usuarios(id),
  ADD COLUMN IF NOT EXISTS toneladas NUMERIC(7,2) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS matpel BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS monto_calculado NUMERIC(10,2) NOT NULL DEFAULT 450.00;

-- 4. Tabla de Migraciones Perú (César Kevin Torres Rojas)
CREATE TABLE IF NOT EXISTS citas_migraciones (
  id SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL REFERENCES usuarios(id),
  id_cotizacion INT REFERENCES cotizaciones_carga(id),
  tramite VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado VARCHAR(20) DEFAULT 'registrado',
  creado_en TIMESTAMP DEFAULT NOW()
);