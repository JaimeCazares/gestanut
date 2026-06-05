-- ═══════════════════════════════════════════════════════════════════
--  GestaNut · Base de datos completa
--  Motor: MariaDB / MySQL  |  Charset: utf8mb4
-- ═══════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS gestanut
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestanut;

-- ───────────────────────────────────────────────────────────────────
-- 1. USUARIOS  (nutriólogos que usan el sistema)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE usuarios (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre              VARCHAR(150) NOT NULL,
  cedula_profesional  VARCHAR(30),
  especialidades      TEXT,
  whatsapp            VARCHAR(20),
  instagram           VARCHAR(100),
  afiliacion          VARCHAR(150),
  email               VARCHAR(150) UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ───────────────────────────────────────────────────────────────────
-- 2. PACIENTES
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE pacientes (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id          INT UNSIGNED NOT NULL,
  nombre              VARCHAR(150) NOT NULL,
  edad                TINYINT UNSIGNED NOT NULL,
  whatsapp            VARCHAR(20)  NOT NULL,
  tipo_consulta       ENUM('materna','recomp','peso') NOT NULL,
  peso_actual         DECIMAL(5,2) NOT NULL COMMENT 'kg',
  altura              DECIMAL(3,2) NOT NULL COMMENT 'm',
  modalidad           ENUM('presencial','online') DEFAULT 'presencial',
  objetivo_principal  TEXT,
  estado              ENUM('nueva','activa','seguimiento','inactiva') DEFAULT 'nueva',
  proxima_cita        DATETIME,
  ultima_visita       DATE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario (usuario_id),
  INDEX idx_estado  (estado)
);

-- ───────────────────────────────────────────────────────────────────
-- 3. HISTORIA CLÍNICA
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE historia_clinica (
  id                        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id               INT UNSIGNED NOT NULL UNIQUE,
  motivo_consulta           TEXT,
  antecedentes_patologicos  TEXT,
  alergias                  TEXT,
  intolerancias             TEXT,
  medicamentos_actuales     TEXT,
  cirugias_previas          TEXT,
  antecedentes_familiares   TEXT,
  actividad_fisica          TEXT,
  ocupacion                 VARCHAR(100),
  estado_civil              VARCHAR(50),
  tabaquismo                ENUM('nunca','exfumador','actual') DEFAULT 'nunca',
  consumo_alcohol           VARCHAR(50),
  biografia                 TEXT,
  created_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 4. CONSENTIMIENTO INFORMADO
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE consentimientos (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id       INT UNSIGNED NOT NULL UNIQUE,
  firmado           BOOLEAN DEFAULT FALSE,
  fecha_firma       DATE,
  contenido         TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 5. CONSULTAS / CITAS
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE consultas (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  usuario_id          INT UNSIGNED NOT NULL,
  fecha_programada    DATETIME NOT NULL,
  modalidad           ENUM('presencial','online') DEFAULT 'presencial',
  tipo                ENUM('primera','control','seguimiento','urgencia') DEFAULT 'control',
  estado              ENUM('programada','completada','cancelada') DEFAULT 'programada',
  notas_previas       TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  INDEX idx_fecha (fecha_programada),
  INDEX idx_paciente (paciente_id)
);

-- ───────────────────────────────────────────────────────────────────
-- 6. MEDICIONES CORPORALES
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE mediciones (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha               DATE NOT NULL,
  peso                DECIMAL(5,2) COMMENT 'kg',
  altura              DECIMAL(3,2) COMMENT 'm',
  cintura             DECIMAL(5,2) COMMENT 'cm',
  cadera              DECIMAL(5,2) COMMENT 'cm',
  brazo               DECIMAL(5,2) COMMENT 'cm',
  muslo               DECIMAL(5,2) COMMENT 'cm',
  porcentaje_grasa    DECIMAL(4,1) COMMENT '%',
  imc                 DECIMAL(4,1) COMMENT 'calculado',
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_fecha (paciente_id, fecha)
);

-- ───────────────────────────────────────────────────────────────────
-- 7. LABORATORIOS
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE laboratorios (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha_prueba        DATE NOT NULL,
  prueba              VARCHAR(100) NOT NULL,
  valor               DECIMAL(10,3),
  unidad              VARCHAR(20),
  rango_referencia    VARCHAR(100),
  estado              ENUM('ok','warn','alert') DEFAULT 'ok',
  interpretacion      TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_paciente_fecha (paciente_id, fecha_prueba)
);

-- ───────────────────────────────────────────────────────────────────
-- 8. RECUENTO 24 HORAS  (cabecera)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE recuentos_24h (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha_recuento      DATE NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 9. TIEMPOS DE COMIDA  (detalle del recuento)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE tiempos_comida (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  recuento_id         INT UNSIGNED NOT NULL,
  tipo_comida         VARCHAR(50) NOT NULL COMMENT 'Desayuno, Colación, Comida, Cena…',
  hora                TIME,
  alimentos           TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recuento_id) REFERENCES recuentos_24h(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 10. MONITOREO DE GLUCOSA
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE glucosa_monitoreo (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha               DATE NOT NULL,
  ayuno               SMALLINT UNSIGNED COMMENT 'mg/dL',
  pre_comida          SMALLINT UNSIGNED COMMENT 'mg/dL',
  post_comida         SMALLINT UNSIGNED COMMENT 'mg/dL',
  pre_cena            SMALLINT UNSIGNED COMMENT 'mg/dL',
  post_cena           SMALLINT UNSIGNED COMMENT 'mg/dL',
  nota                TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_fecha (paciente_id, fecha)
);

-- ───────────────────────────────────────────────────────────────────
-- 11. DATOS DE EMBARAZO
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE embarazo (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id           INT UNSIGNED NOT NULL UNIQUE,
  semanas_gestacion     TINYINT UNSIGNED,
  peso_preembarazo      DECIMAL(5,2) COMMENT 'kg',
  peso_actual           DECIMAL(5,2) COMMENT 'kg',
  imc_preembarazo       DECIMAL(4,1),
  diabetes_gestacional  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 12. DATOS DE LACTANCIA
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE lactancia (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL UNIQUE,
  semanas_lactancia   TINYINT UNSIGNED,
  produccion          ENUM('abundante','normal','insuficiente') DEFAULT 'normal',
  tetadas_por_dia     TINYINT UNSIGNED,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 13. SÍNTOMAS DE LACTANCIA
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE lactancia_sintomas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lactancia_id    INT UNSIGNED NOT NULL,
  sintoma         VARCHAR(100) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lactancia_id) REFERENCES lactancia(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 14. PESO DEL BEBÉ
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE peso_bebe (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  lactancia_id    INT UNSIGNED NOT NULL,
  semana          TINYINT UNSIGNED NOT NULL,
  peso_kg         DECIMAL(4,2) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lactancia_id) REFERENCES lactancia(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 15. PLANES NUTRICIONALES
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE planes_nutricionales (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha_creacion      DATE NOT NULL,
  calorias_diarias    SMALLINT UNSIGNED,
  proteina_g          SMALLINT UNSIGNED,
  carbohidratos_g     SMALLINT UNSIGNED,
  grasas_g            SMALLINT UNSIGNED,
  agua_litros         DECIMAL(3,1),
  descripcion         TEXT,
  activo              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  INDEX idx_paciente (paciente_id)
);

-- ───────────────────────────────────────────────────────────────────
-- 16. DETALLE DE COMIDAS DEL PLAN
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE plan_comidas (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  plan_id             INT UNSIGNED NOT NULL,
  tipo_comida         VARCHAR(50) NOT NULL,
  hora_recomendada    TIME,
  calorias_estimadas  SMALLINT UNSIGNED,
  descripcion         TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (plan_id) REFERENCES planes_nutricionales(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 17. SUPLEMENTACIÓN
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE suplementacion (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  nombre              VARCHAR(100) NOT NULL,
  dosis               VARCHAR(100),
  frecuencia          VARCHAR(50),
  razon               VARCHAR(200),
  fecha_inicio        DATE,
  fecha_fin           DATE,
  activo              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 18. NOTAS DE CONSULTA
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE notas_consulta (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  consulta_id         INT UNSIGNED,
  fecha_consulta      DATE NOT NULL,
  contenido           TEXT,
  nivel_bienestar     ENUM('muy_mal','mal','neutral','bien','muy_bien'),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
  FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE SET NULL,
  INDEX idx_paciente_fecha (paciente_id, fecha_consulta)
);

-- ───────────────────────────────────────────────────────────────────
-- 19. FINANZAS
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE finanzas (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id          INT UNSIGNED NOT NULL,
  paciente_id         INT UNSIGNED,
  fecha               DATE NOT NULL,
  concepto            VARCHAR(200) NOT NULL,
  tipo                ENUM('ingreso','gasto') NOT NULL,
  monto               DECIMAL(10,2) NOT NULL,
  pagado              BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE SET NULL,
  INDEX idx_fecha (fecha),
  INDEX idx_tipo  (tipo)
);

-- ───────────────────────────────────────────────────────────────────
-- 20. RECIBOS
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE recibos (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  finanza_id          INT UNSIGNED NOT NULL,
  folio               VARCHAR(20) UNIQUE,
  concepto            VARCHAR(200),
  monto               DECIMAL(10,2),
  fecha               DATE,
  enviado_whatsapp    BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (finanza_id) REFERENCES finanzas(id) ON DELETE CASCADE
);

-- ───────────────────────────────────────────────────────────────────
-- 21. GALERÍA / FOTOS DE PROGRESO
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE galeria_pacientes (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  paciente_id         INT UNSIGNED NOT NULL,
  fecha               DATE,
  tipo                VARCHAR(50) DEFAULT 'progreso',
  archivo_url         VARCHAR(255),
  descripcion         TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- ═══════════════════════════════════════════════════════════════════
--  FIN DEL SCRIPT
-- ═══════════════════════════════════════════════════════════════════
