// ══════════════════════════════════════════════════════════════
// ASIPECA HelpHope — Backend API
// Node.js + Express + PostgreSQL
// ══════════════════════════════════════════════════════════════

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');
const { Pool }   = require('pg');
const { v4: uuidv4 } = require('uuid');
const rateLimit  = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── DATABASE CONNECTION ────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco:', err.message);
  } else {
    console.log('✅ Conectado ao PostgreSQL');
  }
});

// ── MIDDLEWARE ─────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public')); // serve the HTML frontend

// CORS — permite o arquivo HTML aberto localmente (file://) e origens configuradas
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
      cb(null, true);
    } else {
      cb(new Error('CORS: Origem não permitida: ' + origin));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true });
app.use('/api/', limiter);

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }});

// ── JWT HELPERS ────────────────────────────────────────────────
const JWT_SECRET  = process.env.JWT_SECRET || 'asipeca_dev_secret_CHANGE_IN_PRODUCTION';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'Token ausente' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch(e) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'Sem permissão para esta ação' });
    }
    next();
  };
}

// ── LOG HELPER ─────────────────────────────────────────────────
async function log(userId, action, entityType, entityId, details) {
  try {
    await pool.query(
      'INSERT INTO logs(id,user_id,action,entity_type,entity_id,details) VALUES($1,$2,$3,$4,$5,$6)',
      [uuidv4(), userId||null, action, entityType, entityId||null, JSON.stringify(details||{})]
    );
  } catch(e) { /* log errors shouldn't break the request */ }
}

// ══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Email ou senha incorretos' });
    if (user.status === 'inativo') return res.status(403).json({ error: 'Conta desativada' });
    if (user.status === 'pendente') return res.status(403).json({ error: 'Conta aguardando aprovação' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Email ou senha incorretos' });

    // Update last_access
    await pool.query('UPDATE users SET last_access=NOW() WHERE id=$1', [user.id]);

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    const { password_hash, ...safeUser } = user;
    await log(user.id, 'LOGIN', 'user', user.id, { email });
    res.json({ token, user: safeUser });
  } catch(e) {
    res.status(500).json({ error: 'Erro interno: ' + e.message });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { name, email, password, role, cargo, patientName } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios' });
  }
  if (password.length < 6) return res.status(400).json({ error: 'Senha mínima: 6 caracteres' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [email]);
    if (existing.rows.length) return res.status(409).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users(id,email,password_hash,name,role,cargo,status,patient_name,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,NOW())',
      [userId, email, hash, name, role, cargo||'', 'pendente', patientName||null]
    );

    // Add to pending_approvals
    await pool.query(
      'INSERT INTO pending_approvals(id,name,email,role,cargo,date) VALUES($1,$2,$3,$4,$5,NOW())',
      [uuidv4(), name, email, role, cargo||'']
    );

    res.status(201).json({ message: 'Conta criada. Aguarde aprovação do administrador.' });
  } catch(e) {
    res.status(500).json({ error: 'Erro interno: ' + e.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id,email,name,role,cargo,status,patient_id,patient_name,created_at,last_access FROM users WHERE id=$1', [req.user.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════
// USERS ROUTES (Admin only)
// ══════════════════════════════════════════════════════════════

// GET /api/users
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id,email,name,role,cargo,status,patient_id,patient_name,created_at,last_access FROM users ORDER BY created_at DESC'
    );
    // Map to frontend format
    const users = result.rows.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role, cargo: u.cargo||'',
      status: u.status, patientId: u.patient_id, patientName: u.patient_name,
      createdAt: u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '',
      lastAccess: u.last_access ? new Date(u.last_access).toLocaleDateString('pt-BR') : '-',
      password: '***' // never return hash
    }));
    res.json(users);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/:id
app.patch('/api/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { name, cargo, status, role, patientId, patientName, password } = req.body;
  const { id } = req.params;
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, id]);
    }
    await pool.query(
      'UPDATE users SET name=COALESCE($1,name), cargo=COALESCE($2,cargo), status=COALESCE($3,status), role=COALESCE($4,role), patient_id=$5, patient_name=$6 WHERE id=$7',
      [name, cargo, status, role, patientId||null, patientName||null, id]
    );
    await log(req.user.id, 'UPDATE_USER', 'user', id, { name, status, role });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/users/:id
