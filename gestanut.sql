-- ══════════════════════════════════════════════════════════════════════
-- GestaNut · Base de datos MySQL
-- Sistema Clínico · Diana Zavala · Nutrióloga
-- Culiacán, Sinaloa · v3.0
-- ══════════════════════════════════════════════════════════════════════
-- Importar: phpMyAdmin → Importar → seleccionar este archivo
-- O desde terminal: mysql -u root -p < gestanut.sql
-- ══════════════════════════════════════════════════════════════════════

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `gestanut`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `gestanut`;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: pacientes
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `pacientes`;
CREATE TABLE `pacientes` (
  `id`                    INT            NOT NULL AUTO_INCREMENT,
  `nombre`                VARCHAR(150)   NOT NULL,
  `edad`                  INT            NOT NULL,
  `telefono`              VARCHAR(25)    NOT NULL DEFAULT '',
  `tipo`                  ENUM('materna','recomp','peso') NOT NULL,
  `tipo_label`            VARCHAR(60)    NOT NULL DEFAULT '',
  `icono`                 VARCHAR(10)    NOT NULL DEFAULT '',
  `badge`                 VARCHAR(30)    NOT NULL DEFAULT '',
  `avatar`                VARCHAR(30)    NOT NULL DEFAULT '',
  `iniciales`             VARCHAR(5)     NOT NULL DEFAULT '',
  `objetivo`              TEXT,
  `subtitulo`             TEXT,
  `peso`                  DECIMAL(5,2)   NOT NULL DEFAULT 0,
  `talla`                 DECIMAL(4,2)   NOT NULL DEFAULT 0,
  `peso_pre_embarazo`     DECIMAL(5,2)   DEFAULT NULL,
  `sem_gestacion`         INT            DEFAULT NULL,
  `lactancia`             TINYINT(1)     NOT NULL DEFAULT 0,
  `diabetes_gestacional`  TINYINT(1)     NOT NULL DEFAULT 0,
  `ultima_visita`         VARCHAR(60)    NOT NULL DEFAULT '—',
  `proxima_cita`          VARCHAR(120)   NOT NULL DEFAULT 'Pendiente',
  `estatus`               ENUM('new','active','follow-up') NOT NULL DEFAULT 'active',
  `online`                TINYINT(1)     NOT NULL DEFAULT 0,
  `bio`                   TEXT,
  `plan`                  TEXT,
  `fecha_registro`        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: historia_clinica
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `historia_clinica`;
CREATE TABLE `historia_clinica` (
  `id`             INT          NOT NULL AUTO_INCREMENT,
  `paciente_id`    INT          NOT NULL,
  `antecedentes`   TEXT,
  `alergias`       TEXT,
  `intolerancias`  TEXT,
  `medicamentos`   TEXT,
  `cirugias`       TEXT,
  `pat_familiares` TEXT,
  `act_fisica`     TEXT,
  `ocupacion`      VARCHAR(150),
  `estado_civil`   VARCHAR(50),
  `tabaco`         VARCHAR(20)  NOT NULL DEFAULT 'No',
  `alcohol`        VARCHAR(50)  NOT NULL DEFAULT 'No',
  `motivo`         TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: consentimientos
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `consentimientos`;
CREATE TABLE `consentimientos` (
  `id`           INT         NOT NULL AUTO_INCREMENT,
  `paciente_id`  INT         NOT NULL,
  `firmado`      TINYINT(1)  NOT NULL DEFAULT 0,
  `fecha`        DATE        DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: laboratorio
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `laboratorio`;
CREATE TABLE `laboratorio` (
  `id`           INT           NOT NULL AUTO_INCREMENT,
  `paciente_id`  INT           NOT NULL,
  `fecha`        VARCHAR(50)   NOT NULL DEFAULT '',
  `prueba`       VARCHAR(150)  NOT NULL DEFAULT '',
  `valor`        DECIMAL(10,2) NOT NULL DEFAULT 0,
  `rango`        VARCHAR(100)  NOT NULL DEFAULT '',
  `estatus`      ENUM('ok','warn','alert') NOT NULL DEFAULT 'ok',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: recuento_24h
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `recuento_24h`;
CREATE TABLE `recuento_24h` (
  `id`           INT         NOT NULL AUTO_INCREMENT,
  `paciente_id`  INT         NOT NULL,
  `fecha`        VARCHAR(50) NOT NULL DEFAULT '',
  `agua`         VARCHAR(50) NOT NULL DEFAULT '',
  `nota`         TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: recuento_tiempos
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `recuento_tiempos`;
CREATE TABLE `recuento_tiempos` (
  `id`           INT         NOT NULL AUTO_INCREMENT,
  `recuento_id`  INT         NOT NULL,
  `comida`       VARCHAR(60) NOT NULL DEFAULT '',
  `hora`         VARCHAR(10) NOT NULL DEFAULT '',
  `alimentos`    TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`recuento_id`) REFERENCES `recuento_24h`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: glucosa_data  (pacientes con diabetes gestacional)
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `glucosa_data`;
CREATE TABLE `glucosa_data` (
  `id`           INT           NOT NULL AUTO_INCREMENT,
  `paciente_id`  INT           NOT NULL,
  `fecha`        VARCHAR(50)   NOT NULL DEFAULT '',
  `ayuno`        DECIMAL(6,2)  DEFAULT NULL,
  `pre_comida`   DECIMAL(6,2)  DEFAULT NULL,
  `post_comida`  DECIMAL(6,2)  DEFAULT NULL,
  `pre_cena`     DECIMAL(6,2)  DEFAULT NULL,
  `post_cena`    DECIMAL(6,2)  DEFAULT NULL,
  `nota`         TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: lactancia_data  (pacientes en periodo de lactancia)
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `lactancia_pesos_bebe`;
DROP TABLE IF EXISTS `lactancia_data`;
CREATE TABLE `lactancia_data` (
  `id`           INT         NOT NULL AUTO_INCREMENT,
  `paciente_id`  INT         NOT NULL,
  `semanas`      INT         NOT NULL DEFAULT 0,
  `produccion`   VARCHAR(50) NOT NULL DEFAULT '',
  `tetadas`      INT         NOT NULL DEFAULT 0,
  `sintomas`     TEXT        COMMENT 'JSON array',
  `suplementos`  TEXT        COMMENT 'JSON array',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lactancia_pesos_bebe` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `lactancia_id` INT          NOT NULL,
  `semana`       INT          NOT NULL,
  `kg`           DECIMAL(4,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`lactancia_id`) REFERENCES `lactancia_data`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: mediciones  (antropometría)
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `mediciones`;
CREATE TABLE `mediciones` (
  `id`             INT          NOT NULL AUTO_INCREMENT,
  `paciente_id`    INT          NOT NULL,
  `cintura`        DECIMAL(5,2) NOT NULL DEFAULT 0,
  `cadera`         DECIMAL(5,2) NOT NULL DEFAULT 0,
  `brazo`          DECIMAL(5,2) NOT NULL DEFAULT 0,
  `muslo`          DECIMAL(5,2) NOT NULL DEFAULT 0,
  `fecha_registro` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: peso_historial
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `peso_historial`;
CREATE TABLE `peso_historial` (
  `id`               INT           NOT NULL AUTO_INCREMENT,
  `paciente_id`      INT           NOT NULL,
  `fecha`            VARCHAR(50)   NOT NULL DEFAULT '',
  `semana_gestacion` INT           DEFAULT NULL,
  `peso`             DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `delta`            DECIMAL(5,2)  DEFAULT NULL,
  `grasa`            DECIMAL(5,2)  DEFAULT NULL,
  `nota`             TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: notas_clinicas
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `notas_clinicas`;
CREATE TABLE `notas_clinicas` (
  `id`             INT      NOT NULL AUTO_INCREMENT,
  `paciente_id`    INT      NOT NULL,
  `nota`           TEXT,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: finanzas
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `finanzas`;
CREATE TABLE `finanzas` (
  `id`               INT           NOT NULL AUTO_INCREMENT,
  `fecha`            VARCHAR(50)   NOT NULL DEFAULT '',
  `concepto`         TEXT          NOT NULL,
  `tipo`             ENUM('in','out') NOT NULL,
  `monto`            DECIMAL(10,2) NOT NULL DEFAULT 0,
  `pagado`           TINYINT(1)    NOT NULL DEFAULT 0,
  `paciente_nombre`  VARCHAR(150)  NOT NULL DEFAULT '',
  `fecha_registro`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────
-- TABLA: agenda
-- ──────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS `agenda`;
CREATE TABLE `agenda` (
  `id`             INT      NOT NULL AUTO_INCREMENT,
  `paciente_id`    INT      DEFAULT NULL,
  `fecha`          DATE     DEFAULT NULL,
  `hora`           TIME     DEFAULT NULL,
  `modalidad`      ENUM('presencial','online') NOT NULL DEFAULT 'presencial',
  `tipo`           ENUM('control','primera','urgencia') NOT NULL DEFAULT 'control',
  `notas`          TEXT,
  `confirmado`     TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_registro` DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ══════════════════════════════════════════════════════════════════════
-- DATOS DE MUESTRA · 12 pacientes
-- ══════════════════════════════════════════════════════════════════════

INSERT INTO `pacientes` (`id`,`nombre`,`edad`,`telefono`,`tipo`,`tipo_label`,`icono`,`badge`,`avatar`,`iniciales`,`objetivo`,`subtitulo`,`peso`,`talla`,`peso_pre_embarazo`,`sem_gestacion`,`lactancia`,`diabetes_gestacional`,`ultima_visita`,`proxima_cita`,`estatus`,`online`,`bio`,`plan`) VALUES
(1,'Sofía López',28,'6671234567','materna','Materno-infantil','🤰','b-blush','av-c3','SL','Embarazo saludable','28 sem · Bajo riesgo',72.30,1.62,64.50,28,0,0,'28 Abr 2025','6 May · Hoy 9:00 AM','active',0,'Primer embarazo. Antes del embarazo en peso normal. Tolerancia gastrointestinal buena. Sin enfermedades previas.','2,200 kcal · 6 tiempos · Hierro 45mg, Ácido Fólico 600mcg, DHA 200mg'),
(2,'María Rodríguez',32,'6679876543','recomp','Recomposición','⚖️','b-sage','av-c1','MR','Ganancia de músculo','Crossfit 5 días/sem',63.10,1.68,NULL,NULL,0,0,'25 Abr 2025','6 May · Hoy 10:30 AM','active',0,'Hace crossfit 5 días/semana. Buena adherencia. Objetivo: ganar 2 kg masa magra en 12 semanas.','2,400 kcal · 35% prot · 40% carbs · 25% grasa · Creatina 5g/día'),
(3,'Andrea González',24,'6675551234','peso','Control de peso','📉','b-terra','av-c2','AG','Bajar 8 kg','1ª consulta hoy',78.00,1.60,NULL,NULL,0,0,'—','6 May · Hoy 12:00 PM','new',0,'Primera consulta. Sin antecedentes patológicos. Estilo de vida sedentario, oficina 9 hrs.','Por definir en primera consulta'),
(4,'Karla Vega',30,'6678889999','materna','Materno-infantil','🤱','b-blush','av-c3','KV','Lactancia exclusiva','Post-parto 3 meses',66.50,1.65,60.00,NULL,1,0,'20 Abr 2025','6 May · Hoy 3:00 PM','active',1,'Bebé de 3 meses. Lactancia exclusiva. Quiere recuperar composición sin afectar producción de leche.','2,500 kcal · alto en proteína y calcio · Suplemento DHA postnatal'),
(5,'Isabel Ramos',31,'6672223333','materna','Materno-infantil','🤰','b-blush','av-c3','IR','Embarazo saludable','32 sem · Diabetes gestacional',75.80,1.69,67.50,32,0,1,'24 Abr 2025','9 May · 9:30 AM','active',0,'Tercer embarazo. Diabetes gestacional controlada con dieta. Sin medicamentos.','2,100 kcal · CHO complejos · 6 tiempos · Sin azúcares simples'),
(6,'María José Pérez',27,'6675556789','peso','Control de peso','📉','b-terra','av-c2','MJ','Bajar 10 kg','Sin datos 8 días ⚠️',81.20,1.63,NULL,NULL,0,0,'18 Abr 2025','8 May · 10:00 AM','follow-up',0,'Hipotiroidismo controlado con levotiroxina. Estrés laboral alto. SOP diagnosticado 2022.','1,700 kcal · Bajo índice glucémico · Sin lactosa · Inositol 4g/día'),
(7,'Lucía Castro',33,'6677778888','peso','Control de peso','📉','b-terra','av-c2','LC','Bajar 12 kg','Activa',84.30,1.67,NULL,NULL,0,0,'15 Abr 2025','8 May · 10:00 AM','active',0,'Sin patologías activas. Estrés laboral moderado. Antecedentes familiares de DM2.','1,700 kcal · Mediterránea · Caminata 30min/día'),
(8,'Laura Méndez',29,'6671112222','recomp','Recomposición','⚖️','b-sage','av-c1','LM','Definición corporal','Gym + cardio',58.40,1.63,NULL,NULL,0,0,'28 Abr 2025','5 May · 10:30 AM','active',0,'Adherencia excelente. Foco en definición. Entrena 4 veces por semana.','2,000 kcal · Déficit moderado · Proteína 1.8g/kg'),
(9,'Elena Torres',35,'6673334444','materna','Materno-infantil','🤰','b-blush','av-c3','ET','Embarazo saludable','14 sem · 1er trimestre',70.20,1.66,68.00,14,0,0,'22 Abr 2025','5 May · 1:00 PM','active',0,'Segundo embarazo. Náuseas matutinas leves. Aversión a carnes rojas en 1er trimestre.','2,000 kcal · 1er trim · Ácido fólico 400mcg'),
(10,'Sandra Flores',38,'6674445555','recomp','Recomposición','⚖️','b-sage','av-c1','SF','Recomposición post 40','Pre-menopausia',61.00,1.61,NULL,NULL,0,0,'21 Abr 2025','9 May · 11:00 AM','active',0,'Pre-menopausia. Cambios hormonales. Foco en preservar masa muscular y salud ósea.','1,900 kcal · Proteína alta · Calcio + Vit D · Fuerza 3x/sem'),
(11,'Gabriela Morales',26,'5559998888','recomp','Recomposición','⚖️','b-sage','av-c1','GM','Recomposición deportiva','CDMX · Online',55.20,1.59,NULL,NULL,0,0,'19 Abr 2025','8 May · 12:30 PM','active',1,'Corredora aficionada. Maratón en 4 meses. Plan periodizado por intensidad de entrenamiento.','2,200 kcal · Periodización · Carbs altos en días largos'),
(12,'Valeria Cruz',22,'6699998888','peso','Control de peso','📉','b-terra','av-c2','VC','Bajar 5 kg · Online','Mazatlán',67.40,1.62,NULL,NULL,0,0,'17 Abr 2025','10 May · 9:30 AM','active',1,'Estudiante universitaria. Vive en Mazatlán. Quiere bajar para una boda en julio.','1,600 kcal · Flexible · Recetas para estudiantes');

-- ──────────────────────────────────────────────────────────────────────
-- Historia clínica
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `historia_clinica` (`paciente_id`,`antecedentes`,`alergias`,`intolerancias`,`medicamentos`,`cirugias`,`pat_familiares`,`act_fisica`,`ocupacion`,`estado_civil`,`tabaco`,`alcohol`,`motivo`) VALUES
(1,'Sin antecedentes patológicos','Sin alergias conocidas','Sin intolerancias documentadas','Suplemento prenatal (Ácido fólico 600mcg, DHA 200mg)','Ninguna','DM2 en abuelo materno','Caminata 30 min/3x sem','Maestra de primaria','Casada','No','No','Control nutricional prenatal'),
(2,'Sin antecedentes','Sin alergias','Intolerancia leve al gluten (no celíaca)','Creatina 5g/día (automedicada)','Apendicectomía 2018','Ninguna relevante','Crossfit 5x/sem + caminata','Diseñadora gráfica','Soltera','No','Ocasional (1x/sem)','Optimizar composición corporal'),
(3,'Sin antecedentes','Sin alergias','Sin intolerancias','Ninguno','Ninguna','DM2 en madre, HTA en padre','Ninguna actualmente','Contadora','Soltera','No','Social (fin de semana)','Bajar de peso, mejorar energía'),
(4,'Cesárea programada','Sin alergias','Sin intolerancias','DHA postnatal, Calcio 1200mg, Fe 30mg','Cesárea Feb 2025','Ninguna relevante','Caminata suave 20 min/día','Farmacéutica (licencia maternal)','Casada','No','No','Apoyo nutricional lactancia + recuperación postparto'),
(5,'Diabetes gestacional (actual)','Sin alergias','Sin intolerancias','Suplemento prenatal, metformina suspendida por control con dieta','2 partos previos (vaginales)','DM2 en ambos padres','Caminata 20 min/día con autorización obstétrica','Ama de casa','Casada','No','No','Control glucémico + nutrición fetal'),
(6,'Hipotiroidismo, SOP','Sin alergias','Intolerancia a la lactosa leve','Levotiroxina 50mcg/día','Ninguna','Hipotiroidismo en madre','Yoga 2x/sem','Abogada','Soltera','No','Ocasional','Control de peso con SOP e hipotiroidismo'),
(7,'Sin antecedentes','Sin alergias','Sin intolerancias','Ninguno','Ninguna','DM2 en padre','Caminata 30 min/día','Enfermera','Casada','No','No','Bajar de peso, prevenir DM2'),
(8,'Sin antecedentes','Sin alergias','Sin intolerancias','Proteína whey (suplemento)','Ninguna','Ninguna','Gym 4x/sem + cardio 2x/sem','Maestra','Casada','No','Ocasional','Definición muscular, reducir grasa corporal'),
(9,'Sin antecedentes','Sin alergias','Sin intolerancias','Ácido fólico 400mcg','Ninguna','Ninguna relevante','Yoga prenatal 2x/sem','Contadora','Casada','No','No','Control nutricional 2do embarazo'),
(10,'Pre-menopausia','Sin alergias','Sin intolerancias','Calcio 600mg + Vit D3 1000UI','Ninguna','Osteoporosis en madre','Fuerza 3x/sem + pilates','Directora de escuela','Divorciada','No','No','Preservar músculo, salud ósea, manejo de síntomas'),
(11,'Sin antecedentes','Alergia a mariscos','Sin intolerancias','Hierro 30mg (preventivo)','Ninguna','Ninguna','Correr 5-7x/sem (60-80km semanales)','Ingeniera en software','Soltera','No','No','Optimizar rendimiento deportivo para maratón'),
(12,'Sin antecedentes','Sin alergias','Sin intolerancias','Anticonceptivos orales','Ninguna','Sobrepeso en madre','Ninguna regular','Estudiante de medicina','Soltera','No','Fin de semana','Bajar 5 kg para evento en julio');

-- ──────────────────────────────────────────────────────────────────────
-- Consentimientos
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `consentimientos` (`paciente_id`,`firmado`,`fecha`) VALUES
(1,1,'2025-03-17'),
(2,1,'2025-03-01'),
(3,0,NULL),
(4,1,'2025-03-05'),
(5,1,'2025-03-01'),
(6,1,'2025-02-15'),
(7,1,'2025-02-01'),
(8,1,'2025-03-01'),
(9,1,'2025-04-10'),
(10,1,'2025-02-15'),
(11,1,'2025-03-01'),
(12,1,'2025-03-15');

-- ──────────────────────────────────────────────────────────────────────
-- Laboratorio
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `laboratorio` (`paciente_id`,`fecha`,`prueba`,`valor`,`rango`,`estatus`) VALUES
-- Sofía López
(1,'28 Abr 2025','Hemoglobina',12.80,'11-16 g/dL','ok'),
(1,'28 Abr 2025','Hematocrito',38.50,'33-47%','ok'),
(1,'28 Abr 2025','Glucosa ayuno',88.00,'70-92 mg/dL','ok'),
(1,'28 Abr 2025','Ferritina',22.00,'13-150 ng/mL','ok'),
(1,'28 Abr 2025','Ácido fólico sérico',9.80,'>5.9 ng/mL','ok'),
(1,'28 Abr 2025','TSH',2.10,'0.5-4.5 mUI/L','ok'),
-- María Rodríguez
(2,'01 Mar 2025','Glucosa',91.00,'70-100 mg/dL','ok'),
(2,'01 Mar 2025','Colesterol total',172.00,'<200 mg/dL','ok'),
(2,'01 Mar 2025','Triglicéridos',98.00,'<150 mg/dL','ok'),
(2,'01 Mar 2025','HDL',62.00,'>50 mg/dL','ok'),
(2,'01 Mar 2025','LDL',91.00,'<130 mg/dL','ok'),
(2,'01 Mar 2025','Hemoglobina',13.50,'12-16 g/dL','ok'),
-- Andrea González (sin laboratorio)
-- Karla Vega
(4,'02 Abr 2025','Hemoglobina',11.80,'12-16 g/dL','warn'),
(4,'02 Abr 2025','Ferritina',10.00,'13-150 ng/mL','alert'),
(4,'02 Abr 2025','Calcio sérico',9.10,'8.5-10.5 mg/dL','ok'),
(4,'02 Abr 2025','Vitamina D',22.00,'30-100 ng/mL','warn'),
(4,'02 Abr 2025','Glucosa',85.00,'70-100 mg/dL','ok'),
-- Isabel Ramos
(5,'24 Abr 2025','Glucosa ayuno',94.00,'<92 mg/dL','warn'),
(5,'24 Abr 2025','Glucosa 1h postprandial',138.00,'<140 mg/dL','ok'),
(5,'24 Abr 2025','HbA1c',5.40,'<5.7%','ok'),
(5,'24 Abr 2025','Hemoglobina',11.50,'11-16 g/dL','ok'),
(5,'24 Abr 2025','Triglicéridos',198.00,'<150 mg/dL (emb.)','warn'),
-- María José Pérez
(6,'15 Abr 2025','TSH',3.80,'0.5-4.5 mUI/L','ok'),
(6,'15 Abr 2025','T4 libre',1.10,'0.8-1.8 ng/dL','ok'),
(6,'15 Abr 2025','Glucosa',104.00,'70-100 mg/dL','warn'),
(6,'15 Abr 2025','Insulina',18.00,'<15 mUI/L','warn'),
(6,'15 Abr 2025','Índice HOMA',4.70,'<2.5','alert'),
(6,'15 Abr 2025','Testosterona libre',8.20,'0.5-5.5 pg/mL','alert'),
-- Lucía Castro
(7,'15 Abr 2025','Glucosa',98.00,'70-100 mg/dL','ok'),
(7,'15 Abr 2025','Colesterol total',195.00,'<200 mg/dL','ok'),
(7,'15 Abr 2025','Triglicéridos',142.00,'<150 mg/dL','ok'),
(7,'15 Abr 2025','Hemoglobina',13.20,'12-16 g/dL','ok'),
-- Laura Méndez
(8,'28 Abr 2025','Hemoglobina',13.80,'12-16 g/dL','ok'),
(8,'28 Abr 2025','Glucosa',86.00,'70-100 mg/dL','ok'),
(8,'28 Abr 2025','Creatinina',0.80,'0.5-1.1 mg/dL','ok'),
-- Elena Torres
(9,'22 Abr 2025','Hemoglobina',12.20,'11-16 g/dL','ok'),
(9,'22 Abr 2025','Glucosa ayuno',82.00,'70-92 mg/dL','ok'),
(9,'22 Abr 2025','TSH',1.80,'0.5-4.5 mUI/L','ok'),
(9,'22 Abr 2025','Ferritina',18.00,'13-150 ng/mL','ok'),
-- Sandra Flores
(10,'21 Abr 2025','FSH',18.00,'3.5-12.5 mUI/mL','warn'),
(10,'21 Abr 2025','Estradiol',42.00,'15-350 pg/mL','ok'),
(10,'21 Abr 2025','Calcio sérico',9.40,'8.5-10.5 mg/dL','ok'),
(10,'21 Abr 2025','Vitamina D',28.00,'30-100 ng/mL','warn'),
(10,'21 Abr 2025','Colesterol total',210.00,'<200 mg/dL','warn'),
-- Gabriela Morales
(11,'19 Abr 2025','Hemoglobina',13.20,'12-16 g/dL','ok'),
(11,'19 Abr 2025','Ferritina',25.00,'13-150 ng/mL','ok'),
(11,'19 Abr 2025','Glucosa',84.00,'70-100 mg/dL','ok'),
(11,'19 Abr 2025','Vitamina D',38.00,'30-100 ng/mL','ok'),
-- Valeria Cruz
(12,'15 Mar 2025','Glucosa',90.00,'70-100 mg/dL','ok'),
(12,'15 Mar 2025','Hemoglobina',12.80,'12-16 g/dL','ok');

-- ──────────────────────────────────────────────────────────────────────
-- Recuento 24 horas
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `recuento_24h` (`id`,`paciente_id`,`fecha`,`agua`,`nota`) VALUES
(1, 1,'28 Abr 2025','1.5 L','Le cuesta tomar agua, prefiere agua de sabor sin azúcar'),
(2, 2,'25 Abr 2025','2.8 L','Muy buena hidratación. Plan muy bien seguido este día.'),
(3, 3,'','',''),
(4, 4,'20 Abr 2025','2.0 L','Aumentar ingesta calórica y de hierro'),
(5, 5,'24 Abr 2025','2.5 L','Buen apego. Evita azúcares. Porciones de carbohidratos controladas.'),
(6, 6,'18 Abr 2025','0.8 L','Comidas irregulares. Poca hidratación. Saltó desayuno temprano.'),
(7, 7,'15 Abr 2025','1.8 L','Buen apego. Puede mejorar hidratación.'),
(8, 8,'28 Abr 2025','2.5 L','Adherencia excelente. Plan muy bien seguido.'),
(9, 9,'22 Abr 2025','1.5 L','Náuseas dificultan ingesta matutina. Tolera bien alimentos bland.'),
(10,10,'21 Abr 2025','2.2 L','Muy buena adherencia. Plan bien seguido.'),
(11,11,'19 Abr 2025','3.2 L','Excelente hidratación. Plan bien periodizado.'),
(12,12,'17 Abr 2025','1.2 L','Horarios irregulares por universidad. Mejorar estructura de tiempos.');

-- Tiempos de comida (recuento_id corresponde al id de recuento_24h)
INSERT INTO `recuento_tiempos` (`recuento_id`,`comida`,`hora`,`alimentos`) VALUES
-- Sofía López (recuento 1)
(1,'Desayuno','8:00','Avena 1 taza + plátano + leche 1 vaso'),
(1,'Colación','11:00','Manzana + 10 almendras'),
(1,'Comida','2:30','Caldo de pollo + arroz 1 taza + ensalada'),
(1,'Colación','5:00','Yogurt natural + granola'),
(1,'Cena','8:00','Huevo 2 pzs + frijoles + tortillas 2'),
-- María Rodríguez (recuento 2)
(2,'Pre-entreno','6:00','Plátano + café negro'),
(2,'Post-entreno','8:30','Proteína whey 1 scoop + leche'),
(2,'Desayuno','9:30','Huevo 3 pzs + avocado + tostadas integrales'),
(2,'Comida','2:00','Pechuga 200g + arroz + brócoli'),
(2,'Cena','8:00','Salmón 150g + ensalada + camote'),
-- Andrea González (recuento 3 vacío)
-- Karla Vega (recuento 4)
(4,'Madrugada','3:00','Vaso de leche + galletas'),
(4,'Desayuno','9:00','Licuado de plátano y avena + tostadas'),
(4,'Comida','2:00','Caldo de res + frijoles + arroz'),
(4,'Merienda','5:00','Fruta + queso'),
(4,'Cena','9:00','Quesadillas 2 + nopales'),
-- Isabel Ramos (recuento 5)
(5,'Desayuno','7:30','2 huevos + 1 tortilla + nopales + café sin azúcar'),
(5,'Colación','10:30','1 manzana pequeña + queso panela 30g'),
(5,'Comida','2:00','Pollo 150g + calabaza + arroz integral ½ taza'),
(5,'Colación','5:30','Pepino + jícama + limón (sin chili)'),
(5,'Cena','7:30','Sopa de verduras + 1 rebanada pan integral'),
-- María José Pérez (recuento 6)
(6,'Desayuno','10:00','Café con leche + pan dulce'),
(6,'Comida','3:00','Tacos de carnitas x3 + agua de Jamaica'),
(6,'Merienda','6:00','Papitas + refresco'),
(6,'Cena','9:30','Cereal con leche'),
-- Lucía Castro (recuento 7)
(7,'Desayuno','7:00','Yogurt + fruta + café'),
(7,'Colación','10:30','Nueces + manzana'),
(7,'Comida','2:30','Sopa de verduras + pollo + ensalada'),
(7,'Cena','7:30','Quesadillas 2 + frijoles'),
-- Laura Méndez (recuento 8)
(8,'Pre-entreno','6:30','Plátano + café'),
(8,'Post-entreno','9:00','Whey protein + agua'),
(8,'Desayuno','10:00','Huevo 3 pzs + avocado + pan integral'),
(8,'Comida','2:00','Pechuga + quinoa + brócoli'),
(8,'Cena','8:00','Salmón + ensalada + aguacate'),
-- Elena Torres (recuento 9)
(9,'Desayuno','8:00','Galletas saladas + té + manzana (náuseas)'),
(9,'Colación','11:00','Yogurt + granola'),
(9,'Comida','2:00','Sopa de pasta + pechuga + ensalada'),
(9,'Cena','8:00','Quesadillas + frijoles'),
-- Sandra Flores (recuento 10)
(10,'Desayuno','7:30','Avena + proteína + frutos rojos'),
(10,'Colación','11:00','Nueces + té verde'),
(10,'Comida','2:00','Salmon + quinoa + espinacas'),
(10,'Cena','7:30','Tofu + verduras salteadas'),
-- Gabriela Morales (recuento 11)
(11,'Pre-carrera','6:00','Plátano + gel energético'),
(11,'Post-carrera','8:30','Licuado proteína + avena'),
(11,'Almuerzo','11:00','Huevo 3 pzs + tostadas + aguacate'),
(11,'Comida','2:00','Pechuga + pasta integral + brócoli'),
(11,'Cena','8:00','Atún + camote + ensalada'),
-- Valeria Cruz (recuento 12)
(12,'Desayuno','10:00','Cereal + leche'),
(12,'Comida','3:00','Comida de cafetería + agua'),
(12,'Cena','9:00','Tacos x2 + agua de sabor');

-- ──────────────────────────────────────────────────────────────────────
-- Glucosa (Isabel Ramos, id=5 — diabetes gestacional)
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `glucosa_data` (`paciente_id`,`fecha`,`ayuno`,`pre_comida`,`post_comida`,`pre_cena`,`post_cena`,`nota`) VALUES
(5,'28 Abr',91,98,132,95,128,'Buen control'),
(5,'27 Abr',88,95,140,93,135,'Post-comida límite'),
(5,'26 Abr',94,100,135,96,130,'Ayuno ligeramente alto'),
(5,'25 Abr',87,94,128,90,122,'Día excelente'),
(5,'24 Abr',92,97,142,94,138,'Post-comida alto');

-- ──────────────────────────────────────────────────────────────────────
-- Lactancia (Karla Vega, id=4)
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `lactancia_data` (`id`,`paciente_id`,`semanas`,`produccion`,`tetadas`,`sintomas`,`suplementos`) VALUES
(1,4,12,'Abundante',8,'["Cansancio extremo","Sed constante"]','["DHA 500mg","Calcio 1200mg","Hierro 30mg","Vitamina D3 2000UI"]');

INSERT INTO `lactancia_pesos_bebe` (`lactancia_id`,`semana`,`kg`) VALUES
(1,1,3.10),
(1,4,3.90),
(1,8,5.20),
(1,12,6.10);

-- ──────────────────────────────────────────────────────────────────────
-- Mediciones antropométricas
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `mediciones` (`paciente_id`,`cintura`,`cadera`,`brazo`,`muslo`) VALUES
(1,88,104,28,56),
(2,72,96,30,58),
(3,88,108,32,62),
(4,80,100,28,56),
(5,96,110,30,60),
(6,92,108,32,62),
(7,96,114,34,64),
(8,68,94,28,54),
(9,82,102,30,58),
(10,74,96,28,56),
(11,66,90,26,52),
(12,78,100,28,58);

-- ──────────────────────────────────────────────────────────────────────
-- Historial de peso
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `peso_historial` (`paciente_id`,`fecha`,`semana_gestacion`,`peso`,`delta`,`grasa`,`nota`) VALUES
-- Sofía López (con semanas de gestación)
(1,'17 Mar',22,71.00,0.60,NULL,'Inicio bien'),
(1,'31 Mar',24,71.40,0.40,NULL,'+200kcal/día'),
(1,'14 Abr',26,71.90,0.50,NULL,'Hierro normal'),
(1,'28 Abr',28,72.30,0.40,NULL,'Dentro de rango'),
-- María Rodríguez (con % grasa)
(2,'01 Mar',NULL,62.40,NULL,24.00,'Inicio'),
(2,'15 Mar',NULL,62.60,NULL,23.20,'Buena adaptación'),
(2,'01 Abr',NULL,62.90,NULL,22.50,'Composición mejora'),
(2,'15 Abr',NULL,63.00,NULL,22.00,'Avance constante'),
(2,'25 Abr',NULL,63.10,NULL,21.40,'Excelente progreso'),
-- Andrea González (sin historial)
-- Karla Vega (post-parto)
(4,'05 Mar',NULL,69.00,NULL,NULL,'Post-parto inmediato'),
(4,'02 Abr',NULL,67.50,NULL,NULL,'Reducción gradual'),
(4,'20 Abr',NULL,66.50,NULL,NULL,'Producción láctea estable'),
-- Isabel Ramos (embarazo con DG)
(5,'01 Mar',24,73.50,0.60,NULL,'Glucosa 92'),
(5,'15 Mar',26,74.00,0.50,NULL,'Plan bajo CHO'),
(5,'01 Abr',28,74.70,0.70,NULL,'Glucosa controlada'),
(5,'15 Abr',30,75.30,0.60,NULL,'Excelente control'),
(5,'24 Abr',32,75.80,0.50,NULL,'Manteniendo'),
-- María José Pérez
(6,'15 Feb',NULL,84.00,NULL,NULL,NULL),
(6,'01 Mar',NULL,83.20,NULL,NULL,NULL),
(6,'15 Mar',NULL,82.50,NULL,NULL,NULL),
(6,'01 Abr',NULL,81.90,NULL,NULL,NULL),
(6,'18 Abr',NULL,81.20,NULL,NULL,NULL),
-- Lucía Castro
(7,'15 Feb',NULL,88.00,NULL,NULL,NULL),
(7,'01 Mar',NULL,86.50,NULL,NULL,NULL),
(7,'15 Mar',NULL,85.40,NULL,NULL,NULL),
(7,'01 Abr',NULL,84.80,NULL,NULL,NULL),
(7,'15 Abr',NULL,84.30,NULL,NULL,NULL),
-- Laura Méndez (con % grasa)
(8,'01 Mar',NULL,60.20,NULL,22.50,NULL),
(8,'15 Mar',NULL,59.50,NULL,21.00,NULL),
(8,'01 Abr',NULL,58.90,NULL,19.80,NULL),
(8,'15 Abr',NULL,58.50,NULL,19.00,NULL),
(8,'28 Abr',NULL,58.40,NULL,18.40,NULL),
-- Elena Torres (1er trimestre)
(9,'14 Abr',12,69.50,1.50,NULL,'Inicio control'),
(9,'22 Abr',14,70.20,0.70,NULL,'Náuseas mejorando'),
-- Sandra Flores (con % grasa)
(10,'15 Feb',NULL,62.50,NULL,28.00,NULL),
(10,'15 Mar',NULL,61.80,NULL,27.00,NULL),
(10,'15 Abr',NULL,61.00,NULL,25.50,NULL),
-- Gabriela Morales (corredora)
(11,'01 Mar',NULL,54.80,NULL,21.00,NULL),
(11,'15 Mar',NULL,55.00,NULL,20.50,NULL),
(11,'01 Abr',NULL,55.10,NULL,20.00,NULL),
(11,'19 Abr',NULL,55.20,NULL,19.50,NULL),
-- Valeria Cruz
(12,'15 Mar',NULL,69.50,NULL,NULL,NULL),
(12,'01 Abr',NULL,68.50,NULL,NULL,NULL),
(12,'17 Abr',NULL,67.40,NULL,NULL,NULL);

-- ──────────────────────────────────────────────────────────────────────
-- Finanzas · Mayo 2025
-- ──────────────────────────────────────────────────────────────────────
INSERT INTO `finanzas` (`id`,`fecha`,`concepto`,`tipo`,`monto`,`pagado`,`paciente_nombre`) VALUES
(1, '06 May','Consulta prenatal · Sofía López','in',400.00,0,'Sofía López'),
(2, '06 May','Consulta online · Karla Vega','in',350.00,0,'Karla Vega'),
(3, '05 May','Recomposición · Laura Méndez','in',300.00,1,'Laura Méndez'),
(4, '05 May','Prenatal · Elena Torres','in',400.00,1,'Elena Torres'),
(5, '04 May','Suscripción Canva Pro','out',200.00,1,''),
(6, '03 May','Recomposición · María Rodríguez','in',300.00,1,'María Rodríguez'),
(7, '03 May','Materiales de consulta','out',180.00,1,''),
(8, '02 May','1ª Consulta · Andrea G.','in',400.00,1,'Andrea González'),
(9, '01 May','Transporte (Uber)','out',160.00,1,''),
(10,'30 Abr','Online · Valeria Cruz','in',280.00,1,'Valeria Cruz'),
(11,'29 Abr','Plataforma videollamadas','out',240.00,1,''),
(12,'28 Abr','Recomposición · Sandra Flores','in',300.00,1,'Sandra Flores');

-- Resetear AUTO_INCREMENT
ALTER TABLE `pacientes`        AUTO_INCREMENT = 13;
ALTER TABLE `historia_clinica` AUTO_INCREMENT = 13;
ALTER TABLE `consentimientos`  AUTO_INCREMENT = 13;
ALTER TABLE `recuento_24h`     AUTO_INCREMENT = 13;
ALTER TABLE `finanzas`         AUTO_INCREMENT = 13;

-- ══════════════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- Verifica con: SELECT COUNT(*) FROM pacientes;  → debe devolver 12
-- ══════════════════════════════════════════════════════════════════════
