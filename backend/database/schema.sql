-- Tablas comunes del Grupo 14 (se pueden ejecutar varias veces sin borrar datos)
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

-- Tablas de cada app (Wilder y Fernando pueden ajustar las suyas avisando al grupo)
CREATE TABLE IF NOT EXISTS tramites_mesa_partes (
  id SERIAL PRIMARY KEY,
  id_usuario INT REFERENCES usuarios(id),
  asunto VARCHAR(200),
  documento VARCHAR(200),
  estado VARCHAR(20) DEFAULT 'registrado',
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotizaciones_carga (
  id SERIAL PRIMARY KEY,
  cliente VARCHAR(100),
  ruta VARCHAR(200),
  carga VARCHAR(200),
  id_tramite INT REFERENCES tramites_mesa_partes(id),
  estado VARCHAR(20) DEFAULT 'registrado',
  creado_en TIMESTAMP DEFAULT NOW()
);

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
