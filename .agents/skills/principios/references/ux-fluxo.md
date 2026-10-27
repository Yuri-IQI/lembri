# UX — Decisão de Fluxo Mobile no Aplicativo Lembri

Material de consulta da skill `principios`, par de `ui-componentes.md`. A divisão entre os dois é por **momento**:
- **este arquivo:** decisão — quem usa, para quê, em que ordem, feedback de ações, termos, prevenção de erros e conformidade de fluxo com **WCAG 2.2 Nível AAA**. Serve ao *plano*: leia antes de escrever código e quando o pedido envolver fluxo novo ou alterado.
- **`ui-componentes.md`:** execução — qual componente React Native, quais estilos e tokens aplicar. Leia ao implementar a tela.

---

## 1. Contexto de Uso do Aplicativo Lembri

O **Lembri** atende usuários que necessitam de organização de rotina, lembretes de medicamentos, afazeres e exercícios periódicos, integrando celular e relógio Wear OS.

### Perfis de Uso e Cenários Frequentes:
1. **Adição Rápida de Lembretes no Celular:**
   - O usuário precisa registrar uma tarefa em segundos com digitação mínima.
   - O botão de envio deve estar imediatamente acessível e dar retorno visual instantâneo ("Enviado para 1 relógio").
2. **Consulta e Conclusão no Relógio:**
   - O relógio exibe a lista simplificada para visualização imediata no pulso.
   - O toque para concluir no relógio deve atualizar o status no celular quase em tempo real ("Concluído no relógio ✓").
3. **Usuário com Atenção Dividida, Idosos ou Pessoas com Restrições Motoras/Cognitivas:**
   - Alvos de toque grandes (`TouchTarget = 56`) evitam toques acidentais em movimento.
   - Confirmações simples sem diálogos excessivos para tarefas rotineiras, mas com proteção contra exclusões acidentais.
   - Respeito integral ao nível **AAA da WCAG 2.2** (sem limites de tempo forçados, reversibilidade garantida e vocabulário sem jargões).

---

## 2. Princípios de Desenho de Fluxo (Mobile-First & WCAG 2.2 AAA)

1. **Feedback Imediato para Cada Ação:**
   - Ao tocar em "Enviar ao relógio", o input de texto deve ser limpo imediatamente e uma mensagem de sucesso exibida logo abaixo.
   - Se o relógio não estiver conectado, o botão deve ficar visualmente inativo ou explicar o motivo em texto simples (ex: *"Nenhum relógio conectado no momento"*).
2. **Status de Conexão Transparente:**
   - O card de status de conectividade do relógio no topo da tela inicial deve sempre informar com clareza:
     - Relógio conectado (com o nome do dispositivo);
     - Nenhum relógio encontrado + ação clara de *"Procurar novamente"*;
     - Alerta de build de desenvolvimento caso esteja rodando no Expo Go.
3. **Prevenção de Erros Aprimorada e Reversibilidade (WCAG 2.2 Critério 3.3.6 - AAA):**
   - **Ações Reversíveis (Undo):** Ao excluir um lembrete ou exercício, forneça um mecanismo imediato de desfazer (Snackbar/Toast com ação de "Desfazer" visível por 5 a 10 segundos).
   - **Confirmação Explícita:** Se não for possível desfazer a ação, exiba um diálogo modal claro pedindo confirmação antes de efetivar a remoção.
   - Botão de envio desabilitado enquanto o campo de texto estiver vazio (`opacity: 0.4`), evitando envios de strings vazias.
4. **Sem Limite de Tempo Inflexível (WCAG 2.2 Critério 2.2.3 - AAA):**
   - Formulários, rascunhos e telas não devem conter contadores regressivos ou timeouts automáticos que descartem dados sem consentimento explícito do usuário.
   - Qualquer processo temporizado deve permitir que o usuário pause, estenda ou desligue o tempo limite.
5. **Ajuda Contextual e Rótulos Claros (WCAG 2.2 Critério 3.3.5 - AAA):**
   - Campos com formatos esperados (ex: horário de lembrete `HH:MM`) devem conter texto de auxílio ou máscara amigável.
   - Mensagens de erro devem apontar com precisão o que precisa ser corrigido e como corrigir.
6. **Vocabulário Amigável e Humano:**
   - Evite jargões técnicos na interface (em vez de *"Erro de timeout no Wearable Data Layer"*, use *"Não foi possível enviar ao relógio. Verifique se ele está ligado e próximo"*).
   - Use textos curtos e diretos, focados na ação do usuário.

---

## 3. Estrutura de Navegação por Abas (`(tabs)`)

A navegação principal do Lembri é estruturada em abas inferiores fixas através do Expo Router:

| Aba | Rota | Papel no Fluxo |
|---|---|---|
| **Início** | `(tabs)/index.tsx` | Visão geral, conexão com o relógio, criação rápida e lista recente de lembretes enviados |
| **Lembretes** | `(tabs)/lembretes.tsx` | Gestão completa de lembretes (histórico, filtros por pendente/concluído, agendamento) |
| **Exercícios** | `(tabs)/exercicios.tsx` | Rotinas e exercícios periódicos com dados mockados e progresso |
| **Configurações** | `(tabs)/configuracoes.tsx` | Ajustes do app, preferências de tema e configurações de pareamento Wear |

Cada tela conta com o `TopBar` superior informando o contexto atual e o `BottomBar` inferior permitindo alternância instantânea com apenas um toque e alvo mínimo de 56dp.
