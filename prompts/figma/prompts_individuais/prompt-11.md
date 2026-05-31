# Prompt 11

Crie telas e fluxos de um sistema web responsivo para gestão de uma clínica/organização de saúde (ASIPECA), focado em usabilidade, clareza e escalabilidade. O sistema já está em desenvolvimento, então melhore e organize as funcionalidades abaixo de forma prática e implementável.
🎯 OBJETIVO
Organizar gestão de pacientes, profissionais, financeiro e comunicação em um único sistema intuitivo.
👥 1. ESTRUTURA DE USUÁRIOS (COM PERMISSÕES)
Crie um sistema de perfis com controle de acesso (RBAC), com dashboards personalizados para cada tipo:
Administrador (acesso total) Financeiro (relatórios, pagamentos, faturamento) Profissional de saúde (visualizar pacientes, evoluções) Paciente (visualização limitada) Familiar/Responsável (acesso prioritário e decisório)
💡 Regras importantes:
Responsáveis têm prioridade sobre decisões do paciente Interface deve mudar conforme o tipo de usuário Mostrar apenas o que for relevante para cada perfil 🧠 2. PRONTUÁRIO E INFORMAÇÕES CLÍNICAS
Criar tela de prontuário do paciente com:
Histórico completo padronizado Campo de “decisões do responsável” (com destaque visual) Evoluções por profissional (substituir “consulta” por “evolução”) Visualização por linha do tempo Filtros por profissional, data e tipo de atendimento
💡 Foco:
Acesso rápido Informação clara Padronização entre diferentes terapias 📞 3. RECEPÇÃO E COMUNICAÇÃO
Criar uma aba exclusiva chamada Recepção, contendo:
Agenda com calendário visual (tipo Google Calendar) Agendamentos automáticos e manuais Chat interno (equipe ↔ responsáveis) Notificações rápidas (ex: confirmação de consulta)
💡 Melhorias:
Interface simples e rápida (uso diário) Botões de ação rápida (agendar, remarcar, cancelar) 💰 4. FINANCEIRO E RELATÓRIOS
Criar dashboard financeiro com:
Relatórios detalhados de atendimentos Valores por serviço Filtros por período Exportação (PDF/Excel)
💡 Importante:
Mostrar claramente: Custos totais Parte paga pela ASIPECA Parte subsidiada Layout visual com gráficos (barras/pizza) 🏷️ 5. PADRONIZAÇÃO DE NOMENCLATURA
Aplicar no sistema:
Substituir “Consulta” por “Evolução” Padronizar termos médicos e administrativos 💬 6. FEEDBACK DOS USUÁRIOS
Criar módulo de feedback com:
Envio anônimo Mensagem clara informando anonimato Campo de texto simples Dashboard para admin visualizar feedbacks 🤝 7. ASSISTÊNCIA SOCIAL
Criar módulo específico com:
Registro de necessidades: Medicamentos Cesta básica Apoio social Status da solicitação (pendente, aprovado, entregue) Histórico por paciente/família 📢 8. ALERTAS E AVISOS
Criar sistema de notificações gerais:
Envio de avisos para todos ou grupos específicos Tipos: Eventos (ex: confraternizações) Avisos importantes Exibição: Banner no sistema Notificação destacada 🎨 DIRETRIZES DE DESIGN Interface limpa e moderna (estilo SaaS) Priorizar UX simples (poucos cliques) Uso de cores suaves (área da saúde) Componentes reutilizáveis Design responsivo
