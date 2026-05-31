-- ══════════════════════════════════════════════════════════════
-- ASIPECA HelpHope — Schema PostgreSQL
-- Compatível com Supabase, Railway, Render, Neon, etc.
-- Execute no painel SQL do seu provedor
-- ══════════════════════════════════════════════════════════════

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ══ USUARIOS E AUTENTICAÇÃO ═══════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  role        VARCHAR(50)  NOT NULL CHECK (role IN ('admin','doutor','recepcao','familiar')),
  cargo       VARCHAR(100),
  status      VARCHAR(50)  NOT NULL DEFAULT 'pendente'
              CHECK (status IN ('ativo','inativo','pendente')),
  patient_id  UUID,
  patient_name VARCHAR(255),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_access TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role   ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- ══ APROVAÇÕES PENDENTES ══════════════════════════════════════

CREATE TABLE IF NOT EXISTS pending_approvals (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL,
  role      VARCHAR(50)  NOT NULL,
  cargo     VARCHAR(100),
  date      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ SALAS ═════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS salas (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome        VARCHAR(255) NOT NULL,
  descricao   TEXT,
  cor         VARCHAR(20)  DEFAULT '#4CAF50',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ PACIENTES ═════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS patients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sala_id     UUID REFERENCES salas(id) ON DELETE SET NULL,
  name        VARCHAR(255) NOT NULL,
  dob         VARCHAR(20),
  age         INTEGER DEFAULT 0,
  diagnosticos TEXT[]   DEFAULT '{}',
  progresso   INTEGER  DEFAULT 0,
  sessoes     INTEGER  DEFAULT 0,
  metas       INTEGER  DEFAULT 0,
  resp_nome   VARCHAR(255),
  resp_tel    VARCHAR(50),
  resp_email  VARCHAR(255),
  indicadores JSONB    DEFAULT '{"comunicacao":0,"socializacao":0,"comportamento":0,"autonomia":0}',
  evolucao    INTEGER[] DEFAULT '{0,0,0,0,0,0}',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_sala ON patients(sala_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);

-- ══ AGENDAMENTOS ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id       UUID REFERENCES patients(id) ON DELETE SET NULL,
  patient_name     VARCHAR(255) NOT NULL,
  professional_name VARCHAR(255) NOT NULL,
  sala_id          UUID REFERENCES salas(id) ON DELETE SET NULL,
  date_br          VARCHAR(20)  NOT NULL,   -- DD/MM/YYYY (formato exibição)
  time_str         VARCHAR(10)  NOT NULL,   -- HH:MM
  tipo             VARCHAR(100) DEFAULT 'Consulta',
  status           VARCHAR(50)  DEFAULT 'Agendado'
                   CHECK (status IN ('Agendado','Concluído','Cancelado')),
  attended         BOOLEAN,
  obs              TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appt_date     ON appointments(date_br);
CREATE INDEX IF NOT EXISTS idx_appt_patient  ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appt_status   ON appointments(status);

-- ══ PRONTUÁRIOS ═══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS medical_records (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tipo         VARCHAR(100),
  data         VARCHAR(20),
  titulo       TEXT,
  profissional VARCHAR(255),
  evolucao     TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON medical_records(patient_id);

-- ══ MEDICAMENTOS ══════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS medications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  nome       VARCHAR(255) NOT NULL,
  dosagem    VARCHAR(100),
  horarios   VARCHAR(20)[] DEFAULT '{}',
  dias       VARCHAR(20)[] DEFAULT '{}',
  ativo      BOOLEAN DEFAULT TRUE,
  obs        TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meds_patient ON medications(patient_id);

-- ══ ATIVIDADES ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS activities (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id     UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  nome           VARCHAR(255),
  tipo           VARCHAR(100),
  freq           VARCHAR(100),
  proxima        VARCHAR(100),
  profissional   VARCHAR(255),
  from_recepcao  BOOLEAN DEFAULT FALSE
);

-- ══ DOCUMENTOS ════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS documents (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tipo         VARCHAR(100),
  nome         VARCHAR(255),
  data         VARCHAR(20),
  profissional VARCHAR(255),
  url          TEXT,
  mine         BOOLEAN DEFAULT TRUE,
  conteudo     TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ LOGS DE SISTEMA ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(255),
  entity_type VARCHAR(100),
  entity_id   UUID,
  details     JSONB,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_user    ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON logs(created_at);

-- ══ CONFIGURAÇÕES ═════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS settings (
  key        VARCHAR(100) PRIMARY KEY,
  value      JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ══ TRIGGER: updated_at automático ════════════════════════════

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_appointments_updated
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ══ DADOS INICIAIS (Seed) ══════════════════════════════════════
-- Admin padrão (senha: 123456789)
INSERT INTO users (id, email, password_hash, name, role, cargo, status, created_at)
VALUES (
  uuid_generate_v4(),
  'admin@asipeca.br',
  '$2b$10$K8BnvSXq1vqL6yfqZr0RxOqt2pTmXgZ5qT5k4qKpJvHdP7bLqG5ry',
  'Pedro Oliveira',
  'admin',
  'Coordenador',
  'ativo',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Salas padrão
INSERT INTO salas (id, nome, descricao, cor) VALUES
  (uuid_generate_v4(), 'Sala Azul – TEA',              'Atendimentos para pacientes com TEA',  '#1976D2'),
  (uuid_generate_v4(), 'Sala Verde – Oncologia',        'Acompanhamento oncológico',              '#4CAF50'),
  (uuid_generate_v4(), 'Sala Rosa – Fonoaudiologia',    'Atendimento fonoaudiológico',           '#E91E63'),
  (uuid_generate_v4(), 'Sala Laranja – Terapia Ocu.',   'Sessões de terapia ocupacional',        '#FF9800'),
  (uuid_generate_v4(), 'Sala Roxa – Psicologia',        'Atendimento psicológico',               '#7B1FA2')
ON CONFLICT DO NOTHING;