app.delete('/api/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/users (admin create)
app.post('/api/users', authMiddleware, requireRole('admin'), async (req, res) => {
  const { name, email, password, role, cargo } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Dados incompletos' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await pool.query(
      'INSERT INTO users(id,email,password_hash,name,role,cargo,status,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,NOW())',
      [id, email, hash, name, role||'recepcao', cargo||'', 'ativo']
    );
    res.status(201).json({ id, message: 'Conta criada com sucesso' });
  } catch(e) {
    if (e.code === '23505') return res.status(409).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════
// PENDING APPROVALS
// ══════════════════════════════════════════════════════════════

// GET /api/pending-approvals
app.get('/api/pending-approvals', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pending_approvals ORDER BY date DESC');
    const rows = result.rows.map(p => ({
      id: p.id, name: p.name, email: p.email, role: p.role,
      date: p.date ? new Date(p.date).toLocaleDateString('pt-BR') : ''
    }));
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/pending-approvals/:id/approve
app.post('/api/pending-approvals/:id/approve', authMiddleware, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const pa = await pool.query('SELECT * FROM pending_approvals WHERE id=$1', [id]);
    if (!pa.rows[0]) return res.status(404).json({ error: 'Aprovação não encontrada' });
    const p = pa.rows[0];

    // Update or create user
    const existing = await pool.query('SELECT id FROM users WHERE LOWER(email)=LOWER($1)', [p.email]);
    if (existing.rows[0]) {
      await pool.query('UPDATE users SET status=$1 WHERE id=$2', ['ativo', existing.rows[0].id]);
    } else {
      const hash = await bcrypt.hash('123456789', 10); // temporary password
      await pool.query(
        'INSERT INTO users(id,email,password_hash,name,role,cargo,status,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,NOW())',
        [uuidv4(), p.email, hash, p.name, p.role, p.cargo||'', 'ativo']
      );
    }

    await pool.query('DELETE FROM pending_approvals WHERE id=$1', [id]);
    await log(req.user.id, 'APPROVE_USER', 'user', null, { email: p.email, name: p.name });
    res.json({ success: true, message: 'Conta de ' + p.name + ' aprovada!' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/pending-approvals/:id (reject)
app.delete('/api/pending-approvals/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    const pa = await pool.query('SELECT * FROM pending_approvals WHERE id=$1', [id]);
    if (pa.rows[0]) {
      await pool.query('DELETE FROM users WHERE LOWER(email)=LOWER($1)', [pa.rows[0].email]);
      await pool.query('DELETE FROM pending_approvals WHERE id=$1', [id]);
    }
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// SALAS
// ══════════════════════════════════════════════════════════════

app.get('/api/salas', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM salas ORDER BY nome');
    const salas = result.rows.map(s => ({
      id: s.id, nome: s.nome, desc: s.descricao, cor: s.cor
    }));
    res.json(salas);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/salas', authMiddleware, requireRole('admin','recepcao'), async (req, res) => {
  const { nome, desc, cor } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const id = uuidv4();
    await pool.query('INSERT INTO salas(id,nome,descricao,cor) VALUES($1,$2,$3,$4)', [id, nome, desc||'', cor||'#4CAF50']);
    res.status(201).json({ id, nome, desc, cor });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/salas/:id', authMiddleware, requireRole('admin','recepcao'), async (req, res) => {
  try {
    await pool.query('DELETE FROM salas WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// PATIENTS
// ══════════════════════════════════════════════════════════════

// Helper: build full patient object with nested data
async function getFullPatient(patientId) {
  const p = await pool.query('SELECT * FROM patients WHERE id=$1', [patientId]);
  if (!p.rows[0]) return null;
  const pat = p.rows[0];

  const [records, meds, acts, docs] = await Promise.all([
    pool.query('SELECT * FROM medical_records WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]),
    pool.query('SELECT * FROM medications WHERE patient_id=$1', [patientId]),
    pool.query('SELECT * FROM activities WHERE patient_id=$1', [patientId]),
    pool.query('SELECT * FROM documents WHERE patient_id=$1 ORDER BY created_at DESC', [patientId]),
  ]);

  return {
    id: pat.id,
    salaId: pat.sala_id,
    name: pat.name,
    dob: pat.dob,
    age: pat.age,
    diag: pat.diagnosticos || [],
    progresso: pat.progresso,
    sessoes: pat.sessoes,
    metas: pat.metas,
    responsavel: { nome: pat.resp_nome, tel: pat.resp_tel, email: pat.resp_email },
    indicadores: pat.indicadores || {},
    evolucao: pat.evolucao || [0,0,0,0,0,0],
    prontuarios: records.rows.map(r => ({
      id: r.id, tipo: r.tipo, data: r.data,
      titulo: r.titulo, prof: r.profissional, evolucao: r.evolucao
    })),
    remedios: meds.rows.map(m => ({
      id: m.id, nome: m.nome, dosagem: m.dosagem,
      horarios: m.horarios||[], dias: m.dias||[], ativo: m.ativo, obs: m.obs
    })),
    atividades: acts.rows.map(a => ({
      id: a.id, nome: a.nome, tipo: a.tipo, freq: a.freq,
      proxima: a.proxima, prof: a.profissional, fromRecepcao: a.from_recepcao
    })),
    documentos: docs.rows.map(d => ({
      id: d.id, tipo: d.tipo, nome: d.nome, data: d.data,
      prof: d.profissional, url: d.url, mine: d.mine, conteudo: d.conteudo
    })),
  };
}

// GET /api/patients
app.get('/api/patients', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id FROM patients ORDER BY name');
    const patients = await Promise.all(result.rows.map(r => getFullPatient(r.id)));
    res.json(patients.filter(Boolean));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/patients/:id
app.get('/api/patients/:id', authMiddleware, async (req, res) => {
  try {
    const pat = await getFullPatient(req.params.id);
    if (!pat) return res.status(404).json({ error: 'Paciente não encontrado' });
    res.json(pat);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/patients
app.post('/api/patients', authMiddleware, requireRole('admin','recepcao','doutor'), async (req, res) => {
  const { salaId, name, dob, age, diag, responsavel, indicadores, evolucao } = req.body;
  if (!name) return res.status(400).json({ error: 'Nome é obrigatório' });
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO patients(id,sala_id,name,dob,age,diagnosticos,resp_nome,resp_tel,resp_email,indicadores,evolucao)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, salaId||null, name, dob||'', age||0, diag||[],
       responsavel?.nome||'', responsavel?.tel||'', responsavel?.email||'',
       JSON.stringify(indicadores||{comunicacao:0,socializacao:0,comportamento:0,autonomia:0}),
       evolucao||[0,0,0,0,0,0]]
    );
    await log(req.user.id, 'CREATE_PATIENT', 'patient', id, { name });
    res.status(201).json({ id, message: 'Paciente cadastrado!' });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/patients/:id
app.patch('/api/patients/:id', authMiddleware, requireRole('admin','recepcao','doutor'), async (req, res) => {
  const { salaId, name, dob, diag, responsavel, indicadores, progresso, sessoes, metas, evolucao } = req.body;
  const { id } = req.params;
  try {
    await pool.query(
      `UPDATE patients SET
        sala_id=COALESCE($1,sala_id),
        name=COALESCE($2,name),
        dob=COALESCE($3,dob),
        diagnosticos=COALESCE($4,diagnosticos),
        resp_nome=COALESCE($5,resp_nome),
        resp_tel=COALESCE($6,resp_tel),
        resp_email=COALESCE($7,resp_email),
        indicadores=COALESCE($8,indicadores),
        progresso=COALESCE($9,progresso),
        sessoes=COALESCE($10,sessoes),
        metas=COALESCE($11,metas),
        evolucao=COALESCE($12,evolucao)
       WHERE id=$13`,
      [salaId||null, name, dob, diag||null,
       responsavel?.nome, responsavel?.tel, responsavel?.email,
       indicadores?JSON.stringify(indicadores):null,
       progresso, sessoes, metas, evolucao||null, id]
    );
    await log(req.user.id, 'UPDATE_PATIENT', 'patient', id, { name });
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/patients/:id
app.delete('/api/patients/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// MEDICAL RECORDS (Prontuários)
// ══════════════════════════════════════════════════════════════

app.post('/api/patients/:pid/records', authMiddleware, requireRole('admin','doutor'), async (req, res) => {
  const { tipo, data, titulo, profissional, evolucao } = req.body;
  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO medical_records(id,patient_id,tipo,data,titulo,profissional,evolucao) VALUES($1,$2,$3,$4,$5,$6,$7)',
      [id, req.params.pid, tipo, data, titulo, profissional, evolucao]
    );
    res.status(201).json({ id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/records/:id', authMiddleware, requireRole('admin','doutor'), async (req, res) => {
  const { titulo, profissional, evolucao } = req.body;
  try {
    await pool.query(
      'UPDATE medical_records SET titulo=COALESCE($1,titulo),profissional=COALESCE($2,profissional),evolucao=COALESCE($3,evolucao) WHERE id=$4',
      [titulo, profissional, evolucao, req.params.id]
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/records/:id', authMiddleware, requireRole('admin','doutor'), async (req, res) => {
  try {
    await pool.query('DELETE FROM medical_records WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// MEDICATIONS
// ══════════════════════════════════════════════════════════════

app.post('/api/patients/:pid/medications', authMiddleware, requireRole('admin','doutor'), async (req, res) => {
  const { nome, dosagem, horarios, dias, ativo, obs } = req.body;
  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO medications(id,patient_id,nome,dosagem,horarios,dias,ativo,obs) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',
      [id, req.params.pid, nome, dosagem, horarios||[], dias||[], ativo!==false, obs||'']
    );
    res.status(201).json({ id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/medications/:id', authMiddleware, requireRole('admin','doutor'), async (req, res) => {
  const { nome, dosagem, horarios, dias, ativo, obs } = req.body;
  try {
    await pool.query(
      'UPDATE medications SET nome=COALESCE($1,nome),dosagem=COALESCE($2,dosagem),horarios=COALESCE($3,horarios),dias=COALESCE($4,dias),ativo=COALESCE($5,ativo),obs=COALESCE($6,obs) WHERE id=$7',
      [nome, dosagem, horarios, dias, ativo, obs, req.params.id]
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/medications/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM medications WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// DOCUMENTS
// ══════════════════════════════════════════════════════════════

app.post('/api/patients/:pid/documents', authMiddleware, async (req, res) => {
  const { tipo, nome, data, profissional, url, mine, conteudo } = req.body;
  const id = uuidv4();
  try {
    await pool.query(
      'INSERT INTO documents(id,patient_id,tipo,nome,data,profissional,url,mine,conteudo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [id, req.params.pid, tipo, nome, data, profissional, url||'', mine!==false, conteudo||'']
    );
    res.status(201).json({ id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/documents/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM documents WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════════════════════════════

app.get('/api/appointments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY created_at DESC');
    const rows = result.rows.map(a => ({
      id: a.id, paciente: a.patient_name, pacienteId: a.patient_id,
      prof: a.professional_name, salaId: a.sala_id,
      data: a.date_br, hora: a.time_str,
      tipo: a.tipo, status: a.status, obs: a.obs, compareceu: a.attended
    }));
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/appointments', authMiddleware, requireRole('admin','recepcao'), async (req, res) => {
  const { paciente, pacienteId, prof, salaId, data, hora, tipo, obs } = req.body;
  if (!paciente || !prof || !data || !hora) return res.status(400).json({ error: 'Campos obrigatórios: paciente, prof, data, hora' });
  const id = uuidv4();
  try {
    await pool.query(
      `INSERT INTO appointments(id,patient_id,patient_name,professional_name,sala_id,date_br,time_str,tipo,obs)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, pacienteId||null, paciente, prof, salaId||null, data, hora, tipo||'Consulta', obs||'']
    );
    await log(req.user.id, 'CREATE_APPOINTMENT', 'appointment', id, { paciente, data, hora });
    res.status(201).json({ id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/appointments/:id', authMiddleware, requireRole('admin','recepcao'), async (req, res) => {
  const { paciente, prof, salaId, data, hora, tipo, status, obs, compareceu } = req.body;
  try {
    await pool.query(
      `UPDATE appointments SET
        patient_name=COALESCE($1,patient_name),
        professional_name=COALESCE($2,professional_name),
        sala_id=COALESCE($3,sala_id),
        date_br=COALESCE($4,date_br),
        time_str=COALESCE($5,time_str),
        tipo=COALESCE($6,tipo),
        status=COALESCE($7,status),
        obs=COALESCE($8,obs),
        attended=COALESCE($9,attended)
       WHERE id=$10`,
      [paciente, prof, salaId||null, data, hora, tipo, status, obs, compareceu, req.params.id]
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/appointments/:id', authMiddleware, requireRole('admin','recepcao'), async (req, res) => {
  try {
    await pool.query('DELETE FROM appointments WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// FAMILY LINKS
// ══════════════════════════════════════════════════════════════

app.post('/api/users/:uid/link-patient', authMiddleware, requireRole('admin'), async (req, res) => {
  const { patientId } = req.body;
  try {
    const pat = await pool.query('SELECT name FROM patients WHERE id=$1', [patientId]);
    if (!pat.rows[0]) return res.status(404).json({ error: 'Paciente não encontrado' });
    await pool.query('UPDATE users SET patient_id=$1,patient_name=$2 WHERE id=$3', [patientId, pat.rows[0].name, req.params.uid]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:uid/link-patient', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE users SET patient_id=NULL,patient_name=NULL WHERE id=$1', [req.params.uid]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ══════════════════════════════════════════════════════════════

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '8.0.0' });
  } catch(e) {
    res.status(503).json({ status: 'error', error: e.message });
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada: ' + req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ── START ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏥 ASIPECA Backend rodando em http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔑 JWT expira em: ${JWT_EXPIRES}`);
  console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
