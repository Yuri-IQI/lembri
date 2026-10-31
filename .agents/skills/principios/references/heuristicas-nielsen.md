# As 10 Heurísticas de Usabilidade de Nielsen — Aplicadas ao Projeto Lembri (Mobile & Acessibilidade)

Material de consulta e auditoria obrigatória da skill canônica `principios` e da skill operacional `revisar`.

Este documento estabelece a interpretação e a aplicação prática das **10 Heurísticas de Usabilidade de Jakob Nielsen** no contexto do aplicativo **Lembri** (React Native / Expo SDK 58, React 19, Wear OS Data Layer, dados mockados e padrão mandatória **WCAG 2.2 Nível AAA** para idosos e pessoas com declínio cognitivo ou restrições motoras).

---

## Sumário das 10 Heurísticas

1. [Visibilidade do Status do Sistema](#h1)
2. [Correspondência entre o Sistema e o Mundo Real](#h2)
3. [Controle e Liberdade do Usuário (Undo / Reversibilidade)](#h3)
4. [Consistência e Padrões](#h4)
5. [Prevenção de Erros](#h5)
6. [Reconhecimento em vez de Memorização](#h6)
7. [Flexibilidade e Eficiência de Uso](#h7)
8. [Design Estético e Minimalista](#h8)
9. [Ajudar os Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros](#h9)
10. [Ajuda e Documentação Contextual](#h10)

---

<h2 id="h1">1. Visibilidade do Status do Sistema (Visibility of System Status)</h2>

> **Princípio:** O sistema deve sempre manter os usuários informados sobre o que está acontecendo, fornecendo feedback apropriado em tempo hábil.

### Aplicação no Lembri:
- **Feedback Imediato de Ações:** Ao tocar em botões como "Adicionar lembrete", "Concluir" ou "Praticar Agora", o feedback visual ou tátil deve ser instantâneo (estados de opacidade com `pressed` no `Pressable`, transição imediata de status e limpeza do input).
- **Status de Conexão com o Relógio (Wear OS):** O card do relógio na tela inicial deve explicitar continuamente se há um relógio pareado e conectado (ex: `"Conectado: Pixel Watch"`), se está buscando (`"Procurando relógios..."`) ou se nenhum foi encontrado, acompanhado de botão acessível de recarregar.
- **Sincronização de Conclusão:** Quando um lembrete é concluído a partir do relógio inteligente, a tela do smartphone deve refletir o status imediatamente com a etiqueta `"Concluído no relógio ✓"`.
- **Estados Visuais de Carregamento:** Ações assíncronas devem exibir indicadores nativos sem bloquear a interface de forma opaca ou indefinida.

---

<h2 id="h2">2. Correspondência entre o Sistema e o Mundo Real (Match Between System and Real World)</h2>

> **Princípio:** O sistema deve falar a linguagem do usuário, usando palavras, frases e conceitos familiares, seguindo convenções do mundo real e ordenação lógica e natural.

### Aplicação no Lembri:
- **Vocabulário Humano e Natural (PT-BR):** Proibido exibir jargões técnicos para o usuário final, como "UUID", "payload", "timeout no Data Layer", "mock", "store Zustand". Usar termos cotidianos claros: `"Tomar remédio"`, `"Lavar roupas"`, `"Lembrete"`, `"Exercício"`, `"Próximos lembretes"`.
- **Metáforas e Ícones Reconhecíveis:** Ícones de casa para Casa, coração para Saúde, pasta para Trabalho, e fogo 🔥 para sequências de dias consecutivos (streak).
- **Formatação de Horários Realista:** Horários no padrão 24 horas brasileiro (`"08:00"`, `"14:30"`), nunca timestamps Unix brutos ou formatos estrangeiros confusos como AM/PM sem contexto.

---

<h2 id="h3">3. Controle e Liberdade do Usuário (User Control and Freedom / Undo)</h2>

> **Princípio:** Usuários frequentemente escolhem ações por engano e necessitam de uma "saída de emergência" claramente sinalizada para desfazer a ação indesejada sem passar por um diálogo extenso.

### Aplicação no Lembri:
- **Desfazer Exclusão Mandatório (Undo — WCAG 2.2 Critério 3.3.6):** Ao excluir um lembrete ou rotina, o item não é destruído imediatamente de forma irreversível; a store guarda `ultimoExcluido` e a interface exibe um card/toast de **"Desfazer"** imediatamente visível e acionável.
- **Reversibilidade de Conclusão:** Se o usuário marcar um item como concluído por engano, um botão com alvo de toque adequado permite alternar de volta (`"Reabrir"` / `"Marcar como pendente"`).
- **Restauração de Demonstração (`resetarParaMocks`):** O usuário ou avaliador pode restaurar as fixtures padrão de demonstração do Figma a qualquer momento se esvaziar a lista acidentalmente.
- **Navegação Livre:** Transições entre abas sem perda de dados digitados em campos não salvos.

---

<h2 id="h4">4. Consistência e Padrões (Consistency and Standards)</h2>

> **Princípio:** Os usuários não devem ter que se perguntar se diferentes palavras, situações ou ações significam a mesma coisa. Devem ser seguidas as convenções da plataforma e da indústria.

### Aplicação no Lembri:
- **Design System e Tokens Centralizados (`src/constants/theme.ts`):** Cores, tipografia (Inter), espaçamentos (`Spacing.one` a `Spacing.five`), raios (`Radius.sm` a `Radius.lg`) e alvos mínimos (`TouchTarget = 56`) rigorosamente consistentes em todas as telas e abas.
- **Padrão de Componentes Reutilizáveis:** Uso padronizado de `ThemedText`, `ThemedView`, `Card`, `MainContainer` e botões com mesma affordance.
- **Semântica de Cores Fixa:**
  - Preto/Cinza escuro para primário e títulos;
  - `#4E4E4E` para informações secundárias de apoio;
  - Cor do tema com contraste AAA (mínimo 7:1) em badges.

---

<h2 id="h5">5. Prevenção de Erros (Error Prevention)</h2>

> **Princípio:** Melhor do que boas mensagens de erro é um design cuidadoso que previne a ocorrência de erros em primeiro lugar.

### Aplicação no Lembri:
- **Desativação de Ações Inválidas:** O botão "Adicionar lembrete" permanece inativo com feedback visual atenuado (`opacity: 0.4`) e `disabled={!titulo.trim()}` enquanto o campo de texto estiver vazio, prevenindo registros em branco.
- **Alvos de Toque Confortáveis (`TouchTarget = 56` — 56×56dp):** Para pessoas idosas, mãos trêmulas ou uso em movimento, alvos grandes eliminam o erro de toque no elemento adjacente.
- **Espaçamento Adequado entre Itens:** Margens e gaps mínimos entre cartões e botões para evitar toques cruzados.
- **Desassociação Segura de Dados (RN-04):** Ao remover uma categoria/tipo de lembrete, os lembretes vinculados não são destruídos em cascata; apenas o `tipoId` é desassociado.

---

<h2 id="h6">6. Reconhecimento em vez de Memorização (Recognition Rather Than Recall)</h2>

> **Princípio:** Minimize a carga de memória do usuário tornando elementos, ações e opções visíveis. O usuário não deve ter que lembrar informações de uma parte da interface para outra.

### Aplicação no Lembri:
- **Visibilidade Direta dos Próximos Lembretes:** A tela inicial exibe os lembretes pendentes logo abaixo do card de criação, eliminando a necessidade de abrir outra aba para conferir a rotina imediata.
- **Chips de Filtro Explícitos:** A tela de lembretes exibe abas táteis (`Todos`, `Pendentes`, `Concluídos`) com destaque visual evidente do filtro ativo.
- **Badges Contextuais:** Badges de categoria (`Saúde`, `Casa`, etc.) e streak de exercícios (`🔥 5 dias`) deixam os atributos do item explícitos sem exigir que o usuário abra detalhes.
- **Placeholders Descritivos:** Inputs com exemplos práticos (ex: `"Ex.: Tomar remédio"`).

---

<h2 id="h7">7. Flexibilidade e Eficiência de Uso (Flexibility and Efficiency of Use)</h2>

> **Princípio:** O sistema deve acomodar tanto usuários inexperientes quanto experientes, permitindo atalhos e fluxos ágeis para tarefas frequentes.

### Aplicação no Lembri:
- **Fluxo Expresso na Home:** Campo de entrada com botão direto para cadastrar e enviar ao relógio em menos de 3 toques.
- **Teclado com Ação Direta:** Suporte a `onSubmitEditing={handleEnviar}` no teclado do smartphone para submissão imediata.
- **Ações Granulares:** Alternância de conclusão direta no card com um único toque, sem necessidade de navegar para uma tela de edição.
- **Atalhos no Wear OS:** Conclusão de lembretes direto no pulso via Wearable Data Layer API.

---

<h2 id="h8">8. Design Estético e Minimalista (Aesthetic and Minimalist Design)</h2>

> **Princípio:** As interfaces não devem conter informações irrelevantes ou raramente necessárias. Cada elemento adicional na tela compete com informações relevantes e diminui sua visibilidade.

### Aplicação no Lembri:
- **Diretriz de Limite Visual:** Máximo de 2 linhas para títulos e descrições nos cards de rotina para não poluir a tela.
- **Hierarquia Visual Nítida:** Tipografia Inter balanceada (`display`, `title`, `headline`, `subheading`, `default`, `small`, `label`), permitindo leitura rápida e escaneabilidade instantânea.
- **Espaço em Branco Respirável:** Uso generoso de espaçamento (`Spacing.three`, `Spacing.four`) separando blocos lógicos.
- **Ausência de Elementos Supérfluos (KISS & YAGNI):** Sem sombras pesadas, gradientes chamativos ou gráficos complexos que causem distração ou fadiga cognitiva.

---

<h2 id="h9">9. Ajudar os Usuários a Reconhecer, Diagnosticar e Recuperar-se de Erros (Help Users Recognize, Diagnose, and Recover from Errors)</h2>

> **Princípio:** Mensagens de erro devem ser expressas em linguagem clara (sem códigos brutos), apontar com precisão o problema e sugerir construtivamente uma solução.

### Aplicação no Lembri:
- **Mensagens Orientadas à Ação:**
  - Em vez de `"DataLayerException: Peer not reachable"`, exibir: `"Lembrete cadastrado, mas nenhum relógio conectado no momento."`
  - Em vez de `"ExpoGoNotSupportedException"`, exibir: `"Comunicação com relógio disponível apenas em um development build Android (não funciona no Expo Go)."`
- **Recuperação Assistida:** Quando a busca de relógios falha, exibir o botão `"Procurar novamente"` no próprio card.
- **Prevenção de Pânico:** Confirmações positivas e mensagens de erro calmas e objetivas.

---

<h2 id="h10">10. Ajuda e Documentação Contextual (Help and Documentation)</h2>

> **Princípio:** Embora seja melhor que o sistema possa ser usado sem documentação, pode ser necessário fornecer ajuda e instruções fáceis de encontrar, focadas na tarefa do usuário.

### Aplicação no Lembri:
- **Estados Vazios Educativos (Empty States):** Quando uma lista não possui itens (ex: sem lembretes pendentes ou catálogo vazio), o card vazio deve explicar a situação e oferecer um botão amigável (ex: `"Você está em dia com todas as suas atividades!"` ou botão `"Restaurar Exemplos"`).
- **Acessibilidade Semântica para Leitores de Tela:** Atributos `accessibilityLabel` e `accessibilityHint` fornecem áudio-descrição explicativa de ações (ex: `"Adicionar lembrete e sincronizar com o relógio"`, `"Filtrar por Concluídos"`).
- **Textos de Apoio Discretos:** Orientações curtas posicionadas abaixo de formulários e cabeçalhos.

---

## Checklist de Auditoria Heurística para Code Review

Durante a execução da skill `/revisar`, o revisor deve preencher a tabela de conformidade heurística:

| # | Heurística de Nielsen | Status | Verificação no Código / UI |
|---|---|---|---|
| 1 | **Status do Sistema** | 🟢 / 🟡 / 🔴 | Feedbacks visuais imediatos e status de conexão Wear OS visíveis |
| 2 | **Mundo Real** | 🟢 / 🟡 / 🔴 | Linguagem humana em PT-BR sem termos técnicos de código |
| 3 | **Controle & Undo** | 🟢 / 🟡 / 🔴 | Ações reversíveis, botão Desfazer e restauração de dados |
| 4 | **Consistência** | 🟢 / 🟡 / 🔴 | Aderência irrestrita a `theme.ts` e padrões de cards/botões |
| 5 | **Prevenção de Erros** | 🟢 / 🟡 / 🔴 | Validações inline, botões desabilitados quando vazios e alvos 56dp |
| 6 | **Reconhecimento** | 🟢 / 🟡 / 🔴 | Lembretes e filtros visíveis, sem sobrecarga de memória |
| 7 | **Flexibilidade** | 🟢 / 🟡 / 🔴 | Atalhos de conclusão rápida e sincronização ágil com o pulso |
| 8 | **Design Minimalista** | 🟢 / 🟡 / 🔴 | Telas limpas, máximo 2 linhas, sem ruído visual |
| 9 | **Diagnóstico de Erros** | 🟢 / 🟡 / 🔴 | Mensagens claras de orientação e recuperação |
| 10 | **Ajuda Contextual** | 🟢 / 🟡 / 🔴 | Estados vazios com ação e acessibilidade para TalkBack/VoiceOver |
