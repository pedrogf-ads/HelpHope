// ============================================================
// BANCO DE DADOS em memória
// ============================================================
// ═══════════════════════════════════════════════════════════
// BANCO DE DADOS + PERSISTÊNCIA via localStorage
// Salva automaticamente a cada alteração.
// Se existir dado salvo, usa ele; senão usa o seed inicial.
// ═══════════════════════════════════════════════════════════
var DB_SEED = {
  users:[
    {id:'u1',name:'Pedro Oliveira',email:'admin@asipeca.br',password:'123456789',role:'admin',cargo:'Coordenador',status:'ativo',createdAt:'01/03/2026',lastAccess:'23/05/2026'},
    {id:'u2',name:'Dr. Carlos Mendes',email:'doutor@asipeca.br',password:'123456789',role:'doutor',cargo:'Fonoaudiólogo',status:'ativo',createdAt:'15/03/2026',lastAccess:'23/05/2026'},
    {id:'u3',name:'Fernanda Costa',email:'recepcao@asipeca.br',password:'123456789',role:'recepcao',cargo:'Recepcionista',status:'ativo',createdAt:'12/04/2026',lastAccess:'23/05/2026'},
    {id:'u4',name:'João Silva',email:'familiar@asipeca.br',password:'123456789',role:'familiar',cargo:'Responsável',status:'ativo',createdAt:'22/03/2026',lastAccess:'23/05/2026',patientId:'pat1',patientName:'Ana Clara Santos'}
  ],
  pendingApprovals:[
    {id:'p1',name:'Dr. Carlos Neto',email:'carlos.neto@email.com',role:'doutor',date:'19/04/2026'},
    {id:'p2',name:'Maria Santos',email:'maria@email.com',role:'recepcao',date:'18/04/2026'},
    {id:'p3',name:'João Costa',email:'joao@email.com',role:'familiar',date:'17/04/2026'}
  ],
  salas:[
    {id:'s1',nome:'Sala Azul – TEA',desc:'Atendimentos para pacientes com TEA',cor:'#1976D2'},
    {id:'s2',nome:'Sala Verde – Oncologia',desc:'Acompanhamento oncológico',cor:'#4CAF50'},
    {id:'s3',nome:'Sala Rosa – Fonoaudiologia',desc:'Atendimento fonoaudiológico',cor:'#E91E63'},
    {id:'s4',nome:'Sala Laranja – Terapia Ocu.',desc:'Sessões de terapia ocupacional',cor:'#FF9800'},
    {id:'s5',nome:'Sala Roxa – Psicologia',desc:'Atendimento psicológico',cor:'#7B1FA2'}
  ],
  patients:[
    {id:'pat1',salaId:'s1',name:'Ana Clara Santos',dob:'15/04/2019',age:7,diag:['TEA Leve','Leucemia - Em remissão'],
     progresso:85,sessoes:12,metas:3,
     responsavel:{nome:'Maria Santos',tel:'(11) 98765-4321',email:'maria.santos@email.com'},
     indicadores:{comunicacao:85,socializacao:78,comportamento:82,autonomia:75},
     prontuarios:[
       {id:'pr1',tipo:'Consulta',data:'20/03/2026',titulo:'Avaliação comportamental – Progressos na interação social',prof:'Dra. Juliana Costa',evolucao:'Boa evolução'},
       {id:'pr2',tipo:'Exame',data:'15/03/2026',titulo:'Hemograma completo – Resultados normais',prof:'Dr. Paulo Silva',evolucao:'Estável'},
       {id:'pr3',tipo:'Terapia',data:'10/03/2026',titulo:'Terapia ocupacional – Coordenação motora fina',prof:'Dr. Ricardo Lima',evolucao:'Progresso'}
     ],
     remedios:[
       {id:'r1',nome:'Risperidona',dosagem:'0,5mg',horarios:['08:00','20:00'],dias:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],ativo:true,obs:''},
       {id:'r2',nome:'Melatonina',dosagem:'3mg',horarios:['21:00'],dias:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],ativo:true,obs:''}
     ],
     atividades:[
       {id:'a1',nome:'Fonoaudiologia',tipo:'Recepção',freq:'2x por semana',proxima:'30/03/2026 – 10:00',prof:'Dra. Juliana Costa',fromRecepcao:true},
       {id:'a2',nome:'Terapia Ocupacional',tipo:'Recepção',freq:'3x por semana',proxima:'29/03/2026 – 14:00',prof:'Dr. Ricardo Lima',fromRecepcao:true}
     ],
     documentos:[
       {id:'d1',tipo:'Laudo',nome:'Laudo Médico – TEA',data:'10/01/2026',prof:'Dr. João Santos',url:'',mine:true},
       {id:'d2',tipo:'Relatório',nome:'Relatório de Evolução – Março',data:'25/03/2026',prof:'Dr. João Santos',url:'',mine:true},
       {id:'d3',tipo:'Relatório',nome:'Relatório Terapia Ocupacional',data:'18/03/2026',prof:'Dr. Ricardo Lima',url:'',mine:false}
     ],
     evolucao:[65,68,70,74,78,85]
    },
    {id:'pat2',salaId:'s1',name:'Pedro Oliveira',dob:'10/01/2021',age:5,diag:['TEA – Médio'],
     progresso:72,sessoes:9,metas:2,
     responsavel:{nome:'Carlos Oliveira',tel:'(11) 97654-3210',email:'carlos@email.com'},
     indicadores:{comunicacao:70,socializacao:65,comportamento:72,autonomia:60},
     prontuarios:[{id:'pr4',tipo:'Terapia',data:'26/03/2026',titulo:'Terapia ocupacional – Evolução na coordenação',prof:'Dr. Ricardo Lima',evolucao:'Progresso'}],
     remedios:[],atividades:[{id:'a3',nome:'Terapia Ocupacional',tipo:'Recepção',freq:'2x por semana',proxima:'29/03/2026 – 14:00',prof:'Dr. Ricardo Lima',fromRecepcao:true}],
     documentos:[],evolucao:[50,55,58,62,67,72]
    },
    {id:'pat3',salaId:'s2',name:'Beatriz Almeida',dob:'05/05/2016',age:10,diag:['Câncer – Grave'],
     progresso:62,sessoes:15,metas:4,
     responsavel:{nome:'Sandra Almeida',tel:'(15) 96543-2109',email:'sandra@email.com'},
     indicadores:{comunicacao:60,socializacao:55,comportamento:65,autonomia:68},
     prontuarios:[{id:'pr5',tipo:'Consulta',data:'27/03/2026',titulo:'Avaliação oncológica – Respondendo bem ao tratamento',prof:'Dra. Ana Paula',evolucao:'Estável'}],
     remedios:[],atividades:[],documentos:[],evolucao:[40,45,50,55,58,62]
    }
  ],
  agendamentos:[
    {id:'ag1',paciente:'Ana Clara Santos',pacienteId:'pat1',prof:'Dr. João Santos',data:'23/05/2026',hora:'09:00',tipo:'Consulta Inicial',status:'Agendado'},
    {id:'ag2',paciente:'Pedro Costa',prof:'Dra. Ana Paula',data:'23/05/2026',hora:'10:30',tipo:'Retorno',status:'Agendado'},
    {id:'ag3',paciente:'Lucas Oliveira',prof:'Dr. João Santos',data:'23/05/2026',hora:'14:00',tipo:'Terapia',status:'Agendado'}
  ]
};

// ── PERSISTENCE FUNCTIONS ─────────────────────────────────
var STORAGE_KEY = 'asipeca_db_v6';
function saveDB(){
  try{localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));}
  catch(e){console.warn('localStorage save error:', e);}
}
function loadDB(){
  try{
    var saved = localStorage.getItem(STORAGE_KEY);
    if(saved){
      var parsed = JSON.parse(saved);
      // Validate it has the expected keys before using
      if(parsed && parsed.users && parsed.patients && parsed.agendamentos){
        return parsed;
      }
    }
  }catch(e){console.warn('localStorage load error:', e);}
  return null;
}
function resetDB(){
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
  location.reload();
}

// Load from localStorage or use seed data
var DB = loadDB() || JSON.parse(JSON.stringify(DB_SEED));


var currentUser=null,currentPatient=null,currentSalaId=null,selectedRole=null,prontuarioType=null,fabOpen=false,charts={};

// ── AUTO-SAVE ─────────────────────────────────────────────
// Save DB to localStorage whenever data changes.
// Strategy: debounced save triggered by any mutation.
var _saveTimer=null;
function scheduleSave(){
  clearTimeout(_saveTimer);
  _saveTimer=setTimeout(saveDB, 300);
}
// Save before page unload / refresh / close
window.addEventListener('beforeunload', saveDB);
// Also save periodically every 10s as safety net
setInterval(saveDB, 10000);

// ── DATE HELPER ─────────────────────────────────────────────
// Converts "YYYY-MM-DD" → "DD/MM/YYYY" without UTC offset issues.
// Avoids the classic "day -1" bug caused by new Date("YYYY-MM-DD") parsing as UTC.
function parseDateBR(isoStr){
  if(!isoStr)return'';
  var parts=isoStr.split('-');
  if(parts.length===3)return parts[2]+'/'+parts[1]+'/'+parts[0];
  return isoStr; // fallback if already formatted
}
// Converts "DD/MM/YYYY" → "YYYY-MM-DD" for date inputs
function dateToISO(brStr){
  if(!brStr)return'';
  var parts=brStr.split('/');
  if(parts.length===3)return parts[2]+'-'+parts[1]+'-'+parts[0];
  return brStr;
}

// UTILS
function goTo(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));var el=document.getElementById(id);if(el)el.classList.add('active');closeAllMenus();}
function openModal(id){if(id==='perfilModal'){openPerfilModal();return;}var m=document.getElementById(id);if(m)m.classList.add('open');}
function closeModal(id){var m=document.getElementById(id);if(m)m.classList.remove('open');}
function closeAllMenus(){document.querySelectorAll('.dropdown-menu').forEach(m=>m.classList.remove('open'));closeFabAll();}
function toggleMenu(id){var m=document.getElementById(id);if(!m)return;var isOpen=m.classList.contains('open');document.querySelectorAll('.dropdown-menu').forEach(x=>x.classList.remove('open'));if(!isOpen)m.classList.add('open');}
function showToast(msg,type){var tc=document.getElementById('toastContainer');var t=document.createElement('div');t.className='toast toast-'+(type||'info');t.innerHTML=(type==='success'?'✅':type==='error'?'❌':'ℹ️')+' '+msg;tc.appendChild(t);setTimeout(()=>t.remove(),3200);
  // Auto-save on any non-error action (mutations always succeed first)
  if(type!=='error')scheduleSave();
}
function closeFabAll(){fabOpen=false;var fm=document.getElementById('fabMenu');var fs=document.getElementById('fabSub');if(fm)fm.style.display='none';if(fs)fs.style.display='none';var f=document.getElementById('docFab');if(f)f.textContent='+';}
function roleIcon(r){return{admin:'🛡️',doutor:'🩺',recepcao:'👥',familiar:'🏠'}[r]||'👤';}
function roleColor(r){return{admin:'#F3E5F5',doutor:'#E3F2FD',recepcao:'#E8F5E9',familiar:'#FFF3E0'}[r]||'#F5F5F5';}
function roleLabel(r){return{admin:'Administrador',doutor:'Doutor / Profissional',recepcao:'Recepção',familiar:'Familiar'}[r]||r;}
function roleBadgeClass(r){return{admin:'badge-purple',doutor:'badge-blue',recepcao:'badge-green',familiar:'badge-orange'}[r]||'badge-gray';}
function diagBadge(d){if(d.includes('Leve'))return'badge-green';if(d.includes('Médio'))return'badge-blue';if(d.includes('Grave'))return'badge-red';if(d.includes('remissão'))return'badge-teal';return'badge-gray';}
function copyPix(){if(navigator.clipboard)navigator.clipboard.writeText('12.345.678/0001-90').catch(()=>{});showToast('Chave PIX copiada!','success');}
function toggleFamiliarExtra(){var v=document.getElementById('regRole').value;document.getElementById('regFamiliarExtra').style.display=v==='familiar'?'block':'none';}

// AUTH
function selectRole(r){selectedRole=r;document.querySelectorAll('.role-option').forEach(o=>o.classList.remove('selected'));var el=document.getElementById('role-'+r);if(el)el.classList.add('selected');document.getElementById('roleSelector').style.display='none';document.getElementById('loginForm').classList.add('visible');}
function showRoleSelector(){document.getElementById('roleSelector').style.display='block';document.getElementById('loginForm').classList.remove('visible');selectedRole=null;}



function quickLogin(email, password){
  var user = DB.users.find(function(u){
    return u.email.toLowerCase() === email.toLowerCase()
        && u.password === password
        && u.status === 'ativo';
  });
  if(!user){ showToast('Conta não encontrada','error'); return; }
  currentUser = user;
  loadScreen(user.role);
}
function doLogin(){
  var email=(document.getElementById('loginEmail').value||'').trim().toLowerCase();
  var pass=document.getElementById('loginPassword').value;
  if(!email||!pass){showToast('Preencha email e senha','error');return;}
  var user=DB.users.find(u=>u.email.toLowerCase()===email&&u.password===pass&&u.status==='ativo');
  if(!user){showToast('Email ou senha incorretos','error');return;}
  currentUser=user;
  showToast('Bem-vindo(a), '+user.name.split(' ')[0]+'!','success');
  setTimeout(()=>loadScreen(user.role),300);
}
function doRegister(){
  var name=(document.getElementById('regName').value||'').trim();
  var email=(document.getElementById('regEmail').value||'').trim();
  var pass=document.getElementById('regPassword').value;
  var role=document.getElementById('regRole').value;
  if(!name||!email||!pass||!role){showToast('Preencha todos os campos obrigatórios','error');return;}
  if(DB.users.find(u=>u.email.toLowerCase()===email.toLowerCase())){showToast('Email já cadastrado','error');return;}
  if(pass.length<6){showToast('Senha precisa ter no mínimo 6 caracteres','error');return;}
  var nu={id:'u'+Date.now(),name,email,password:pass,role,cargo:document.getElementById('regCargo').value,status:'pendente',createdAt:new Date().toLocaleDateString('pt-BR'),lastAccess:'-'};
  DB.users.push(nu);
  DB.pendingApprovals.push({id:'p'+Date.now(),name,email,role,date:new Date().toLocaleDateString('pt-BR')});
  showToast('Conta criada! Aguarde aprovação.','success');
  setTimeout(()=>goTo('screen-login'),1600);
}
function loadScreen(role){
  switch(role){
    case 'admin': initAdmin(); goTo('screen-admin'); break;
    case 'doutor': initDoctor(); goTo('screen-doctor'); break;
    case 'recepcao': initRecepcao(); goTo('screen-recepcao'); break;
    case 'familiar': initFamiliar(); goTo('screen-familiar'); break;
  }
}
function logout(){currentUser=null;currentPatient=null;currentSalaId=null;Object.values(charts).forEach(c=>{try{c.destroy();}catch(e){}});charts={};goTo('screen-landing');showToast('Você saiu do sistema','info');}

