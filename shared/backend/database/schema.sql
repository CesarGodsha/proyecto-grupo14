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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'usuarios'
      AND column_name = 'correo'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'usuarios'
      AND column_name = 'email'
  ) THEN
    ALTER TABLE usuarios RENAME COLUMN correo TO email;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'usuarios'
      AND column_name = 'password'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'usuarios'
      AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE usuarios RENAME COLUMN password TO password_hash;
  END IF;
END $$;

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'tramites_mesa_partes'
      AND column_name = 'documento_url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'tramites_mesa_partes'
      AND column_name = 'documento'
  ) THEN
    ALTER TABLE tramites_mesa_partes RENAME COLUMN documento_url TO documento;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'tramites_mesa_partes'
      AND column_name = 'administrado'
  ) THEN
    ALTER TABLE tramites_mesa_partes ALTER COLUMN administrado DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'tramites_mesa_partes'
      AND column_name = 'codigo'
  ) THEN
    ALTER TABLE tramites_mesa_partes ALTER COLUMN codigo DROP NOT NULL;
  END IF;
END $$;

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'cliente_nombre'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'cliente'
  ) THEN
    ALTER TABLE cotizaciones_carga RENAME COLUMN cliente_nombre TO cliente;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'id_cliente'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'id_usuario'
  ) THEN
    ALTER TABLE cotizaciones_carga RENAME COLUMN id_cliente TO id_usuario;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'foto_url'
  ) THEN
    ALTER TABLE cotizaciones_carga ALTER COLUMN foto_url DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'cotizaciones_carga'
      AND column_name = 'codigo'
  ) THEN
    ALTER TABLE cotizaciones_carga ALTER COLUMN codigo DROP NOT NULL;
  END IF;
END $$;

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

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'citas_migraciones'
      AND column_name = 'codigo'
  ) THEN
    ALTER TABLE citas_migraciones ALTER COLUMN codigo DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'citas_migraciones'
      AND column_name = 'ciudadano'
  ) THEN
    ALTER TABLE citas_migraciones ALTER COLUMN ciudadano DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = current_schema()
      AND table_name = 'citas_migraciones'
      AND column_name = 'constancia_url'
  ) THEN
    ALTER TABLE citas_migraciones ALTER COLUMN constancia_url DROP NOT NULL;
  END IF;
END $$;