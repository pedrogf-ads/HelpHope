# Prompt 47

PROBLEMA 1: Admin volta para o login ❌ O que está acontecendo
Quando você clica em:
Agenda Área do doutor
O Figma está usando: 👉 “Navigate to” direto para outra tela sem retorno lógico
E o botão de voltar está apontando para: 👉 Login (errado)
✅ SOLUÇÃO CORRETA (NO FIGMA) ✔️ Passo 1: Criar botão fixo
Na tela de Agenda e Doutor, adicione:
👉 Botão: “← Voltar para Administração”
✔️ Passo 2: Configurar interação
No botão:
Ação: Navigate to Destino: Tela de Administração (Home Admin) 🔥 Melhor ainda (mais profissional)
Use:
👉 Overlay ou Variants (avançado)
OU:
👉 Duplique telas:
Admin_Home Admin_Agenda Admin_Doutor
E navegue entre elas
💡 REGRA IMPORTANTE
👉 Nunca use o botão “voltar” padrão do protótipo 👉 Sempre crie botões de navegação explícitos
🧾 PROBLEMA 2: Prontuário (estrutura) ❌ Hoje: 3 tipos aparecem direto no botão “+” ✅ Como deve ficar ➕ Botão “+”
Mostrar apenas:
👉 Prontuário
Ao clicar em “Prontuário”
Abrir tela/modal com:
Terapêutico Clínico Acompanhamento 📋 Layout (estilo real)
Cada prontuário deve parecer:
Paciente: João Silva Data: 10/04/2026 Profissional: Dr. X
[ Conteúdo organizado ]
Observações: ...
Conduta: ...
Assinatura:
👉 Use:
divisores títulos espaçamento 👉 Isso dá cara de sistema real 💊 PROBLEMA 3: Medicamento (ativar/desativar) ⚠️ IMPORTANTE
👉 Isso NÃO funciona de verdade no Figma 👉 Só simulação visual
✅ Como simular no Figma ✔️ Use VARIANTS (Componentes)
Crie 2 estados:
Ativado verde visível na tela do paciente Desativado cinza não aparece na tela do paciente ✔️ Interação Clique → Change to (variant) ✔️ Tela do paciente
Crie duas versões:
com medicamento sem medicamento
👉 simulação visual apenas
🔥 RESUMO (bem direto) Navegação Criar botão: Voltar para Administração Nunca depender do “back” automático Prontuário “+” → só Prontuário Depois escolher tipo Layout estilo documento real Medicamento Usar variants Simular ativado/desativado