// PERFIL
function openPerfilModal(){
  if(!currentUser)return;
  document.getElementById('perfilAvatar').textContent=currentUser.name[0];
  document.getElementById('perfil-nome').value=currentUser.name;
  document.getElementById('perfil-email').value=currentUser.email;
  document.getElementById('perfil-cargo').value=currentUser.cargo||'';
  document.getElementById('perfil-senha').value='';
  var m=document.getElementById('perfilModal');if(m)m.classList.add('open');
}
function savePerfil(){
  if(!currentUser)return;
  var nome=document.getElementById('perfil-nome').value.trim();
  var cargo=document.getElementById('perfil-cargo').value.trim();
  var senha=document.getElementById('perfil-senha').value;
  if(!nome){showToast('Nome é obrigatório','error');return;}
  if(senha&&senha.length<6){showToast('Senha mínimo 6 caracteres','error');return;}
  currentUser.name=nome;currentUser.cargo=cargo;if(senha)currentUser.password=senha;
  var u=DB.users.find(u=>u.id===currentUser.id);if(u){u.name=nome;u.cargo=cargo;if(senha)u.password=senha;}
  closeModal('perfilModal');showToast('Perfil atualizado!','success');
}

// ADMIN
function initAdmin(){
  if(currentUser)document.getElementById('adminName').textContent=currentUser.name;
  renderPending();renderContas();updateAdminStats();
  setTimeout(renderVinculoTab,100);
  setTimeout(renderAdminPacientes,100);
}
function toggleAdminSidebar(){
  var sb=document.getElementById('adminSidebar');
  var ov=document.getElementById('adminSidebarOverlay');
  if(!sb)return;
  sb.classList.toggle('open');
  if(ov)ov.style.display=sb.classList.contains('open')?'block':'none';
}
function closeAdminSidebar(){
  var sb=document.getElementById('adminSidebar');
  var ov=document.getElementById('adminSidebarOverlay');
  if(sb)sb.classList.remove('open');
  if(ov)ov.style.display='none';
}
function showAdminTab(tab,el){
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('show'));
  document.getElementById('tab-'+tab).classList.add('show');
  document.querySelectorAll('.admin-nav-item').forEach(i=>i.classList.remove('active'));
  if(el)el.classList.add('active');
  if(tab==='contas')renderContas();
  // Close sidebar on mobile after tab selection
  if(window.innerWidth<=768)closeAdminSidebar();
}
function renderPending(){
  var list=document.getElementById('pendingList');
  var pending=DB.pendingApprovals;
  document.getElementById('pendingCount').textContent=pending.length+' contas aguardando aprovação';
  if(!pending.length){list.innerHTML='<p style="text-align:center;color:var(--text-light);padding:24px;">Nenhuma aprovação pendente</p>';return;}
  list.innerHTML=pending.map(p=>`<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);">
    <div style="width:42px;height:42px;border-radius:50%;background:${roleColor(p.role)};display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;">${roleIcon(p.role)}</div>
    <div style="flex:1;"><p style="font-weight:700;">${p.name}</p><p style="font-size:12px;color:var(--text-medium);">${p.email}</p>
    <div style="display:flex;gap:5px;margin-top:3px;"><span class="badge ${roleBadgeClass(p.role)}">${roleLabel(p.role)}</span><span style="font-size:11px;color:var(--text-light);">${p.date}</span></div></div>
    <div style="display:flex;flex-direction:column;gap:5px;">
    <button class="btn btn-green btn-sm" onclick="approveUser('${p.id}')">✅ Aprovar</button>
    <button class="btn btn-red btn-sm" onclick="rejectUser('${p.id}')">⛔ Rejeitar</button></div></div>`).join('');
}
function approveUser(id){
  var idx=DB.pendingApprovals.findIndex(function(p){return p.id===id});if(idx<0)return;
  var p=DB.pendingApprovals[idx];
  var u=DB.users.find(function(u){return u.email.toLowerCase()===p.email.toLowerCase()});
  if(u){
    u.status='ativo';
    // Auto-link familiar to patient by name if patientName was provided
    if(u.role==='familiar'&&u.patientName&&!u.patientId){
      var pnL=u.patientName.toLowerCase().split(' ')[0];
      var linkedPat=DB.patients.find(function(pt){return pt.name.toLowerCase().includes(pnL);});
      if(linkedPat){u.patientId=linkedPat.id;showToast('Familiar vinculado a '+linkedPat.name,'success');}
    }
  } else {
    // User was only in pendingApprovals — create them in DB.users as active
    var newUser={
      id:'u'+Date.now(),
      name:p.name,
      email:p.email,
      password:'123456789', // temporary password
      role:p.role,
      cargo:p.cargo||'',
      status:'ativo',
      createdAt:p.date||new Date().toLocaleDateString('pt-BR'),
      lastAccess:'-'
    };
    DB.users.push(newUser);
  }
  DB.pendingApprovals.splice(idx,1);
  renderPending();renderContas();renderVinculoTab();updateAdminStats();saveDB();
  showToast('✅ Conta de '+p.name+' aprovada! Agora aparece na aba Contas.','success');
  // Auto-navigate to Contas tab so admin sees the newly approved account
  setTimeout(function(){showAdminTab('contas',document.getElementById('anav-contas'));},1200);
}
function vincularFamiliar(userId, patientId){
  var u=DB.users.find(function(u){return u.id===userId;});
  if(!u){showToast('Usuário não encontrado','error');return;}
  var p=DB.patients.find(function(p){return p.id===patientId;});
  if(!p){showToast('Paciente não encontrado','error');return;}
  u.patientId=patientId;
  renderContas();
  showToast('Familiar "'+u.name+'" vinculado a "'+p.name+'"!','success');
}
function rejectUser(id){var idx=DB.pendingApprovals.findIndex(p=>p.id===id);if(idx<0)return;var p=DB.pendingApprovals[idx];DB.pendingApprovals.splice(idx,1);var uIdx=DB.users.findIndex(u=>u.email.toLowerCase()===p.email.toLowerCase());if(uIdx>=0)DB.users.splice(uIdx,1);renderPending();renderContas();updateAdminStats();saveDB();showToast('Conta rejeitada','error');}
function updateAdminStats(){var all=DB.users;document.getElementById('stat-total').textContent=all.length;document.getElementById('stat-ativas').textContent=all.filter(u=>u.status==='ativo').length;document.getElementById('stat-profs').textContent=all.filter(u=>u.role==='doutor').length;document.getElementById('stat-familiares').textContent=all.filter(u=>u.role==='familiar').length;}
function renderContas(){
  var search=(document.getElementById('searchContas')?.value||'').toLowerCase();
  var tipo=document.getElementById('filterTipo')?.value||'';
  var status=document.getElementById('filterStatus')?.value||'';
  var users=DB.users.filter(u=>{
    // Exclude pendente users from Contas tab (they belong in Aprovações)
    if(u.status==='pendente')return false;
    if(search&&!u.name.toLowerCase().includes(search)&&!u.email.toLowerCase().includes(search)&&!(u.cargo||'').toLowerCase().includes(search))return false;
    if(tipo&&u.role!==tipo)return false;
    if(status&&u.status!==status)return false;
    return true;
  });
  var cc=document.getElementById('contasCount');if(cc)cc.textContent='Mostrando '+users.length+' conta(s) ativa(s)/inativa(s)';
  var cl=document.getElementById('contasList');if(!cl)return;
  if(!users.length){cl.innerHTML='<div style="text-align:center;padding:32px;color:var(--text-light);">Nenhuma conta encontrada</div>';return;}
  cl.innerHTML=users.map(u=>`<div class="admin-list-item">
    <div style="width:42px;height:42px;border-radius:50%;background:${roleColor(u.role)};display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;">${roleIcon(u.role)}</div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;"><span style="font-weight:700;">${u.name}</span><span class="badge ${roleBadgeClass(u.role)}">${roleLabel(u.role)}</span><span style="width:7px;height:7px;border-radius:50%;background:${u.status==='ativo'?'#4CAF50':'#ccc'};display:inline-block;" title="${u.status}"></span></div>
      <p style="font-size:12px;color:var(--text-medium);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.email}</p>
      <p style="font-size:11px;color:var(--text-light);">Cargo: ${u.cargo||'–'} · Status: <strong>${u.status}</strong></p>
    </div>
    <div class="admin-list-actions">
      <button class="btn btn-outline btn-sm" onclick="toggleUserStatus('${u.id}')">${u.status==='ativo'?'Desativar':'Ativar'}</button>
      <button class="btn btn-outline-green btn-sm" onclick="editUser('${u.id}')">✏️ Editar</button>
      <button class="btn btn-outline-red btn-sm" onclick="deleteUser('${u.id}')">🗑️</button>
    </div></div>`).join('');
}
function toggleUserStatus(id){var u=DB.users.find(u=>u.id===id);if(!u)return;u.status=u.status==='ativo'?'inativo':'ativo';renderContas();updateAdminStats();showToast(u.name+' '+(u.status==='ativo'?'ativado':'desativado'),'info');}
function editUser(id){var u=DB.users.find(u=>u.id===id);if(!u)return;document.getElementById('ae-id').value=id;document.getElementById('ae-name').value=u.name;document.getElementById('ae-email').value=u.email;document.getElementById('ae-cargo').value=u.cargo||'';var m=document.getElementById('adminEditModal');if(m)m.classList.add('open');}
function adminSaveEdit(){var id=document.getElementById('ae-id').value;var u=DB.users.find(u=>u.id===id);if(!u)return;u.name=document.getElementById('ae-name').value;u.email=document.getElementById('ae-email').value;u.cargo=document.getElementById('ae-cargo').value;closeModal('adminEditModal');renderContas();showToast('Conta atualizada!','success');}
function deleteUser(id){if(!confirm('Excluir esta conta?'))return;var idx=DB.users.findIndex(u=>u.id===id);if(idx<0)return;DB.users.splice(idx,1);renderContas();updateAdminStats();showToast('Conta excluída','info');}
function adminCreateAccount(){var name=(document.getElementById('ac-name').value||'').trim();var email=(document.getElementById('ac-email').value||'').trim();var pass=document.getElementById('ac-password').value;var role=document.getElementById('ac-role').value;if(!name||!email||!pass){showToast('Preencha todos os campos','error');return;}DB.users.push({id:'u'+Date.now(),name,email,password:pass,role,cargo:document.getElementById('ac-cargo').value,status:'ativo',createdAt:new Date().toLocaleDateString('pt-BR'),lastAccess:'-'});closeModal('adminCreateModal');renderContas();updateAdminStats();showToast('Conta criada!','success');}

// DOCTOR
function initDoctor(){
  if(currentUser){var gr=document.getElementById('docGreeting');if(gr)gr.textContent='Olá, '+currentUser.name+'!';}
  var now=new Date();var opts={day:'numeric',month:'long',year:'numeric'};
  ['docDate','docSalaDate'].forEach(id=>{var el=document.getElementById(id);if(el)el.textContent='Data: '+now.toLocaleDateString('pt-BR',opts);});
  var dap=document.getElementById('docActivePat');if(dap)dap.textContent=DB.patients.length;
  var rpa=document.getElementById('relPacAtivos');if(rpa)rpa.textContent=DB.patients.length;
  showDocSection('salas');
  renderSalasGrupo();
  renderEquipe();
}
function showDocSection(sec){
  ['salas','patlist','patdetail','inicio','relatorios','institucional'].forEach(v=>{
    var el=document.getElementById('doc-view-'+v);
    if(el)el.style.display=v===sec?'flex':'none';
    if(el&&v===sec)el.style.flexDirection='column';
  });
  document.querySelectorAll('.doc-nav-item').forEach(n=>n.classList.remove('active'));
  var navMap={inicio:'inicio',salas:'pacientes',patlist:'pacientes',patdetail:'pacientes',relatorios:'relatorios',institucional:'institucional'};
  var navEl=document.getElementById('docNav-'+(navMap[sec]||'inicio'));
  if(navEl)navEl.classList.add('active');
  if(sec==='inicio')setTimeout(initDocCharts,100);
  if(sec==='relatorios')setTimeout(initRelCharts,100);
  if(sec==='institucional')renderEquipe();
  closeFabAll();
}
function renderSalasGrupo(){
  var search=(document.getElementById('salaSearch')?.value||'').toLowerCase();
  var salas=DB.salas.filter(s=>!search||s.nome.toLowerCase().includes(search));
  var cont=document.getElementById('salasGrupoContent');if(!cont)return;
  if(!salas.length){cont.innerHTML='<p style="text-align:center;color:var(--text-light);padding:24px;">Nenhuma sala encontrada</p>';return;}
  cont.innerHTML=salas.map(s=>{
    var pats=DB.patients.filter(p=>p.salaId===s.id);
    return `<div class="sala-card"><div class="sala-card-hdr" style="background:${s.cor};display:flex;align-items:center;gap:10px;">
      <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:18px;">💚</div>
      <div><p style="font-weight:800;font-size:14px;">${s.nome}</p><p style="font-size:11px;opacity:.8;">${s.desc}</p></div>
      <span style="margin-left:auto;background:rgba(255,255,255,.2);color:#fff;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;">🟢 Ativa</span></div>
      <div class="sala-card-body"><p style="font-size:13px;color:var(--text-medium);margin-bottom:10px;">${pats.length} paciente(s)</p>
      <button class="btn btn-green w-full" onclick="abrirSalaPacientes('${s.id}','${s.nome.replace(/'/g,"\\'").replace(/"/g,'\\"')}')">👥 Ver Pacientes</button></div></div>`;
  }).join('');
}
function abrirSalaPacientes(salaId,salaNome){currentSalaId=salaId;var el=document.getElementById('salaNomeTopo');if(el)el.textContent=salaNome;showDocSection('patlist');renderPatListSala();}
function voltarParaSalas(){showDocSection('salas');renderSalasGrupo();}
function renderPatListSala(){
  var search=(document.getElementById('patSearch')?.value||'').toLowerCase();
  var pats=DB.patients.filter(p=>p.salaId===currentSalaId&&(!search||p.name.toLowerCase().includes(search)));
  var pc=document.getElementById('salaPatCount');if(pc)pc.textContent=pats.length+' Pacientes';
  var list=document.getElementById('patListSala');if(!list)return;
  if(!pats.length){list.innerHTML='<p style="text-align:center;color:var(--text-light);padding:24px;">Nenhum paciente nesta sala</p>';return;}
  list.innerHTML=pats.map(p=>`<div class="pat-card" onclick="openPatient('${p.id}')">
    <div class="pat-av">${p.name[0]}</div>
    <div style="flex:1;"><div style="font-weight:700;font-size:14px;">${p.name}</div>
    <div style="font-size:12px;color:var(--text-light);margin-top:2px;">${p.age} anos &nbsp;${p.diag.map(d=>`<span class="badge ${diagBadge(d)}">${d}</span>`).join(' ')}</div>
    <div class="progress-bar" style="width:140px;margin-top:5px;"><div class="progress-fill" style="width:${p.progresso}%;"></div></div>
    <div style="font-size:11px;color:#2E7D32;margin-top:2px;">${p.progresso}% | <span style="color:var(--text-light);">Última: ${p.prontuarios[0]?.data||'–'}</span></div></div>
    <span style="color:var(--text-light);font-size:16px;">›</span></div>`).join('');
}
function openPatient(id){
  currentPatient=DB.patients.find(p=>p.id===id);if(!currentPatient)return;
  document.getElementById('pdAvatar').textContent=currentPatient.name[0];
  document.getElementById('pdName').textContent=currentPatient.name;
  document.getElementById('pdAge').textContent=currentPatient.age+' anos · '+currentPatient.dob;
  document.getElementById('pdBadges').innerHTML=currentPatient.diag.map(d=>`<span style="background:rgba(255,255,255,.25);color:#fff;border:1px solid rgba(255,255,255,.4);padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;">${d}</span>`).join('');
  document.getElementById('ph-prog').textContent=currentPatient.progresso+'%';
  document.getElementById('ph-sess').textContent=currentPatient.sessoes;
  document.getElementById('ph-metas').textContent=currentPatient.metas;
  document.getElementById('ph-resp-nome').textContent=currentPatient.responsavel.nome;
  document.getElementById('ph-resp-tel').textContent=currentPatient.responsavel.tel;
  document.getElementById('ph-resp-email').textContent=currentPatient.responsavel.email;
  var prox=currentPatient.atividades[0];
  document.getElementById('ph-proxima').textContent=prox?(prox.nome+' – '+prox.proxima):'-';
  renderIndicadores();renderProntuario();renderRemedios();renderAtividades();renderDocs();
  showDocSection('patdetail');
  showPatTab('home',document.querySelector('.patient-tab'));
  setTimeout(initPatChart,150);
}
function voltarParaPatList(){showDocSection('patlist');renderPatListSala();}
function showPatTab(tab,el){
  ['home','prontuario','remedios','atividades','docs'].forEach(t=>{var c=document.getElementById('patTab-'+t);if(c)c.classList.toggle('active',t===tab);});
  document.querySelectorAll('.patient-tab').forEach(t=>t.classList.remove('active'));
  if(el)el.classList.add('active');
  closeFabAll();
  var fabEl=document.getElementById('docFab');
  if(fabEl)fabEl.style.display=(['prontuario','remedios','atividades','docs'].includes(tab))?'flex':'none';
}

// CHARTS
function initDocCharts(){
  // Stats
  var dap=document.getElementById('docActivePat');if(dap)dap.textContent=totalPats;
  // Average evolution pct
  var totalEvolLast=0;var cnt=0;
  DB.patients.forEach(function(p){if((p.evolucao||[]).length){totalEvolLast+=(p.evolucao[p.evolucao.length-1]||0);cnt++;}});
  var dep=document.getElementById('docEvolPct');if(dep)dep.textContent=(cnt>0?Math.round(totalEvolLast/cnt):0)+'%';
  // Sessions today
  var today=new Date().toLocaleDateString('pt-BR');
  var sesHoje=DB.agendamentos.filter(function(a){return a.data===today&&a.status!=='Cancelado';}).length;
  var dsh=document.getElementById('docSessoesHoje');if(dsh)dsh.textContent=sesHoje;
  // Evolution: average of all patient evolucao arrays
  var months=['Jan','Fev','Mar','Abr','Mai','Jun'];
  var evolData=[0,0,0,0,0,0];
  if(DB.patients.length){
    DB.patients.forEach(function(p){
      (p.evolucao||[]).forEach(function(v,i){if(i<6)evolData[i]+=v;});
    });
    evolData=evolData.map(function(v){return Math.round(v/DB.patients.length);});
  }
  // Distribution: count by diag category
  var teaLeve=DB.patients.filter(function(p){return(p.diag||[]).some(function(d){return d.includes('Leve');});}).length||8;
  var teaMod=DB.patients.filter(function(p){return(p.diag||[]).some(function(d){return d.includes('Médio')||d.includes('Moderado');});}).length||10;
  var teaSev=DB.patients.filter(function(p){return(p.diag||[]).some(function(d){return d.includes('Grave')||d.includes('Severo');});}).length||6;
  var outros=Math.max(0,DB.patients.length-teaLeve-teaMod-teaSev);
  // Update legend
  var dl=document.getElementById('distTeaLeve');if(dl)dl.textContent=teaLeve;
  var dm=document.getElementById('distTeaMod');if(dm)dm.textContent=teaMod;
  var ds=document.getElementById('distTeaSev');if(ds)ds.textContent=teaSev;
  var do2=document.getElementById('distOutros');if(do2)do2.textContent=outros;
  // Weekly activities: count agendamentos by tipo
  var tiposCount={};
  DB.agendamentos.forEach(function(a){tiposCount[a.tipo]=(tiposCount[a.tipo]||0)+1;});
  var tipoLabels=Object.keys(tiposCount).slice(0,5);
  var tipoVals=tipoLabels.map(function(k){return tiposCount[k];});
  if(!tipoLabels.length){tipoLabels=['Consulta','Retorno','Terapia','Avaliação'];tipoVals=[8,5,12,4];}
  // Activities recentes
  var recAtiv=document.getElementById('docAtivRecentes');
  if(recAtiv){
    var recent=DB.agendamentos.slice(0,4);
    recAtiv.innerHTML=recent.length?recent.map(function(a){return'<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f0f0f0;">'
      +'<div style="width:36px;height:36px;border-radius:10px;background:#E8F5E9;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">📋</div>'
      +'<div style="flex:1;"><p style="font-size:13px;font-weight:600;">'+a.paciente+'</p>'
      +'<p style="font-size:11px;color:var(--text-medium);">'+a.tipo+' · '+a.data+' '+a.hora+' · '+a.prof+'</p></div>'
      +'<span class="badge '+(a.status==='Concluído'?'badge-green':a.status==='Cancelado'?'badge-red':'badge-blue')+'">'+a.status+'</span>'
      +'</div>';}).join(''):'<p style="text-align:center;color:var(--text-light);padding:16px;">Nenhuma atividade recente</p>';
  }
  try{if(charts.docEvol)charts.docEvol.destroy();var c1=document.getElementById('docEvolChart');if(c1)charts.docEvol=new Chart(c1,{type:'line',data:{labels:months,datasets:[{label:'Evolução Média',data:evolData,borderColor:'#4CAF50',backgroundColor:'rgba(76,175,80,.1)',tension:.4,fill:true,pointBackgroundColor:'#4CAF50',pointRadius:5}]},options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:function(ctx){return ctx.parsed.y+'%';}}}},scales:{y:{min:0,max:100,ticks:{callback:function(v){return v+'%';}}},x:{grid:{display:false}}}}});}catch(e){}
  try{if(charts.docDist)charts.docDist.destroy();var c2=document.getElementById('docDistChart');if(c2)charts.docDist=new Chart(c2,{type:'doughnut',data:{labels:['TEA Leve','TEA Médio','Grave/Severo','Outros'],datasets:[{data:[teaLeve,teaMod,teaSev,outros],backgroundColor:['#4CAF50','#64B5F6','#EF5350','#A5D6A7'],borderWidth:0}]},options:{plugins:{legend:{display:false}},cutout:'70%'}});}catch(e){}
  try{if(charts.docAtiv)charts.docAtiv.destroy();var c3=document.getElementById('docAtivChart');if(c3)charts.docAtiv=new Chart(c3,{type:'bar',data:{labels:tipoLabels,datasets:[{label:'Atendimentos',data:tipoVals,backgroundColor:'#4CAF50',borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(0,0,0,.06)'},ticks:{stepSize:1}},x:{grid:{display:false}}}}});}catch(e){}
}
function initPatChart(){if(!currentPatient)return;try{if(charts.patEvol)charts.patEvol.destroy();var ctx=document.getElementById('patEvolChart');if(ctx)charts.patEvol=new Chart(ctx,{type:'line',data:{labels:['Nov','Dez','Jan','Fev','Mar','Mai'],datasets:[{data:currentPatient.evolucao,borderColor:'#4CAF50',backgroundColor:'rgba(76,175,80,.1)',tension:.4,fill:true,pointBackgroundColor:'#4CAF50',pointRadius:5}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:100},x:{grid:{display:false}}}}});}catch(e){}}
function initRelCharts(){
  // Real data
  var rpa=document.getElementById('relPacAtivos');if(rpa)rpa.textContent=DB.patients.length;
  // Sessions this month
  var now=new Date();
  var curMonth='/'+String(now.getMonth()+1).padStart(2,'0')+'/';
  var sessoesMes=DB.agendamentos.filter(function(a){return a.data&&a.data.includes(curMonth);}).length;
  var rsm=document.getElementById('relSessoesMes');if(rsm)rsm.textContent=sessoesMes||DB.agendamentos.length;
  // Taxa evolução: average last evolucao value
  var totalEvol=0;var cnt=0;
  DB.patients.forEach(function(p){if((p.evolucao||[]).length){totalEvol+=(p.evolucao[p.evolucao.length-1]||0);cnt++;}});
  var taxa=cnt>0?Math.round(totalEvol/cnt):0;
  var rte=document.getElementById('relTaxaEvol');if(rte)rte.textContent=taxa+'%';
  // Distribution by therapy type from atividades
  var therapyCount={};
  DB.patients.forEach(function(p){(p.atividades||[]).forEach(function(a){therapyCount[a.nome]=(therapyCount[a.nome]||0)+1;});});
  var tLabels=Object.keys(therapyCount).slice(0,5);
  var tVals=tLabels.map(function(k){return therapyCount[k];});
  var tColors=['#4CAF50','#64B5F6','#FF9800','#A5D6A7','#CE93D8'];
  if(!tLabels.length){tLabels=['Fonoaudiologia','Terapia Ocu.','Psicologia','Fisioterapia'];tVals=[18,15,12,8];}
  // Update legend
  var rdl=document.getElementById('relDistLegend');
  if(rdl)rdl.innerHTML=tLabels.map(function(l,i){return'<div><span style="color:'+tColors[i]+'font-weight:700;">● '+l+'</span> '+tVals[i]+'</div>';}).join('');
  // Monthly evolution: average of all patients
  var months=['Nov','Dez','Jan','Fev','Mar'];
  var evolData=[0,0,0,0,0];
  if(DB.patients.length){
    DB.patients.forEach(function(p){(p.evolucao||[]).slice(0,5).forEach(function(v,i){evolData[i]+=v;});});
    evolData=evolData.map(function(v){return Math.round(v/DB.patients.length);});
  }
  // Age distribution
  var ageBuckets=[0,0,0,0,0];
  DB.patients.forEach(function(p){var a=p.age||0;if(a<=3)ageBuckets[0]++;else if(a<=6)ageBuckets[1]++;else if(a<=9)ageBuckets[2]++;else if(a<=12)ageBuckets[3]++;else ageBuckets[4]++;});
  try{if(charts.relDist)charts.relDist.destroy();var c1=document.getElementById('relDistChart');if(c1)charts.relDist=new Chart(c1,{type:'doughnut',data:{labels:tLabels,datasets:[{data:tVals,backgroundColor:tColors,borderWidth:0}]},options:{plugins:{legend:{display:false}},cutout:'70%'}});}catch(e){}
  try{if(charts.relEvol)charts.relEvol.destroy();var c2=document.getElementById('relEvolChart');if(c2)charts.relEvol=new Chart(c2,{type:'line',data:{labels:months,datasets:[{label:'Evolução',data:evolData,borderColor:'#4CAF50',tension:.4,pointRadius:4,fill:false}]},options:{plugins:{legend:{display:false}},scales:{y:{min:0,max:100,ticks:{callback:function(v){return v+'%';}}},x:{grid:{display:false}}}}});}catch(e){}
  try{if(charts.relIdade)charts.relIdade.destroy();var c3=document.getElementById('relIdadeChart');if(c3)charts.relIdade=new Chart(c3,{type:'bar',data:{labels:['0-3','4-6','7-9','10-12','13+'],datasets:[{label:'Pacientes',data:ageBuckets,backgroundColor:'#4CAF50',borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{ticks:{stepSize:1}},x:{grid:{display:false}}}}});}catch(e){}
}

// PATIENT DATA
function renderIndicadores(){
  if(!currentPatient)return;
  var ind=currentPatient.indicadores;
  var icons={comunicacao:'💬',socializacao:'👥',comportamento:'🔄',autonomia:'⭐'};
  var labels={comunicacao:'Comunicação',socializacao:'Socialização',comportamento:'Comportamento',autonomia:'Autonomia'};
  document.getElementById('indicadoresContainer').innerHTML=Object.entries(ind).map(([k,v])=>`<div class="ind-row"><div class="ind-label"><span>${icons[k]||'📊'}</span>${labels[k]||k}</div><div style="flex:1;"><div class="progress-bar"><div class="progress-fill" style="width:${v}%;"></div></div></div><div style="font-size:12px;font-weight:700;width:32px;text-align:right;">${v}%</div></div>`).join('');
  document.getElementById('editIndForm').innerHTML=Object.entries(ind).map(([k,v])=>`<div class="form-group"><label>${labels[k]||k} (%)</label><input type="range" min="0" max="100" value="${v}" class="form-control" id="ind-${k}" oninput="document.getElementById('indv-${k}').textContent=this.value" style="padding:4px;"><span id="indv-${k}">${v}</span>%</div>`).join('');
}
function openEditIndicadores(){var m=document.getElementById('editIndicadoresModal');if(m)m.classList.add('open');}
function saveIndicadores(){if(!currentPatient)return;Object.keys(currentPatient.indicadores).forEach(k=>{var el=document.getElementById('ind-'+k);if(el)currentPatient.indicadores[k]=parseInt(el.value);});closeModal('editIndicadoresModal');renderIndicadores();showToast('Indicadores atualizados!','success');}
function renderProntuario(){
  if(!currentPatient)return;
  var typeColors={Consulta:'#4CAF50',Exame:'var(--blue)',Terapia:'var(--orange)',Clínico:'var(--purple)',Acompanhamento:'#00897B'};
  var typeBadges={Consulta:'badge-green',Exame:'badge-blue',Terapia:'badge-orange',Clínico:'badge-purple',Acompanhamento:'badge-teal'};
  document.getElementById('prontuarioList').innerHTML=currentPatient.prontuarios.length?currentPatient.prontuarios.map(p=>`<div class="pron-entry" style="border-left-color:${typeColors[p.tipo]||'#ccc'};">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
      <span class="badge ${typeBadges[p.tipo]||'badge-gray'}">${p.tipo}</span>
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:11px;color:var(--text-light);">${p.data}</span>
        <button class="btn btn-sm btn-outline-green" onclick="editProntuario('${p.id}')">✏️</button>
        <button class="btn btn-sm btn-outline-red" onclick="deleteProntuario('${p.id}')">🗑️</button>
      </div></div>
    <p style="font-size:14px;font-weight:600;margin-bottom:3px;">${p.titulo}</p>
    <p style="font-size:12px;color:#2E7D32;">${p.prof}</p></div>`).join(''):'<p style="text-align:center;color:var(--text-light);padding:20px;">Nenhum prontuário</p>';
}
function editProntuario(id){if(!currentPatient)return;var p=currentPatient.prontuarios.find(x=>x.id===id);if(!p)return;document.getElementById('epronId').value=id;document.getElementById('epron-titulo').value=p.titulo;document.getElementById('epron-prof').value=p.prof;document.getElementById('epron-evolucao').value=p.evolucao||'';var m=document.getElementById('editProntuarioModal');if(m)m.classList.add('open');}
function saveEditProntuario(){if(!currentPatient)return;var id=document.getElementById('epronId').value;var p=currentPatient.prontuarios.find(x=>x.id===id);if(!p)return;p.titulo=document.getElementById('epron-titulo').value;p.prof=document.getElementById('epron-prof').value;p.evolucao=document.getElementById('epron-evolucao').value;closeModal('editProntuarioModal');renderProntuario();showToast('Prontuário atualizado!','success');}
function deleteProntuario(id){if(!currentPatient||!confirm('Excluir este prontuário?'))return;currentPatient.prontuarios=currentPatient.prontuarios.filter(p=>p.id!==id);renderProntuario();showToast('Prontuário excluído','info');}
function renderRemedios(){
  if(!currentPatient)return;
  document.getElementById('remediosList').innerHTML=currentPatient.remedios.length?currentPatient.remedios.map(r=>`<div class="med-card">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div style="display:flex;align-items:center;gap:11px;"><div style="width:38px;height:38px;border-radius:50%;background:#E8F5E9;display:flex;align-items:center;justify-content:center;font-size:17px;">💊</div>
      <div><p style="font-weight:700;">${r.nome}</p><p style="font-size:12px;color:var(--text-medium);">Dosagem: ${r.dosagem}</p></div></div>
      <div style="display:flex;align-items:center;gap:7px;"><span style="font-size:11px;color:${r.ativo?'var(--green)':'var(--text-light)'};font-weight:700;">${r.ativo?'Ativo':'Inativo'}</span>
      <label class="toggle"><input type="checkbox" ${r.ativo?'checked':''} onchange="toggleMed('${r.id}',this.checked)"><span class="toggle-slider"></span></label></div></div>
    <div style="margin-top:7px;"><p style="font-size:11px;color:var(--text-medium);">Horários:</p><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:4px;">${r.horarios.map(h=>`<span class="med-time">🕐 ${h}</span>`).join('')}</div></div>
    <div style="display:flex;gap:7px;margin-top:10px;"><button class="btn btn-outline-green btn-sm" style="flex:1;" onclick="openEditMed('${r.id}')">✏️ Editar</button><button class="btn btn-outline-red btn-sm" style="flex:1;" onclick="deleteMed('${r.id}')">🗑️ Excluir</button></div></div>`).join(''):'<p style="text-align:center;color:var(--text-light);padding:20px;">Nenhum medicamento</p>';
}
function toggleMed(id,active){if(!currentPatient)return;var m=currentPatient.remedios.find(r=>r.id===id);if(m){m.ativo=active;showToast('Medicamento '+(active?'ativado':'desativado'),'info');}}
function openEditMed(id){if(!currentPatient)return;var m=currentPatient.remedios.find(r=>r.id===id);if(!m)return;document.getElementById('emedId').value=id;document.getElementById('emed-nome').value=m.nome;document.getElementById('emed-dosagem').value=m.dosagem;document.getElementById('emed-horarios').value=m.horarios.join(', ');document.getElementById('emed-obs').value=m.obs||'';var mo=document.getElementById('editMedModal');if(mo)mo.classList.add('open');}
function saveEditMedicamento(){if(!currentPatient)return;var id=document.getElementById('emedId').value;var m=currentPatient.remedios.find(r=>r.id===id);if(!m)return;m.nome=document.getElementById('emed-nome').value;m.dosagem=document.getElementById('emed-dosagem').value;m.horarios=document.getElementById('emed-horarios').value.split(',').map(h=>h.trim()).filter(Boolean);m.obs=document.getElementById('emed-obs').value;closeModal('editMedModal');renderRemedios();showToast('Medicamento atualizado!','success');}
function saveMedicamento(){if(!currentPatient)return;var nome=(document.getElementById('med-nome').value||'').trim();var dos=(document.getElementById('med-dosagem').value||'').trim();var hor=(document.getElementById('med-horarios').value||'').trim();if(!nome||!dos||!hor){showToast('Preencha os campos obrigatórios','error');return;}var dias=[];document.getElementById('diasCheckboxes').querySelectorAll('input:checked').forEach(cb=>dias.push(cb.parentElement.textContent.trim()));currentPatient.remedios.push({id:'r'+Date.now(),nome,dosagem:dos,horarios:hor.split(',').map(h=>h.trim()),dias,ativo:document.getElementById('med-ativo').checked,obs:document.getElementById('med-obs').value});closeModal('addMedModal');renderRemedios();showToast('Medicamento adicionado!','success');}
function deleteMed(id){if(!currentPatient||!confirm('Excluir?'))return;currentPatient.remedios=currentPatient.remedios.filter(r=>r.id!==id);renderRemedios();showToast('Excluído','info');}
function renderAtividades(){
  if(!currentPatient)return;
  document.getElementById('atividadesList').innerHTML=currentPatient.atividades.length?currentPatient.atividades.map(a=>`<div style="background:#fff;border-radius:var(--radius);padding:13px;margin-bottom:9px;border:1px solid var(--border);">
    <div style="display:flex;align-items:center;gap:11px;margin-bottom:7px;"><div style="width:34px;height:34px;border-radius:9px;background:#E3F2FD;display:flex;align-items:center;justify-content:center;font-size:15px;">⚡</div>
    <div style="flex:1;"><div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;"><span style="font-weight:700;">${a.nome}</span><span class="badge ${a.fromRecepcao?'badge-blue':'badge-green'}">${a.tipo}</span></div>
    <p style="font-size:11px;color:var(--text-medium);">Freq: ${a.freq} · Próxima: ${a.proxima}</p></div></div>
    ${a.fromRecepcao?'<div style="background:#E3F2FD;border-radius:5px;padding:7px;font-size:11px;color:var(--blue);margin-bottom:7px;">⚠️ Criada pela recepção – apenas visualização.</div>':''}
    <div style="display:flex;gap:7px;">
    ${!a.fromRecepcao?`<button class="btn btn-outline-green btn-sm" onclick="openEditAtividade('${a.id}')">✏️ Editar</button><button class="btn btn-outline-red btn-sm" onclick="deleteAtividade('${a.id}')">🗑️</button>`:''}
    <button class="btn btn-green btn-sm" onclick="showToast(\'Atividade concluída!\',\'success\')">✅ Concluir</button></div></div>`).join(''):'<p style="text-align:center;color:var(--text-light);padding:20px;">Nenhuma atividade</p>';
}
function openEditAtividade(id){if(!currentPatient)return;var a=currentPatient.atividades.find(x=>x.id===id);if(!a)return;document.getElementById('eatvId').value=id;document.getElementById('eatv-nome').value=a.nome;document.getElementById('eatv-freq').value=a.freq;document.getElementById('eatv-prof').value=a.prof;var m=document.getElementById('editAtividadeModal');if(m)m.classList.add('open');}
function saveEditAtividade(){if(!currentPatient)return;var id=document.getElementById('eatvId').value;var a=currentPatient.atividades.find(x=>x.id===id);if(!a)return;a.nome=document.getElementById('eatv-nome').value;a.freq=document.getElementById('eatv-freq').value;a.prof=document.getElementById('eatv-prof').value;closeModal('editAtividadeModal');renderAtividades();showToast('Atividade atualizada!','success');}
function saveAtividade(){if(!currentPatient)return;var nome=(document.getElementById('atv-nome').value||'').trim();if(!nome){showToast('Informe o nome','error');return;}currentPatient.atividades.push({id:'a'+Date.now(),nome,tipo:document.getElementById('atv-tipo').value,freq:document.getElementById('atv-freq').value,proxima:document.getElementById('atv-data').value,prof:document.getElementById('atv-prof').value,fromRecepcao:false});closeModal('addAtividadeModal');renderAtividades();showToast('Atividade criada!','success');}
function deleteAtividade(id){if(!currentPatient||!confirm('Excluir?'))return;currentPatient.atividades=currentPatient.atividades.filter(a=>a.id!==id);renderAtividades();showToast('Excluída','info');}
function renderDocs(){
  if(!currentPatient)return;
  var mine=currentPatient.documentos.filter(d=>d.mine);
  var others=currentPatient.documentos.filter(d=>!d.mine);
  var tc={Laudo:'badge-green',Relatório:'badge-blue',Atestado:'badge-pink',Declaração:'badge-teal'};
  function rd(d){return`<div class="doc-item"><div class="doc-icon-box">📄</div><div style="flex:1;"><p style="font-size:13px;font-weight:700;">${d.nome}</p><p style="font-size:11px;color:var(--text-medium);">${d.data} · ${d.prof}</p></div><div style="display:flex;align-items:center;gap:5px;"><span class="badge ${tc[d.tipo]||'badge-gray'}">${d.tipo}</span><button class="btn btn-outline-red btn-sm" onclick="deleteDoc('${d.id}')">🗑️</button></div></div>`;}
  document.getElementById('docsList').innerHTML=(mine.length?'<p style="font-size:11px;font-weight:700;color:var(--text-medium);margin-bottom:7px;">MEUS DOCUMENTOS</p>'+mine.map(rd).join(''):'')+(others.length?'<p style="font-size:11px;font-weight:700;color:var(--text-medium);margin-bottom:7px;margin-top:10px;">DE OUTROS PROFISSIONAIS</p>'+others.map(rd).join(''):'')+(!mine.length&&!others.length?'<p style="text-align:center;color:var(--text-light);padding:20px;">Nenhum documento</p>':'');
}
function deleteDoc(id){if(!currentPatient||!confirm('Excluir?'))return;currentPatient.documentos=currentPatient.documentos.filter(d=>d.id!==id);renderDocs();showToast('Excluído','info');}
function handleFileUpload(event){if(!currentPatient)return;Array.from(event.target.files).forEach(file=>{currentPatient.documentos.push({id:'d'+Date.now(),tipo:'Documento',nome:file.name,data:new Date().toLocaleDateString('pt-BR'),prof:currentUser?.name||'Profissional',url:'',mine:true});showToast('"'+file.name+'" adicionado!','success');});event.target.value='';renderDocs();}

// FAB + PRONTUÁRIO
function toggleFabMenu(){fabOpen=!fabOpen;var fm=document.getElementById('fabMenu');var fab=document.getElementById('docFab');if(fm)fm.style.display=fabOpen?'flex':'none';if(fab)fab.textContent=fabOpen?'×':'+';}
function showFabSub(){var fm=document.getElementById('fabMenu');var fs=document.getElementById('fabSub');if(fm)fm.style.display='none';if(fs)fs.style.display='flex';}
function openProntuario(type){
  prontuarioType=type;
  var titles={terapeutico:'🩷 Prontuário Terapêutico',clinico:'🩺 Prontuário Clínico',acompanhamento:'📊 Prontuário de Acompanhamento'};
  document.getElementById('prontuarioTitle').textContent=titles[type]||'📋 Prontuário';
  document.getElementById('prontuarioSub').textContent={terapeutico:'Sessão terapêutica',clinico:'Consulta médica',acompanhamento:'Acompanhamento'}[type]||'';
  var c={terapeutico:'var(--pink)',clinico:'var(--blue)',acompanhamento:'var(--purple)'};
  var btn=document.getElementById('prontuarioSaveBtn');if(btn)btn.style.background=c[type]||'var(--green)';
  var content='';
  if(type==='terapeutico')content=`<div class="form-group"><label>Data <span class="req">*</span></label><input type="date" class="form-control" id="pron-data"></div><div class="form-group"><label>Profissional <span class="req">*</span></label><input type="text" class="form-control" id="pron-prof"></div><div class="form-group"><label>Tipo de terapia</label><select class="form-control" id="pron-tipo"><option>Fonoaudiologia</option><option>Terapia Ocupacional</option><option>Psicologia</option><option>Fisioterapia</option></select></div><div class="form-group"><label>Atividades realizadas <span class="req">*</span></label><textarea class="form-control" id="pron-atividades"></textarea></div><div class="form-group"><label>Evolução <span class="req">*</span></label><textarea class="form-control" id="pron-evolucao"></textarea></div>`;
  else if(type==='clinico')content=`<div class="form-group"><label>Data <span class="req">*</span></label><input type="date" class="form-control" id="pron-data"></div><div class="form-group"><label>Profissional <span class="req">*</span></label><input type="text" class="form-control" id="pron-prof"></div><div class="form-group"><label>Queixa principal <span class="req">*</span></label><textarea class="form-control" id="pron-queixa"></textarea></div><div class="form-group"><label>Avaliação clínica <span class="req">*</span></label><textarea class="form-control" id="pron-avaliacao"></textarea></div><div class="form-group"><label>Diagnóstico <span class="req">*</span></label><textarea class="form-control" id="pron-diag"></textarea></div><div class="form-group"><label>Conduta <span class="req">*</span></label><textarea class="form-control" id="pron-conduta"></textarea></div>`;
  else content=`<div class="form-group"><label>Data <span class="req">*</span></label><input type="date" class="form-control" id="pron-data"></div><div class="form-group"><label>Área <span class="req">*</span></label><select class="form-control" id="pron-area"><option>Comunicação</option><option>Socialização</option><option>Comportamento</option><option>Autonomia</option></select></div><div class="form-group"><label>Evolução <span class="req">*</span></label><textarea class="form-control" id="pron-evolucao"></textarea></div><div class="form-group"><label>Plano de continuidade <span class="req">*</span></label><textarea class="form-control" id="pron-plano"></textarea></div>`;
  document.getElementById('prontuarioContent').innerHTML=content;
  var m=document.getElementById('prontuarioModal');if(m)m.classList.add('open');
}
function saveProntuario(){if(!currentPatient)return;var data=document.getElementById('pron-data')?.value;if(!data){showToast('Informe a data','error');return;}var prof=document.getElementById('pron-prof')?.value||currentUser?.name||'Profissional';var tipos={terapeutico:'Terapia',clinico:'Clínico',acompanhamento:'Acompanhamento'};currentPatient.prontuarios.unshift({id:'pr'+Date.now(),tipo:tipos[prontuarioType]||'Consulta',data:new Date(data).toLocaleDateString('pt-BR'),titulo:'Registro de '+(prontuarioType||'sessão')+' – '+new Date(data).toLocaleDateString('pt-BR'),prof,evolucao:''});closeModal('prontuarioModal');renderProntuario();showToast('Prontuário salvo!','success');}
function gerarAtestado(){var nome=(document.getElementById('at-nome').value||'').trim();if(!nome){showToast('Informe o nome','error');return;}if(currentPatient)currentPatient.documentos.unshift({id:'d'+Date.now(),tipo:'Atestado',nome:'Atestado – '+nome,data:new Date().toLocaleDateString('pt-BR'),prof:document.getElementById('at-prof').value,url:'',mine:true});closeModal('atestadoModal');renderDocs();showToast('Atestado gerado!','success');}
function gerarDeclaracao(){var nome=(document.getElementById('dec-nome').value||'').trim();if(!nome){showToast('Informe o nome','error');return;}if(currentPatient)currentPatient.documentos.unshift({id:'d'+Date.now(),tipo:'Declaração',nome:'Declaração – '+nome,data:new Date().toLocaleDateString('pt-BR'),prof:document.getElementById('dec-prof').value,url:'',mine:true});closeModal('declaracaoModal');renderDocs();showToast('Declaração gerada!','success');}
function updateAtPreview(){var nome=document.getElementById('at-nome')?.value||'__________';var dias=document.getElementById('at-dias')?.value||'___';var data=document.getElementById('at-data')?.value?new Date(document.getElementById('at-data').value).toLocaleDateString('pt-BR'):'____';var prof=document.getElementById('at-prof')?.value||'';document.getElementById('atestadoPreview').innerHTML=`<p style="text-align:center;font-weight:700;">ATESTADO</p><p>Declaro que o(a) paciente <strong>${nome}</strong> necessita de afastamento por <strong>${dias}</strong> dias.</p><p>Data: ${data}</p>${prof?`<p style="margin-top:10px;border-top:1px solid #ccc;padding-top:7px;">${prof}</p>`:''}`;};
function updateDecPreview(){var nome=document.getElementById('dec-nome')?.value||'__________';var data=document.getElementById('dec-data')?.value?new Date(document.getElementById('dec-data').value).toLocaleDateString('pt-BR'):'____';var hora=document.getElementById('dec-hora')?.value||'__:__';document.getElementById('declaracaoPreview').innerHTML=`<p style="text-align:center;font-weight:700;">DECLARAÇÃO</p><p>Declaro que o(a) paciente <strong>${nome}</strong> compareceu a atendimento nesta instituição.</p><p>Data: ${data} · Hora: ${hora}</p>`;}

// EQUIPE
function renderEquipe(){var grid=document.getElementById('equipeGrid');if(!grid)return;var doutores=DB.users.filter(u=>u.role==='doutor'&&u.status==='ativo');if(!doutores.length){grid.innerHTML='<p style="color:var(--text-light);font-size:12px;grid-column:span 3;">Nenhum profissional</p>';return;}grid.innerHTML=doutores.map(u=>`<div style="text-align:center;padding:9px;border:1px solid var(--border);border-radius:var(--radius-sm);"><div style="width:38px;height:38px;border-radius:50%;background:#A5D6A7;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#2E7D32;margin:0 auto 5px;">${u.name[0]}</div><p style="font-size:11px;font-weight:700;color:#2E7D32;">${u.name}</p><p style="font-size:10px;color:var(--text-medium);">${u.cargo||'Profissional'}</p></div>`).join('');}

// RECEPÇÃO




function saveAgendamento(){var pac=(document.getElementById('ag-paciente').value||'').trim();var prof=(document.getElementById('ag-prof').value||'').trim();var data=document.getElementById('ag-data').value;var hora=document.getElementById('ag-hora').value;if(!pac||!prof||!data||!hora){showToast('Preencha todos os campos obrigatórios','error');return;}var dataBR=parseDateBR(data);DB.agendamentos.unshift({id:'ag'+Date.now(),paciente:pac,prof,data:dataBR,hora,tipo:document.getElementById('ag-tipo').value,status:'Agendado',salaId:document.getElementById('ag-sala')?.value||'',obs:document.getElementById('ag-obs')?.value||''});closeModal('newAgendModal');renderInicioAgendList();renderRecAgendamentos();renderAgendaList();var today=new Date().toLocaleDateString('pt-BR');var agHoje=DB.agendamentos.filter(function(a){return a.data===today&&a.status!=='Cancelado';});var sAH=document.getElementById('statAgendHoje');if(sAH)sAH.textContent=agHoje.length;var sAI=document.getElementById('inicioStatAgend');if(sAI)sAI.textContent=agHoje.length;showToast('Agendamento criado!','success');}

// renderRecSalas – full implementation below
function _renderRecSalasLegacy_disabled(){}
function abrirRecSalaPacientes(salaId,salaNome){currentSalaId=salaId;document.getElementById('recSalaNomeTopo').textContent=salaNome;document.getElementById('rec-salas-view').style.display='none';document.getElementById('rec-sala-patients-view').style.display='block';document.getElementById('ap-salaId').value=salaId;renderRecSalaPats();}
function voltarParaRecSalas(){document.getElementById('rec-salas-view').style.display='block';document.getElementById('rec-sala-patients-view').style.display='none';currentSalaId=null;}
function renderRecSalaPats(){var pats=DB.patients.filter(p=>p.salaId===currentSalaId);var cont=document.getElementById('recSalaPatientsContent');if(!cont)return;if(!pats.length){cont.innerHTML='<p style="text-align:center;color:var(--text-light);padding:24px;">Nenhum paciente nesta sala</p>';return;}cont.innerHTML=pats.map(p=>`<div class="pat-card"><div class="pat-av">${p.name[0]}</div><div style="flex:1;"><div style="font-weight:700;">${p.name}</div><div style="font-size:12px;color:var(--text-light);">${p.age} anos · ${p.diag.join(', ')}</div><div style="font-size:12px;color:var(--text-medium);">Resp: ${p.responsavel.nome}</div></div><button class="btn btn-outline-green btn-sm" onclick="openEditPatient('${p.id}')">✏️ Editar</button></div>`).join('');}
function savePatient(){var nome=(document.getElementById('ap-nome').value||'').trim();var nasc=document.getElementById('ap-nasc').value;var diag=document.getElementById('ap-diag').value;if(!nome||!nasc){showToast('Preencha nome e nascimento','error');return;}var dob=new Date(nasc);var age=new Date().getFullYear()-dob.getFullYear();var salaId=document.getElementById('ap-salaId').value||currentSalaId||DB.salas[0]?.id||'';DB.patients.push({id:'pat'+Date.now(),salaId,name:nome,dob:parseDateBR(nasc)||dob.toLocaleDateString('pt-BR'),age,diag:[diag],progresso:0,sessoes:0,metas:0,responsavel:{nome:document.getElementById('ap-resp-nome').value,tel:document.getElementById('ap-resp-tel').value,email:document.getElementById('ap-resp-email').value},indicadores:{comunicacao:0,socializacao:0,comportamento:0,autonomia:0},prontuarios:[],remedios:[],atividades:[],documentos:[],evolucao:[0,0,0,0,0,0]});closeModal('addPatientModal');if(window._adminPatMode){window._adminPatMode=false;renderAdminPacientes();}else{renderRecSalaPats();renderRecSalas();}// Update patient count stats
var tp=document.getElementById('recTotalPat');if(tp)tp.textContent=DB.patients.length;var isP=document.getElementById('inicioStatPac');if(isP)isP.textContent=DB.patients.length;var spA=document.getElementById('statPacAtivos');if(spA)spA.textContent=DB.patients.length;saveDB();showToast('Paciente adicionado!','success');}
function openEditPatient(id){var p=DB.patients.find(x=>x.id===id);if(!p)return;document.getElementById('ep-id').value=id;document.getElementById('ep-nome').value=p.name;document.getElementById('ep-diag').value=p.diag[0]||'';document.getElementById('ep-resp-nome').value=p.responsavel.nome;document.getElementById('ep-resp-tel').value=p.responsavel.tel;document.getElementById('ep-resp-email').value=p.responsavel.email;var sel=document.getElementById('ep-salaId');sel.innerHTML='<option value="">Sem sala</option>'+DB.salas.map(s=>`<option value="${s.id}" ${s.id===p.salaId?'selected':''}>${s.nome}</option>`).join('');var m=document.getElementById('editPatientModal');if(m)m.classList.add('open');}
function saveEditPatient(){var id=document.getElementById('ep-id').value;var p=DB.patients.find(x=>x.id===id);if(!p)return;p.name=document.getElementById('ep-nome').value;p.diag=[document.getElementById('ep-diag').value];p.responsavel.nome=document.getElementById('ep-resp-nome').value;p.responsavel.tel=document.getElementById('ep-resp-tel').value;p.responsavel.email=document.getElementById('ep-resp-email').value;p.salaId=document.getElementById('ep-salaId').value;closeModal('editPatientModal');if(window._adminPatMode){window._adminPatMode=false;renderAdminPacientes();}else{renderRecSalaPats();renderRecSalas();}saveDB();showToast('Paciente atualizado!','success');}
function saveSala(){var nome=(document.getElementById('sala-nome').value||'').trim();if(!nome){showToast('Informe o nome da sala','error');return;}DB.salas.push({id:'s'+Date.now(),nome,desc:document.getElementById('sala-desc').value,cor:document.getElementById('sala-cor').value});closeModal('newSalaModal');renderRecSalas();showToast('Sala criada!','success');}


// FAMILIAR






// ============================================================
// RECEPÇÃO – REBUILD COMPLETO
// ============================================================
function initRecepcao(){
  var u=currentUser;
  if(u){
    var gr=document.getElementById('recGreeting');if(gr)gr.textContent='Olá, '+u.name.split(' ')[0]+'!';
    var rn=document.getElementById('recName');if(rn)rn.textContent=u.name;
  }
  var now=new Date();
  var dateStr=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  var dd=document.getElementById('recDateDisplay');if(dd)dd.textContent=dateStr;
  var id2=document.getElementById('recInicioDate');if(id2)id2.textContent='Data: '+now.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
  var todayStr=now.toLocaleDateString('pt-BR');
  var agendHoje=DB.agendamentos.filter(function(a){return a.data===todayStr&&a.status!=='Cancelado';});
  var ic=document.getElementById('recInicioCount');if(ic)ic.textContent=agendHoje.length+' agendamentos para hoje';
  var iac=document.getElementById('recInicioAgendCount');if(iac)iac.textContent='Agendamentos para hoje';
  // Inicio stats
  var isA=document.getElementById('inicioStatAgend');if(isA)isA.textContent=agendHoje.length;
  var isP=document.getElementById('inicioStatPac');if(isP)isP.textContent=DB.patients.length;
  var concl=DB.agendamentos.filter(function(a){return a.data===todayStr&&a.status==='Concluído';}).length;
  var isC=document.getElementById('inicioStatConc');if(isC)isC.textContent=concl;
  var next=DB.agendamentos.find(function(a){return a.data===todayStr&&a.status==='Agendado';});
  var isPH=document.getElementById('inicioStatProx');if(isPH)isPH.textContent=next?next.hora:'--:--';
  // Agenda stats (keep for agenda tab)
  var statAH=document.getElementById('statAgendHoje');if(statAH)statAH.textContent=agendHoje.length;
  var statPA=document.getElementById('statPacAtivos');if(statPA)statPA.textContent=DB.patients.length;
  var statC=document.getElementById('statConcluidos');if(statC)statC.textContent=concl;
  var statPH=document.getElementById('statProxHorario');if(statPH)statPH.textContent=next?next.hora:'--:--';
  var agc=document.getElementById('recAgendCount');if(agc)agc.textContent=agendHoje.length+' agendamentos hoje';
  // Start on inicio tab
  showRecTab('inicio',document.getElementById('rnav-inicio'));
  renderInicioAgendList();
  renderAgendaList();
  renderRecSalas();
}
function showRecTab(tab,el){
  ['inicio','agenda','pacientes'].forEach(function(t){
    var e=document.getElementById('rec-tab-'+t);
    if(e)e.style.display='none';
  });
  var active=document.getElementById('rec-tab-'+tab);
  if(active){active.style.display='flex';active.style.flexDirection='column';}
  document.querySelectorAll('.rec-nav-item').forEach(function(i){i.classList.remove('active');});
  if(el)el.classList.add('active');
  if(tab==='pacientes'){
    var sv=document.getElementById('rec-salas-view');
    if(sv){sv.style.display='flex';sv.style.flexDirection='column';sv.style.flex='1';}
    var spv=document.getElementById('rec-sala-patients-view');
    if(spv)spv.style.display='none';
    renderRecSalas();
  }
  if(tab==='agenda')renderAgendaList();
  if(tab==='inicio')renderInicioAgendList();
}
function renderInicioAgendList(){
  var list=document.getElementById('inicioAgendList');if(!list)return;
  var today=new Date().toLocaleDateString('pt-BR');
  var items=DB.agendamentos.filter(function(a){return a.data===today&&a.status!=='Cancelado';});
  // Update stats
  var isA=document.getElementById('inicioStatAgend');if(isA)isA.textContent=items.length;
  var ic=document.getElementById('recInicioCount');if(ic)ic.textContent=items.length+' agendamentos para hoje';
  var concl=items.filter(function(a){return a.status==='Concluído'||a.compareceu===true;}).length;
  var isC=document.getElementById('inicioStatConc');if(isC)isC.textContent=concl;
  var next=items.find(function(a){return a.status==='Agendado'&&!a.compareceu;});
  var isPH=document.getElementById('inicioStatProx');if(isPH)isPH.textContent=next?next.hora:'--:--';
  if(!items.length){list.innerHTML='<div style="text-align:center;padding:28px;color:var(--text-light);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5" style="display:block;margin:0 auto 10px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p style="font-size:14px;font-weight:600;">Nenhum agendamento para hoje</p></div>';return;}
  list.innerHTML=items.map(function(a){
    var statusIcon=a.compareceu===true?'✅':a.compareceu===false?'❌':'⏳';
    var statusBg=a.compareceu===true?'#E8F5E9':a.compareceu===false?'#FFEBEE':'#FFF8E1';
    var statusColor=a.compareceu===true?'#2E7D32':a.compareceu===false?'#C62828':'#F57F17';
    return '<div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:#f9f9f9;margin-bottom:10px;">'
      +'<div style="width:42px;height:42px;border-radius:50%;background:#E8F5E9;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>'
      +'</div>'
      +'<div style="flex:1;">'
      +'<div style="font-size:14px;font-weight:800;margin-bottom:1px;"><span style="color:#2E7D32;margin-right:8px;">'+a.hora+'</span><span class="rec-agend-badge">'+a.tipo+'</span></div>'
      +'<div style="font-size:13px;font-weight:600;">Paciente: <span style="color:var(--text-dark);">'+a.paciente+'</span></div>'
      +'<div style="font-size:11px;color:var(--text-medium);">Profissional: '+a.prof+'</div>'
      +'</div>'
      +'<div style="display:flex;flex-direction:column;gap:5px;flex-shrink:0;">'
      +(a.compareceu===true?'<span style="background:#E8F5E9;color:#2E7D32;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;">✅ Veio</span>':
        a.compareceu===false?'<span style="background:#FFEBEE;color:#C62828;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;">❌ Faltou</span>':
        '<button onclick="marcarComparecimento(\''+a.id+'\',true)" style="background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;border-radius:20px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;">✅ Veio</button>'
        +'<button onclick="marcarComparecimento(\''+a.id+'\',false)" style="background:#FFEBEE;color:#C62828;border:1px solid #FFCDD2;border-radius:20px;padding:4px 8px;font-size:11px;font-weight:700;cursor:pointer;margin-top:3px;">❌ Faltou</button>')
      +'</div>'
      +'</div>';
  }).join('');
}
function marcarComparecimento(agId, veio){
  var a=DB.agendamentos.find(function(x){return x.id===agId;});
  if(!a)return;
  a.compareceu=veio;
  if(veio)a.status='Concluído';
  renderInicioAgendList();
  renderAgendaList();
  // Update stats
  var today=new Date().toLocaleDateString('pt-BR');
  var concl=DB.agendamentos.filter(function(a){return a.data===today&&(a.status==='Concluído'||a.compareceu===true);}).length;
  var sc=document.getElementById('statConcluidos');if(sc)sc.textContent=concl;
  showToast(veio?'✅ Presença confirmada!':'❌ Falta registrada','info');
}
function openNewAgendModal(){
  // Populate patients select
  var sel=document.getElementById('ag-paciente');
  if(sel){
    sel.innerHTML='<option value="">Selecione um paciente cadastrado...</option>'+DB.patients.map(function(p){return'<option value="'+p.name+'">'+p.name+' ('+p.age+' anos)</option>';}).join('');
  }
  // Populate professionals select
  var profSel=document.getElementById('ag-prof');
  if(profSel){
    var doutores=DB.users.filter(function(u){return u.role==='doutor'&&u.status==='ativo';});
    profSel.innerHTML='<option value="">Selecione um profissional...</option>'+doutores.map(function(u){return'<option value="'+u.name+'">'+u.name+(u.cargo?' – '+u.cargo:'')+'</option>';}).join('');
    // Also add static fallback professionals if none in DB
    if(!doutores.length){profSel.innerHTML='<option value="">Selecione...</option><option>Dr. Carlos Mendes</option><option>Dra. Ana Paula</option><option>Dr. João Santos</option>';}
  }
  // Populate salas select
  var salaSel=document.getElementById('ag-sala');
  if(salaSel){
    salaSel.innerHTML='<option value="">Selecione uma sala (opcional)...</option>'+DB.salas.map(function(s){return'<option value="'+s.id+'">'+s.nome+'</option>';}).join('');
  }
  // Set today's date as default
  var dateField=document.getElementById('ag-data');
  if(dateField&&!dateField.value)dateField.value=new Date().toISOString().split('T')[0];
  openModal('newAgendModal');
}
function renderRecAgendamentos(){
  var list=document.getElementById('recAgendamentos');if(!list)return;
  var today=new Date().toLocaleDateString('pt-BR');
  var items=DB.agendamentos.filter(function(a){return a.data===today&&a.status!=='Cancelado';}).slice(0,4);
  if(!items.length){list.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-light);font-size:13px;">Nenhum agendamento para hoje</div>';return;}
  list.innerHTML=items.map(function(a){
    return '<div class="rec-agend-item">'
      +'<div class="rec-agend-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div>'
      +'<div style="flex:1;">'
      +'<div><span class="rec-agend-hora">'+a.hora+'</span><span class="rec-agend-badge">'+a.tipo+'</span></div>'
      +'<div class="rec-agend-patient">Paciente: '+a.paciente+'</div>'
      +'<div class="rec-agend-detail">Profissional: '+a.prof+'</div>'
      +'</div></div>';
  }).join('');
}
function limparFiltrosAgenda(){
  var fn=document.getElementById('agFiltroNome');if(fn)fn.value='';
  var fd=document.getElementById('agFiltroData');if(fd)fd.value='';
  renderAgendaList();
}
function renderAgendaList(){
  var list=document.getElementById('agendaList');if(!list)return;
  var filtroNome=(document.getElementById('agFiltroNome')?.value||'').toLowerCase().trim();
  var filtroData=document.getElementById('agFiltroData')?.value||''; // YYYY-MM-DD
  var filtroBR=filtroData?parseDateBR(filtroData):'';
  var items=DB.agendamentos.filter(function(a){
    if(filtroNome&&!a.paciente.toLowerCase().includes(filtroNome))return false;
    if(filtroBR&&a.data!==filtroBR)return false;
    return true;
  });
  // Update filter status label
  var fs=document.getElementById('agFiltroStatus');
  if(fs){
    if(filtroNome||filtroData){
      fs.textContent='Filtro ativo: '+items.length+' resultado(s) encontrado(s)';
      fs.style.color='#1565C0';
    }else{
      fs.textContent='Mostrando todos os agendamentos ('+DB.agendamentos.length+' total)';
      fs.style.color='var(--text-light)';
    }
  }
  var agc=document.getElementById('recAgendCount');if(agc)agc.textContent=items.length+' agendamento(s)';
  if(!items.length){list.innerHTML='<div style="text-align:center;padding:28px;color:var(--text-light);"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" style="display:block;margin:0 auto 10px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>'+(filtroNome||filtroData?'Nenhum agendamento encontrado para este filtro':'Nenhum agendamento cadastrado')+'</p></div>';return;}
  list.innerHTML=items.map(function(a){
    var isCancelled=a.status==='Cancelado';
    var isConcluido=a.status==='Concluído';
    var iconBg=isCancelled?'#FFEBEE':isConcluido?'#E3F2FD':'#E8F5E9';
    var iconColor=isCancelled?'#C62828':isConcluido?'#1565C0':'#2E7D32';
    var badgeClass=isCancelled?'cancelado':isConcluido?'concluido':'';
    return '<div class="rec-agend-item" style="border-radius:12px;border:1px solid #f0f0f0;padding:12px;margin-bottom:8px;display:flex;align-items:center;gap:12px;">'
      +'<div class="rec-agend-icon" style="background:'+iconBg+';width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="'+iconColor+'" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>'
      +'<div style="flex:1;min-width:0;">'
      +'<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:2px;">'
      +'<span style="font-size:14px;font-weight:800;">'+(isCancelled?'<s>':'')+a.paciente+(isCancelled?'</s>':'')+'</span>'
      +'<span class="rec-agend-badge '+badgeClass+'" style="font-size:10px;">'+a.status+'</span>'
      +'</div>'
      +'<div style="font-size:11px;color:var(--text-medium);">👤 '+a.prof+' &nbsp;📅 '+a.data+' &nbsp;🕐 '+a.hora+' &nbsp;📋 '+a.tipo+'</div>'
      +(a.obs?'<div style="font-size:11px;color:var(--text-light);margin-top:2px;">📝 '+a.obs+'</div>':'')
      +'</div>'
      +'<div style="display:flex;gap:5px;flex-shrink:0;">'
      +(!isCancelled?'<button title="Editar" onclick="openEditAgend(\''+a.id+'\')" style="width:32px;height:32px;border-radius:8px;border:none;background:#E3F2FD;color:#1565C0;cursor:pointer;display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>':'')
      +'<button title="Cancelar" onclick="deleteAgend(\''+a.id+'\')" style="width:32px;height:32px;border-radius:8px;border:none;background:#FFEBEE;color:#C62828;cursor:pointer;display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/></svg></button>'
      +'</div>'
      +'</div>';
  }).join('');
}
function renderRecSalas(){
  var grid=document.getElementById('recSalasList');if(!grid)return;
  var searchEl=document.getElementById('recSalaSearch');
  var search=searchEl?(searchEl.value||'').toLowerCase().trim():'';
  var salaColors={s1:'linear-gradient(135deg,#2196F3,#03A9F4)',s2:'linear-gradient(135deg,#4CAF50,#2E7D32)',s3:'linear-gradient(135deg,#FF9800,#F57C00)',s4:'linear-gradient(135deg,#E91E63,#C2185B)',s5:'linear-gradient(135deg,#9C27B0,#7B1FA2)'};
  var filtered=DB.salas.filter(function(s){return !search||s.nome.toLowerCase().includes(search)||s.desc.toLowerCase().includes(search);});
  if(!filtered.length){grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-light);">Nenhuma sala encontrada</div>';return;}
  grid.innerHTML=filtered.map(function(s){
    var count=DB.patients.filter(function(p){return p.salaId===s.id;}).length;
    var grad=salaColors[s.id]||'linear-gradient(135deg,#607D8B,#455A64)';
    return '<div class="rec-sala-card">'
      +'<div class="rec-sala-card-header" style="background:'+grad+';">'
      +'<div class="rec-sala-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>'
      +'<div class="rec-sala-card-title">'+s.nome+'</div>'
      +'<div class="rec-sala-card-desc">'+s.desc+'</div>'
      +'<button class="rec-sala-card-del" onclick="event.stopPropagation();deleteSala(\''+s.id+'\')" title="Excluir">🗑️</button>'
      +'</div>'
      +'<div class="rec-sala-card-body">'
      +'<div class="rec-sala-card-count">'+count+'</div>'
      +'<div class="rec-sala-card-countlabel">Pacientes cadastrados</div>'
      +'<button class="rec-sala-card-btn" onclick="recOpenSala(\''+s.id+'\',\''+s.nome.replace(/'/g,"\\'").replace(/"/g,'\\"')+'\')">'
      +'Ver pacientes <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><polyline points="9,18 15,12 9,6"/></svg>'
      +'</button>'
      +'</div>'
      +'</div>';
  }).join('');
}
function openAddPatientModal(salaId){
  var sel=document.getElementById('ap-salaSelect');
  if(sel)sel.innerHTML='<option value="">Selecione...</option>'+DB.salas.map(function(s){return'<option value="'+s.id+'" '+(s.id===salaId?'selected':'')+'>'+s.nome+'</option>';}).join('');
  var sid=document.getElementById('ap-salaId');if(sid)sid.value=salaId||'';
  // Clear fields
  ['ap-nome','ap-diag','ap-resp-nome','ap-resp-tel','ap-resp-email'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var nasc=document.getElementById('ap-nasc');if(nasc)nasc.value='';
  openModal('addPatientModal');
}
function recOpenSala(salaId,salaNome){
  currentSalaId=salaId;
  var svEl=document.getElementById('rec-salas-view');if(svEl)svEl.style.display='none';
  var spvEl=document.getElementById('rec-sala-patients-view');if(spvEl){spvEl.style.display='flex';spvEl.style.flexDirection='column';}
  var sn=document.getElementById('recSalaNome');if(sn)sn.textContent=salaNome;
  renderRecPatients();
}
function recBackToSalas(){
  var svEl=document.getElementById('rec-salas-view');if(svEl){svEl.style.display='flex';svEl.style.flexDirection='column';svEl.style.flex='1';}
  var spvEl=document.getElementById('rec-sala-patients-view');if(spvEl)spvEl.style.display='none';
}
function renderRecPatients(){
  var list=document.getElementById('recPatientsList');if(!list)return;
  var searchEl=document.getElementById('recPatSearch');
  var search=searchEl?(searchEl.value||'').toLowerCase().trim():'';
  var patients=DB.patients.filter(function(p){return p.salaId===currentSalaId&&(!search||p.name.toLowerCase().includes(search));});
  if(!patients.length){list.innerHTML='<div style="text-align:center;padding:32px;color:var(--text-light);">Nenhum paciente nesta sala</div>';return;}
  list.innerHTML=patients.map(function(p){
    var tags=(p.diagnosticos||p.diag||[]).map(function(d){return '<span style="background:#E3F2FD;color:#1565C0;border-radius:20px;padding:2px 8px;font-size:11px;font-weight:700;">'+d+'</span>';}).join(' ');
    return '<div style="background:#fff;border-radius:14px;padding:16px;margin-bottom:10px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;align-items:center;gap:14px;">'
      +'<div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,#4CAF50,#2E7D32);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0;">'+p.name.charAt(0)+'</div>'
      +'<div style="flex:1;">'
      +'<div style="font-size:15px;font-weight:800;color:var(--text-dark);">'+p.name+'</div>'
      +'<div style="font-size:12px;color:var(--text-medium);">'+p.age+' anos</div>'
      +'<div style="margin-top:5px;display:flex;gap:4px;flex-wrap:wrap;">'+tags+'</div>'
      +'</div>'
      +'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>'
      +'</div>';
  }).join('');
}
// saveAgendamento defined above
function deleteAgend(id){
  if(!confirm('Cancelar este agendamento?'))return;
  DB.agendamentos=DB.agendamentos.filter(function(a){return a.id!==id;});
  renderInicioAgendList();renderRecAgendamentos();renderAgendaList();
  showToast('Agendamento cancelado','info');
}
function openEditAgend(id){
  var a=DB.agendamentos.find(function(x){return x.id===id;});if(!a)return;
  document.getElementById('eagId').value=id;
  // Populate patient select
  var pacSel=document.getElementById('eagPaciente');
  if(pacSel)pacSel.innerHTML='<option value="">Selecione...</option>'+DB.patients.map(function(p){return'<option value="'+p.name+'" '+(p.name===a.paciente?'selected':'')+'>'+p.name+'</option>';}).join('');
  // Populate professional select
  var profSel=document.getElementById('eagProf');
  if(profSel){
    var doutores=DB.users.filter(function(u){return u.role==='doutor'&&u.status==='ativo';});
    var opts='<option value="">Selecione...</option>'+doutores.map(function(u){return'<option value="'+u.name+'" '+(u.name===a.prof?'selected':'')+'>'+u.name+'</option>';}).join('');
    if(!doutores.length)opts='<option value="">Selecione...</option><option value="Dr. Carlos Mendes" '+(a.prof==='Dr. Carlos Mendes'?'selected':'')+'>Dr. Carlos Mendes</option>';
    profSel.innerHTML=opts;
  }
  // Populate sala select
  var salaSel=document.getElementById('eagSala');
  if(salaSel)salaSel.innerHTML='<option value="">Sem sala</option>'+DB.salas.map(function(s){return'<option value="'+s.id+'" '+(s.id===a.salaId?'selected':'')+'>'+s.nome+'</option>';}).join('');
  // Set date (convert from BR to ISO for input)
  var dataField=document.getElementById('eagData');
  if(dataField)dataField.value=dateToISO(a.data);
  var horaField=document.getElementById('eagHora');
  if(horaField)horaField.value=a.hora;
  var tipoField=document.getElementById('eagTipo');
  if(tipoField)tipoField.value=a.tipo;
  var statusField=document.getElementById('eagStatus');
  if(statusField)statusField.value=a.status;
  var obsField=document.getElementById('eagObs');
  if(obsField)obsField.value=a.obs||'';
  var m=document.getElementById('editAgendModal');if(m)m.classList.add('open');
}
function saveEditAgend(){
  var id=document.getElementById('eagId').value;
  var a=DB.agendamentos.find(function(x){return x.id===id;});if(!a){showToast('Agendamento não encontrado','error');return;}
  var pac=(document.getElementById('eagPaciente')?.value||'').trim();
  var prof=(document.getElementById('eagProf')?.value||'').trim();
  var dataISO=document.getElementById('eagData')?.value||'';
  var hora=document.getElementById('eagHora')?.value||'';
  if(!pac||!prof||!dataISO||!hora){showToast('Preencha os campos obrigatórios','error');return;}
  a.paciente=pac;
  a.prof=prof;
  a.data=parseDateBR(dataISO); // fix: use parseDateBR to avoid timezone bug
  a.hora=hora;
  a.tipo=document.getElementById('eagTipo')?.value||a.tipo;
  a.status=document.getElementById('eagStatus')?.value||a.status;
  a.salaId=document.getElementById('eagSala')?.value||a.salaId||'';
  a.obs=document.getElementById('eagObs')?.value||'';
  closeModal('editAgendModal');
  renderInicioAgendList();renderRecAgendamentos();renderAgendaList();
  showToast('Agendamento atualizado!','success');
}
function saveSala(){
  var nome=(document.getElementById('sala-nome')?.value||'').trim();if(!nome){showToast('Informe o nome','error');return;}
  DB.salas.push({id:'s'+Date.now(),nome:nome,desc:document.getElementById('sala-desc')?.value||'',cor:document.getElementById('sala-cor')?.value||'#4CAF50'});
  closeModal('newSalaModal');renderRecSalas();showToast('Sala criada!','success');
}
function deleteSala(id){
  if(!confirm('Excluir esta sala?'))return;
  DB.salas=DB.salas.filter(function(s){return s.id!==id;});
  renderRecSalas();showToast('Sala excluída','info');
}
// ============================================================
// FAMILIAR – REBUILD COMPLETO
// ============================================================
function famScrollTop(){var fc=document.querySelector('.fam-content');if(fc)fc.scrollTop=0;}
function initFamiliar(){
  var u=currentUser;
  var pat=null;
  if(u&&u.patientId)pat=DB.patients.find(function(p){return p.id===u.patientId;});
  if(!pat&&u&&u.patientName){
    var pnL=u.patientName.toLowerCase().split(' ')[0];
    pat=DB.patients.find(function(p){return p.name.toLowerCase().includes(pnL);});
    if(pat&&u)u.patientId=pat.id;
  }
  var gr=document.getElementById('famGreeting');if(gr)gr.textContent='Olá, '+(u?u.name.split(' ')[0]:'')+'!';
  if(!pat){
    var ag=document.getElementById('famAge');if(ag)ag.textContent='Aguardando vínculo com paciente';
    var fd=document.getElementById('famDate');if(fd)fd.textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
    var ac=document.getElementById('famAtivCount');if(ac)ac.textContent='Conta pendente de aprovação';
    var fr=document.getElementById('famRotina');if(fr)fr.innerHTML='<div style="background:#FFF3E0;border:1px solid #FFB300;border-radius:14px;padding:20px;text-align:center;"><div style="font-size:32px;margin-bottom:10px;">🔗</div><p style="font-weight:800;margin-bottom:6px;">Aguardando vínculo</p><p style="font-size:13px;color:var(--text-medium);">O administrador precisa vincular sua conta ao paciente.</p></div>';
    ['famMeds','famAtivSemana'].forEach(function(id){var el=document.getElementById(id);if(el)el.innerHTML='';});
    return;
  }
  window._famPat=pat;
  var ag=document.getElementById('famAge');if(ag)ag.textContent=pat.name+' · '+pat.age+' anos';
  var now=new Date();
  var fd=document.getElementById('famDate');if(fd)fd.textContent=now.toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
  var mot=document.getElementById('famMotivation');if(mot)mot.textContent='Continue seguindo a rotina para o melhor desenvolvimento de '+pat.name.split(' ')[0]+'. 💚';
  renderFamRotina(pat);renderFamMeds(pat);renderFamAtivSemana(pat);
}
function renderFamRotina(pat){
  var c=document.getElementById('famRotina');if(!c)return;
  var livePat=DB.patients.find(function(p){return p.id===pat.id;})||pat;
  var hora=new Date().getHours();
  var items=[];
  // Medicamentos (horários)
  (livePat.remedios||[]).filter(function(r){return r.ativo;}).forEach(function(r){
    (r.horarios||[]).forEach(function(h){
      var hNum=parseInt(h.split(':')[0]);
      items.push({icon:'💊',nome:'Medicamento – '+r.nome+' '+r.dosagem,hora:h,done:hora>hNum,tipo:'med'});
    });
  });
  // Consultas e atividades
  (livePat.atividades||[]).forEach(function(a){
    if(a.proxima){
      var horaPart=(a.proxima.split('–')[1]||a.proxima.split('-')[1]||'10:00').trim();
      var hNum2=parseInt(horaPart.split(':')[0]);
      items.push({icon:'🧠',nome:a.nome,hora:horaPart,done:hora>hNum2,tipo:'atv'});
    }
  });
  // Lembretes médicos dos agendamentos do dia
  var todayStr=new Date().toLocaleDateString('pt-BR');
  DB.agendamentos.filter(function(a){return a.paciente===pat.name&&a.data===todayStr&&a.status!=='Cancelado';}).forEach(function(a){
    var hNum3=parseInt((a.hora||'00').split(':')[0]);
    items.push({icon:'📋',nome:'Consulta: '+a.tipo+' – '+a.prof,hora:a.hora||'--:--',done:hora>hNum3,tipo:'consulta'});
  });
  items.sort(function(a,b){return a.hora.localeCompare(b.hora);});
  var seen=new Set();
  items=items.filter(function(x){var k=x.hora+x.nome;if(seen.has(k))return false;seen.add(k);return true;});
  var iconBg={'med':'#FCE4EC','atv':'#E8F5E9','consulta':'#E3F2FD'};
  var ativToday=items.filter(function(i){return i.tipo==='atv'||i.tipo==='consulta';}).length;
  var ac=document.getElementById('famAtivCount');if(ac)ac.textContent=ativToday+' atividades hoje';
  if(!items.length){c.innerHTML='<p style="text-align:center;color:var(--text-light);padding:20px;">Sem rotina cadastrada</p>';return;}
  c.innerHTML=items.map(function(r){
    var opacity=r.done?'0.6':'1';
    var strikeStyle=r.done?'text-decoration:line-through;color:var(--text-light);':'';
    var bg=iconBg[r.tipo]||'#F5F5F5';
    return '<div class="fam-rot-item" style="opacity:'+opacity+';">'
      +'<div class="fam-rot-icon" style="background:'+bg+';">'+r.icon+'</div>'
      +'<div style="flex:1;">'
      +'<p style="font-size:13px;font-weight:600;'+strikeStyle+'">'+r.nome+'</p>'
      +'<p style="font-size:11px;color:var(--text-light);">'+r.hora+'</p>'
      +'</div>'
      +(r.done?'<div class="fam-rot-check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20,6 9,17 4,12"/></svg></div>':'')
      +'</div>';
  }).join('');
}


function renderFamMeds(pat){
  var c=document.getElementById('famMeds');if(!c)return;
  var livePat=DB.patients.find(function(p){return p.id===pat.id;})||pat;
  var meds=(livePat.remedios||[]).filter(function(r){return r.ativo;});
  var colors=['#4CAF50','#2196F3','#FF9800','#9C27B0','#E91E63'];
  if(!meds.length){c.innerHTML='<p style="text-align:center;color:var(--text-light);padding:16px;">Nenhum medicamento ativo</p>';return;}
  c.innerHTML=meds.map(function(r,i){
    var col=colors[i%colors.length];
    var hrs=(r.horarios||[]);
    return '<div class="fam-med-card-v2" style="border-left-color:'+col+';">'
      +'<div><p style="font-size:15px;font-weight:800;color:var(--text-dark);margin-bottom:2px;">'+r.nome+'</p>'
      +'<p style="font-size:12px;color:var(--text-medium);">Dosagem: '+r.dosagem+'</p></div>'
      +'<div style="text-align:right;"><p style="font-size:11px;color:var(--text-medium);margin-bottom:5px;">Horários:</p>'
      +'<div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;">'+hrs.map(function(h){return'<span class="med-time"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>'+h+'</span>';}).join('')+'</div></div>'
      +'</div>';
  }).join('');
}

function renderFamAtivSemana(pat){
  var c=document.getElementById('famAtivSemana');if(!c)return;
  var livePat=DB.patients.find(function(p){return p.id===pat.id;})||pat;
  var hoje=new Date().getDay();
  var dias=[
    {dia:'Segunda',dow:1},
    {dia:'Terça',dow:2},
    {dia:'Quarta',dow:3},
    {dia:'Quinta',dow:4},
    {dia:'Sexta',dow:5}
  ];
  // Build schedule from activities
  var schedule={};
  dias.forEach(function(d){schedule[d.dia]=[];});
  (livePat.atividades||[]).forEach(function(a){
    if(a.proxima){
      var hora=a.proxima.split('–')[1]||a.proxima.split('-')[1]||'10:00';
      hora=(hora||'').trim().replace(/\s.*/,'');
      dias.forEach(function(d,i){
        if(i%2===0)schedule[d.dia].push(a.nome+(hora?' '+hora+'h':''));
        else if(i%3===0)schedule[d.dia].push(a.nome+(hora?' '+hora+'h':''));
      });
    }
  });
  // fallback sample
  if(livePat.atividades&&livePat.atividades.length){
    schedule['Segunda']=(livePat.atividades.slice(0,2).map(function(a){var h=a.proxima?a.proxima.split('–')[1]||a.proxima.split('-')[1]||'10:00':'10:00';return a.nome+' '+(h||'').trim().split(' ')[0]+'h';}));
    schedule['Terça']=(livePat.atividades.slice(1,2).map(function(a){return a.nome+' 14h';}));
    schedule['Quarta']=(livePat.atividades.slice(0,3).map(function(a,i){return a.nome+' '+(i===0?'10h':'15h');}));
    schedule['Quinta']=(livePat.atividades.slice(1,2).map(function(a){return a.nome+' 14h';}));
    schedule['Sexta']=(livePat.atividades.slice(0,1).map(function(a){return a.nome+' 10h';}));
  }
  c.innerHTML=dias.map(function(d){
    var isToday=d.dow===hoje;
    var acts=schedule[d.dia]||[];
    return '<div class="fam-week-item-v2'+(isToday?' today':'')+'">'
      +'<span class="fam-week-day-chip">'+d.dia+'</span>'
      +'<div>'+(acts.length?acts.map(function(a){return'<p style="font-size:13px;margin-bottom:2px;">• '+a+'</p>';}).join(''):'<p style="font-size:12px;opacity:.6;">Sem atividades</p>')+'</div>'
      +'</div>';
  }).join('');
}

// savePatient, openEditPatient, saveEditPatient defined above (primary definitions)
function renderRecSalaPats(){
  var pats=DB.patients.filter(function(p){return p.salaId===currentSalaId;});
  var cont=document.getElementById('recSalaPatientsContent');
  if(!cont){renderRecPatients();return;}
  if(!pats.length){cont.innerHTML='<div style="text-align:center;padding:32px;color:var(--text-light);">Nenhum paciente nesta sala</div>';return;}
  cont.innerHTML=pats.map(function(p){
    var diags=(p.diag||p.diagnosticos||[]).join(', ');
    return '<div class="pat-card">'
      +'<div class="pat-av">'+p.name[0]+'</div>'
      +'<div style="flex:1;">'
      +'<div style="font-weight:700;">'+p.name+'</div>'
      +'<div style="font-size:12px;color:var(--text-light);">'+p.age+' anos · '+diags+'</div>'
      +'<div style="font-size:12px;color:var(--text-medium);">Resp: '+p.responsavel.nome+'</div>'
      +'</div>'
      +'<button class="btn btn-outline-green btn-sm" onclick="openEditPatient(\''+p.id+'\')">✏️ Editar</button>'
      +'</div>';
  }).join('');
}


function openVincularFamiliarModal(){
  var famSel=document.getElementById('vf-userId');
  var patSel=document.getElementById('vf-patientId');
  if(famSel){
    famSel.innerHTML='<option value="">Selecione o familiar...</option>'+
      DB.users.filter(function(u){return u.role==='familiar'&&u.status==='ativo';})
      .map(function(u){return '<option value="'+u.id+'">'+u.name+' ('+u.email+')'+(u.patientId?' ✅ já vinculado':'')+'</option>';}).join('');
  }
  if(patSel){
    patSel.innerHTML='<option value="">Selecione o paciente...</option>'+
      DB.patients.map(function(p){return '<option value="'+p.id+'">'+p.name+' ('+p.age+' anos)</option>';}).join('');
  }
  openModal('vincularFamiliarModal');
}
function vincularFamiliarModal(){
  var userId=document.getElementById('vf-userId').value;
  var patientId=document.getElementById('vf-patientId').value;
  if(!userId||!patientId){showToast('Selecione familiar e paciente','error');return;}
  vincularFamiliar(userId,patientId);
  closeModal('vincularFamiliarModal');
}


// ═══════════════════════════════════════════════════════════
// MODELOS MÉDICOS — Atestado, Declaração, Receituário
// ═══════════════════════════════════════════════════════════
function abrirModeloAtestado(){
  var p = currentPatient;
  var n = document.getElementById('at2-nome');
  if(n && p) n.value = p.name;
  var med = document.getElementById('at2-med');
  if(med && currentUser) med.value = currentUser.name;
  var dt = document.getElementById('at2-data');
  if(dt) dt.value = new Date().toISOString().split('T')[0];
  openModal('modeloAtestadoModal');
  atualizarPreviewAtestado();
}
function atualizarPreviewAtestado(){
  var nome  = document.getElementById('at2-nome')?.value||'______________________';
  var data  = document.getElementById('at2-data')?.value ? new Date(document.getElementById('at2-data').value).toLocaleDateString('pt-BR') : '__/__/____';
  var cid   = document.getElementById('at2-cid')?.value||'';
  var dias  = document.getElementById('at2-dias')?.value||'';
  var obs   = document.getElementById('at2-obs')?.value||'';
  var med   = document.getElementById('at2-med')?.value||'';
  var crm   = document.getElementById('at2-crm')?.value||'';
  var html2 = '<div style="text-align:center;margin-bottom:12px;">'
    + '<p style="font-weight:700;font-size:14px;letter-spacing:1px;">ATESTADO MÉDICO</p>'
    + '<p style="font-size:10px;color:#666;">ASIPECA — Associação de Apoio às Crianças com TEA e Câncer</p>'
    + '</div>'
    + '<p>Atesto para os devidos fins que o(a) paciente <strong>' + nome + '</strong>'
    + (cid ? ', portador(a) do CID-10: <strong>' + cid + '</strong>,' : '')
    + ' necessita de afastamento de suas atividades '
    + (dias ? 'por <strong>' + dias + ' dia(s)</strong>' : '')
    + ' a partir da data de <strong>' + data + '</strong>.</p>'
    + (obs ? '<p style="margin-top:8px;">' + obs + '</p>' : '')
    + '<div style="margin-top:20px;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;">'
    + '<span>Data: ' + data + '</span>'
    + '<span>' + med + (crm ? ' · ' + crm : '') + '</span>'
    + '</div>';
  var prev = document.getElementById('previewAtestado');
  if(prev) prev.innerHTML = html2;
}
function salvarAtestado(){
  var nome = document.getElementById('at2-nome')?.value?.trim();
  if(!nome){ showToast('Informe o nome do paciente','error'); return; }
  if(currentPatient){
    currentPatient.documentos = currentPatient.documentos||[];
    currentPatient.documentos.unshift({
      id:'d'+Date.now(), tipo:'Atestado',
      nome:'Atestado Médico – '+nome,
      data:new Date().toLocaleDateString('pt-BR'),
      prof:currentUser?.name||'Médico', mine:true,
      conteudo: document.getElementById('previewAtestado')?.innerHTML||''
    });
    renderDocs();
  }
  closeModal('modeloAtestadoModal');
  showToast('Atestado salvo com sucesso!','success');
}

function abrirModeloDeclaracao(){
  var p = currentPatient;
  var n = document.getElementById('dec2-nome');
  if(n && p) n.value = p.name;
  var med = document.getElementById('dec2-med');
  if(med && currentUser) med.value = currentUser.name;
  var dt = document.getElementById('dec2-data');
  if(dt) dt.value = new Date().toISOString().split('T')[0];
  openModal('modeloDeclaracaoModal');
  atualizarPreviewDeclaracao();
}
function atualizarPreviewDeclaracao(){
  var nome    = document.getElementById('dec2-nome')?.value||'______________________';
  var data    = document.getElementById('dec2-data')?.value ? new Date(document.getElementById('dec2-data').value).toLocaleDateString('pt-BR') : '__/__/____';
  var hora    = document.getElementById('dec2-hora')?.value||'';
  var periodo = document.getElementById('dec2-periodo')?.value||'';
  var motivo  = document.getElementById('dec2-motivo')?.value||'atendimento médico';
  var med     = document.getElementById('dec2-med')?.value||'';
  var html2 = '<div style="text-align:center;margin-bottom:12px;">'
    + '<p style="font-weight:700;font-size:14px;letter-spacing:1px;">DECLARAÇÃO</p>'
    + '<p style="font-size:10px;color:#666;">ASIPECA — Associação de Apoio às Crianças com TEA e Câncer</p>'
    + '</div>'
    + '<p>Declaro que o(a) paciente <strong>' + nome + '</strong> compareceu a esta instituição'
    + (motivo ? ' para <strong>' + motivo + '</strong>' : '')
    + ' na data de <strong>' + data + '</strong>'
    + (hora ? ' às ' + hora : '')
    + (periodo ? ', no período de ' + periodo : '') + '.</p>'
    + '<div style="margin-top:20px;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;">'
    + '<span>Data: ' + data + '</span>'
    + '<span>' + med + '</span>'
    + '</div>';
  var prev = document.getElementById('previewDeclaracao');
  if(prev) prev.innerHTML = html2;
}
function salvarDeclaracao(){
  var nome = document.getElementById('dec2-nome')?.value?.trim();
  if(!nome){ showToast('Informe o nome','error'); return; }
  if(currentPatient){
    currentPatient.documentos = currentPatient.documentos||[];
    currentPatient.documentos.unshift({
      id:'d'+Date.now(), tipo:'Declaração',
      nome:'Declaração – '+nome,
      data:new Date().toLocaleDateString('pt-BR'),
      prof:currentUser?.name||'Médico', mine:true,
      conteudo: document.getElementById('previewDeclaracao')?.innerHTML||''
    });
    renderDocs();
  }
  closeModal('modeloDeclaracaoModal');
  showToast('Declaração salva!','success');
}

function abrirModeloReceituario(){
  var p = currentPatient;
  var n = document.getElementById('rec2-paciente');
  if(n && p) n.value = p.name;
  var med = document.getElementById('rec2-crm');
  if(med && currentUser) med.value = currentUser.name;
  var dt = document.getElementById('rec2-data');
  if(dt) dt.value = new Date().toISOString().split('T')[0];
  openModal('modeloReceituarioModal');
  atualizarPreviewReceituario();
}
function atualizarPreviewReceituario(){
  var pac  = document.getElementById('rec2-paciente')?.value||'______________________';
  var data = document.getElementById('rec2-data')?.value ? new Date(document.getElementById('rec2-data').value).toLocaleDateString('pt-BR') : '__/__/____';
  var med  = document.getElementById('rec2-med')?.value||'______________________';
  var dose = document.getElementById('rec2-dose')?.value||'';
  var freq = document.getElementById('rec2-freq')?.value||'';
  var dur  = document.getElementById('rec2-dur')?.value||'';
  var obs  = document.getElementById('rec2-obs')?.value||'';
  var crm  = document.getElementById('rec2-crm')?.value||'';
  var html2 = '<div style="text-align:center;margin-bottom:12px;">'
    + '<p style="font-weight:700;font-size:14px;letter-spacing:1px;">RECEITUÁRIO MÉDICO</p>'
    + '<p style="font-size:10px;color:#666;">ASIPECA</p>'
    + '</div>'
    + '<p><strong>Paciente:</strong> ' + pac + '</p>'
    + '<div style="margin:10px 0;padding:10px;background:#f5f5f5;border-radius:4px;">'
    + '<p><strong>Rx:</strong> ' + med + (dose ? ' — ' + dose : '') + '</p>'
    + (freq ? '<p>Frequência: ' + freq + '</p>' : '')
    + (dur  ? '<p>Duração: ' + dur + '</p>' : '')
    + (obs  ? '<p>Obs: ' + obs + '</p>' : '')
    + '</div>'
    + '<div style="margin-top:20px;border-top:1px solid #ccc;padding-top:10px;display:flex;justify-content:space-between;">'
    + '<span>Data: ' + data + '</span><span>' + crm + '</span>'
    + '</div>';
  var prev = document.getElementById('previewReceituario');
  if(prev) prev.innerHTML = html2;
}
function salvarReceituario(){
  var pac = document.getElementById('rec2-paciente')?.value?.trim();
  var med = document.getElementById('rec2-med')?.value?.trim();
  if(!pac||!med){ showToast('Preencha paciente e medicamento','error'); return; }
  if(currentPatient){
    // Save as document
    currentPatient.documentos = currentPatient.documentos||[];
    currentPatient.documentos.unshift({
      id:'d'+Date.now(), tipo:'Receituário',
      nome:'Receituário – '+med,
      data:new Date().toLocaleDateString('pt-BR'),
      prof:currentUser?.name||'Médico', mine:true,
      conteudo: document.getElementById('previewReceituario')?.innerHTML||''
    });
    // Also add to medications if user confirms
    var dose = document.getElementById('rec2-dose')?.value||'';
    var freq = document.getElementById('rec2-freq')?.value||'';
    currentPatient.remedios = currentPatient.remedios||[];
    currentPatient.remedios.push({
      id:'r'+Date.now(), nome:med, dosagem:dose,
      horarios:['08:00'], dias:['Seg','Ter','Qua','Qui','Sex'],
      ativo:true, obs:freq
    });
    renderDocs(); renderRemedios();
  }
  closeModal('modeloReceituarioModal');
  showToast('Receituário salvo e medicamento adicionado!','success');
}

function imprimirDocumento(previewId, titulo){
  var prev = document.getElementById(previewId);
  if(!prev){ showToast('Nada para imprimir','error'); return; }
  var win = window.open('','_blank','width=700,height=800');
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + titulo + ' - ASIPECA</title>'
    + '<link rel="stylesheet" href="css/style.css">'
    + '</head><body>'
    + '<div style="text-align:center;margin-bottom:20px;border-bottom:2px solid #333;padding-bottom:12px;">'
    + '<h2 style="margin:0;font-size:16px;">ASIPECA</h2>'
    + '<p style="font-size:11px;margin:2px 0 0;">Associação de Apoio às Crianças com TEA e Câncer · Sorocaba/SP · (15) 3329-1003</p>'
    + '</div>'
    + prev.innerHTML
    + '</body></html>'
  );
  win.document.close();
  win.focus();
  setTimeout(function(){ win.print(); }, 400);
}


function renderVinculoTab(){
  var familiares=DB.users.filter(function(u){return u.role==='familiar'&&u.status==='ativo';});
  var vinculados=familiares.filter(function(u){return u.patientId;}).length;
  var semVinculo=familiares.length-vinculados;
  var tf=document.getElementById('vf-total-familiares');if(tf)tf.textContent=familiares.length;
  var tv=document.getElementById('vf-vinculados');if(tv)tv.textContent=vinculados;
  var sv=document.getElementById('vf-sem-vinculo');if(sv)sv.textContent=semVinculo;
  var fSel=document.getElementById('vf-select-familiar');
  if(fSel){fSel.innerHTML='<option value="">Selecione o familiar...</option>'+familiares.map(function(u){var pat=u.patientId?DB.patients.find(function(p){return p.id===u.patientId;}):null;return'<option value="'+u.id+'">'+u.name+(pat?' (→ '+pat.name+')':' (sem vínculo)')+'</option>';}).join('');}
  var pSel=document.getElementById('vf-select-paciente');
  if(pSel){pSel.innerHTML='<option value="">Selecione o paciente...</option>'+DB.patients.map(function(p){var fam=DB.users.find(function(u){return u.patientId===p.id&&u.role==='familiar';});return'<option value="'+p.id+'">'+p.name+(fam?' (→ '+fam.name+')':' (sem familiar)')+'</option>';}).join('');}
  var lista=document.getElementById('vf-lista-vinculos');
  if(!lista)return;
  if(!familiares.length){lista.innerHTML='<p style="color:var(--text-light);text-align:center;padding:20px;">Nenhum familiar cadastrado</p>';return;}
  lista.innerHTML=familiares.map(function(u){var pat=u.patientId?DB.patients.find(function(p){return p.id===u.patientId;}):null;return'<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);"><div style="width:38px;height:38px;border-radius:50%;background:#FFF3E0;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;">🏠</div><div style="flex:1;"><p style="font-weight:700;font-size:13px;">'+u.name+'</p><p style="font-size:11px;color:var(--text-medium);">'+u.email+'</p>'+(pat?'<p style="font-size:11px;color:var(--green);">✅ Vinculado: '+pat.name+'</p>':'<p style="font-size:11px;color:#E65100;">⚠️ Sem vínculo</p>')+'</div>'+(pat?'<button class="btn btn-outline-red btn-sm" onclick="desvincularFamiliar(\''+u.id+'\')">Desvincular</button>':'')+'</div>';}).join('');
}
function confirmarVinculo(){
  var userId=document.getElementById('vf-select-familiar')?.value;
  var patId=document.getElementById('vf-select-paciente')?.value;
  if(!userId||!patId){showToast('Selecione familiar e paciente','error');return;}
  var u=DB.users.find(function(x){return x.id===userId;});
  var p=DB.patients.find(function(x){return x.id===patId;});
  if(!u||!p){showToast('Erro ao localizar','error');return;}
  u.patientId=patId;u.patientName=p.name;
  renderVinculoTab();showToast('✅ '+u.name+' vinculado a '+p.name,'success');
}
function desvincularFamiliar(userId){
  if(!confirm('Desvincular familiar do paciente?'))return;
  var u=DB.users.find(function(x){return x.id===userId;});
  if(u){delete u.patientId;delete u.patientName;}
  renderVinculoTab();showToast('Familiar desvinculado','info');
}
function renderAdminPacientes(){
  // Populate sala filter
  var salaFilter=document.getElementById('admin-pat-sala');
  if(salaFilter&&salaFilter.options.length===1){
    DB.salas.forEach(function(s){var o=document.createElement('option');o.value=s.id;o.textContent=s.nome;salaFilter.appendChild(o);});
  }
  var search=(document.getElementById('admin-pat-search')?.value||'').toLowerCase();
  var salaId=document.getElementById('admin-pat-sala')?.value||'';
  var pats=DB.patients.filter(function(p){
    if(search&&!p.name.toLowerCase().includes(search))return false;
    if(salaId&&p.salaId!==salaId)return false;
    return true;
  });
  var cnt=document.getElementById('admin-pat-count');if(cnt)cnt.textContent=pats.length+' paciente(s) de '+DB.patients.length+' total';
  var list=document.getElementById('admin-pat-list');if(!list)return;
  if(!pats.length){list.innerHTML='<p style="text-align:center;color:var(--text-light);padding:24px;">Nenhum paciente encontrado</p>';return;}
  list.innerHTML=pats.map(function(p){
    var sala=DB.salas.find(function(s){return s.id===p.salaId;})||{nome:'Sem sala',cor:'#999'};
    var fam=DB.users.find(function(u){return u.patientId===p.id&&u.role==='familiar';});
    var diags=(p.diag||p.diagnosticos||[]);
    return '<div style="display:flex;align-items:flex-start;gap:12px;padding:12px;margin-bottom:8px;background:#fff;border-radius:12px;border:1px solid var(--border);">'
      +'<div style="width:42px;height:42px;border-radius:50%;background:'+(sala.cor||'#4CAF50')+';display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:#fff;flex-shrink:0;">'+p.name[0]+'</div>'
      +'<div style="flex:1;min-width:0;">'
      +'<p style="font-weight:700;font-size:14px;">'+p.name+'</p>'
      +'<p style="font-size:12px;color:var(--text-medium);">'+p.age+' anos · '+sala.nome+(fam?' · 👨‍👩‍👧 '+fam.name:'')+'</p>'
      +(diags.length?'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">'+diags.map(function(d){return'<span style="background:#E3F2FD;color:#1565C0;border-radius:12px;padding:1px 7px;font-size:10px;font-weight:700;">'+d+'</span>';}).join('')+'</div>':'')
      +'<p style="font-size:11px;color:var(--text-light);margin-top:3px;">Resp: '+p.responsavel.nome+' · '+p.responsavel.tel+'</p>'
      +'</div>'
      +'<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">'
      +'<button class="btn btn-outline-green btn-sm" onclick="openAdminEditPatient(\''+p.id+'\')">✏️ Editar</button>'
      +'<button class="btn btn-outline-red btn-sm" onclick="adminDeletePatient(\''+p.id+'\')">🗑️ Excluir</button>'
      +'</div>'
      +'</div>';
  }).join('');
}
function openAdminAddPatient(){
  // Reuse the existing addPatientModal but populate sala select
  var sel=document.getElementById('ap-salaSelect');
  if(sel)sel.innerHTML='<option value="">Selecione...</option>'+DB.salas.map(function(s){return'<option value="'+s.id+'">'+s.nome+'</option>';}).join('');
  var sid=document.getElementById('ap-salaId');if(sid)sid.value='';
  ['ap-nome','ap-diag','ap-resp-nome','ap-resp-tel','ap-resp-email'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  var nasc=document.getElementById('ap-nasc');if(nasc)nasc.value='';
  // Override save to also refresh admin view
  window._adminPatMode=true;
  openModal('addPatientModal');
}
function adminDeletePatient(id){
  var p=DB.patients.find(function(x){return x.id===id;});
  if(!p)return;
  if(!confirm('Excluir o paciente "'+p.name+'"? Esta ação não pode ser desfeita.'))return;
  DB.patients=DB.patients.filter(function(x){return x.id!==id;});
  // Remove any family links
  DB.users.forEach(function(u){if(u.patientId===id){delete u.patientId;delete u.patientName;}});
  // Remove related appointments
  DB.agendamentos=DB.agendamentos.filter(function(a){return a.paciente!==p.name;});
  saveDB();
  renderAdminPacientes();renderVinculoTab();
  showToast('Paciente "'+p.name+'" excluído!','info');
}
function openAdminEditPatient(id){
  var p=DB.patients.find(function(x){return x.id===id;});if(!p)return;
  document.getElementById('ep-id').value=id;
  document.getElementById('ep-nome').value=p.name;
  document.getElementById('ep-diag').value=p.diag[0]||'';
  document.getElementById('ep-resp-nome').value=p.responsavel.nome;
  document.getElementById('ep-resp-tel').value=p.responsavel.tel;
  document.getElementById('ep-resp-email').value=p.responsavel.email;
  var sel=document.getElementById('ep-salaId');
  sel.innerHTML='<option value="">Sem sala</option>'+DB.salas.map(function(s){return'<option value="'+s.id+'" '+(s.id===p.salaId?'selected':'')+'>'+s.nome+'</option>';}).join('');
  window._adminPatMode=true;
  var m=document.getElementById('editPatientModal');if(m)m.classList.add('open');
}

function salvarPerfil(){
  var nome = (document.getElementById('perfil-nome')?.value||'').trim();
  var senha = document.getElementById('perfil-senha')?.value||'';
  var senha2 = document.getElementById('perfil-senha2')?.value||'';
  var msg = document.getElementById('perfil-msg');
  function showMsg(text, ok){
    if(msg){
      msg.style.display='block';
      msg.style.background=ok?'#E8F5E9':'#FFEBEE';
      msg.style.color=ok?'#1B5E20':'#C62828';
      msg.textContent=text;
    }
  }
  if(!nome){ showMsg('⚠️ Informe o nome completo', false); return; }
  if(senha && senha !== senha2){ showMsg('⚠️ As senhas não coincidem', false); return; }
  if(currentUser){
    currentUser.name = nome;
    currentUser.cargo = document.getElementById('perfil-cargo')?.value||currentUser.cargo;
    if(senha) currentUser.password = senha;
    // Update greeting elements across all screens
    ['adminName','docSalaGreeting','recGreeting','recName','famGreeting'].forEach(function(id){
      var el=document.getElementById(id);
      if(el && el.textContent.length < 50) el.textContent = el.textContent.replace(/^(Olá, |)[A-Za-zÀ-ú]+/, function(m){ return m.replace(/[A-Za-zÀ-ú]+$/, nome.split(' ')[0]); });
    });
    var av = document.getElementById('perfilAvatar'); if(av) av.textContent = nome[0].toUpperCase();
  }
  showMsg('✅ Perfil atualizado com sucesso!', true);
  setTimeout(function(){ if(msg) msg.style.display='none'; closeModal('perfilModal'); }, 1500);
}

function salvarConfig(){
  var msg = document.getElementById('config-msg');
  if(msg){
    msg.style.display='block';
    msg.style.background='#E8F5E9';
    msg.style.color='#1B5E20';
    msg.textContent='✅ Configurações salvas com sucesso!';
    setTimeout(function(){
      msg.style.display='none';
      closeModal('configModal');
    }, 1500);
  } else {
    closeModal('configModal');
    showToast('Configurações salvas!','success');
  }
}

function salvarConfig(){
  var msg = document.getElementById('config-msg');
  if(msg){
    msg.style.display='block';
    msg.style.background='#E8F5E9';
    msg.style.color='#1B5E20';
    msg.textContent='✅ Configurações salvas!';
    setTimeout(function(){ msg.style.display='none'; closeModal('configModal'); }, 1500);
  } else {
    closeModal('configModal');
    showToast('Configurações salvas!','success');
  }
}

document.querySelectorAll('.modal-overlay').forEach(overlay=>{overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open');});});
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown-menu')&&!e.target.closest('.menu-btn'))closeAllMenus();if(!e.target.closest('.fab')&&!e.target.closest('.fab-menu')&&!e.target.closest('.fab-sub')&&fabOpen)closeFabAll();});