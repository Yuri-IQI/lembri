---
name: revisar
description: >
  Realiza a revisão técnica e arquitetural da branch atual contra develop no projeto Lembri,
  auditando camadas front-end (Expo Router, UI, Zustand Stores, Mocks e Wear Connector),
  design tokens do theme.ts, acessibilidade WCAG 2.2 AAA (TouchTarget = 56dp, contraste 7:1)
  e auditoria mandatória das 10 Heurísticas de Usabilidade de Nielsen, gerando o Relatório
  de Revisão em HTML em docs/reviews/<chave-tarefa>-<slug>.html a partir de
  docs/reviews/EXEMPLO_REVISAO.html. Use quando o usuário pedir /revisar ou solicitar code review.
argument-hint: "[nome da branch, chave da issue ou vazio para revisar a branch atual contra develop]"
model: sonnet
effort: high
license: MIT
---

# Revisão Automatizada de Código Front-end — Projeto Lembri

Executa uma revisão técnica e funcional completa da branch atual contra a branch base **`develop`**, verificando a conformidade com a skill canônica **`.claude/skills/principios/SKILL.md`**, o checklist das **10 Heurísticas de Usabilidade de Nielsen** (`.claude/skills/principios/references/heuristicas-nielsen.md`) e as diretrizes mobile de `docs/`, gerando o **Relatório de Revisão em HTML** em `docs/reviews/<chave-tarefa>-<slug>.html` seguindo o template `docs/reviews/EXEMPLO_REVISAO.html`.

> **Formato de saída da revisão: HTML autocontido em `docs/reviews/<chave-tarefa>-<slug>.html` + resumo executivo no terminal.**

A revisão avalia:
1. Aderência ao requisito e ao plano técnico SDD (`docs/plans/`);
2. Arquitetura front-end em camadas (`src/app/`, `src/components/`, `src/stores/`, `src/services/`, `src/mocks/`);
3. Gerenciamento de estado com **Zustand** (imutabilidade, seletores otimizados, ausência de re-renders infinitos);
4. Design Tokens: uso estrito de `src/constants/theme.ts` (sem cores hexadecimais ou espaçamentos mágicos hardcoded);
5. Acessibilidade Mobile (**WCAG 2.2 Nível AAA** com contraste 7:1, `TouchTarget = 56`, leitores de tela `accessibilityLabel` autônomos, reversibilidade de mutações e entrelinha >= 1.5);
6. **Conformidade com as 10 Heurísticas de Usabilidade de Nielsen** (conforme `.claude/skills/principios/references/heuristicas-nielsen.md`);
7. Qualidade de código TypeScript (estrito, zero `any`, sem código comentado nem `console.log` de debug);
8. Pré-auditoria estática (`npx expo lint`, `npx tsc --noEmit` e `node docs/scripts/lembri-check.mjs`).

---

## Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- A chave da tarefa (ex: `LEMBRI-10` ou `21`);
- O nome da branch da tarefa (ex: `feat/lembretes-zustand`);
- Vazio: revisa a branch atual (`git branch --show-current`) contra `develop`.

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** É terminantemente proibido emitir parecer de code review ou sugerir alterações sem antes ler e aplicar integralmente a skill canônica **`.claude/skills/principios/SKILL.md`** e seus documentos de referência, em especial `references/heuristicas-nielsen.md` e `references/acessibilidade.md`.

---

### Passo 1 — Identificar Branch, Contexto e Diff

1. Verifique a branch ativa e colete o diff contra a branch base:
   ```bash
   git branch --show-current
   git diff --stat develop...HEAD
   ```
2. Identifique o plano SDD correspondente em `docs/plans/` para comparar os requisitos planejados com o código entregue.

---

### Passo 2 — Executar Ferramentas Automatizadas de QA

Execute a auditoria estática e o compilador:
```powershell
cd MobileAPP
npx expo lint
npx tsc --noEmit
cd ..
node docs/scripts/lembri-check.mjs
```
Anote todos os avisos ou erros reportados.

---

### Passo 3 — Auditoria Obrigatória das 10 Heurísticas de Nielsen (Passo Essencial)

> **PASSO ESSENCIAL E INDISPENSÁVEL:** Avalie rigorosamente a experiência do usuário, as telas e os fluxos afetados pelo diff contra as **10 Heurísticas de Usabilidade de Nielsen**, conforme detalhado em **`.claude/skills/principios/references/heuristicas-nielsen.md`**:
> 1. **Visibilidade do status do sistema:** Feedbacks visuais imediatos em toques e status de conexão Wear OS visíveis;
> 2. **Correspondência com o mundo real:** Linguagem humana em PT-BR sem termos técnicos de código ou Bluetooth;
> 3. **Controle e liberdade do usuário (Undo):** Ações destrutivas com reversibilidade obrigatória (WCAG 3.3.6);
> 4. **Consistência e padrões:** Aderência irrestrita a `theme.ts` e affordances dos componentes do Lembri;
> 5. **Prevenção de erros:** Botões desabilitados quando inputs vazios e alvos de toque `TouchTarget = 56`;
> 6. **Reconhecimento em vez de memorização:** Dados e filtros ativos visíveis sem sobrecarga cognitiva;
> 7. **Flexibilidade e eficiência de uso:** Atalhos de adição rápida e sincronização instantânea com o relógio;
> 8. **Design estético e minimalista:** Máximo 2 linhas por card, zero poluição visual e ruídos desnecessários;
> 9. **Diagnóstico e recuperação de erros:** Mensagens claras orientadas à ação sem códigos de erro crípticos;
> 10. **Ajuda e documentação contextual:** Estados vazios acolhedores com botão de ação e suporte completo a TalkBack/VoiceOver.

---

### Passo 4 — Gerar o Relatório HTML de Revisão

Execute o gerador de esqueleto oficial para revisões:
```bash
node docs/scripts/gerar-esqueleto.mjs revisao LEMBRI-10 --titulo "Revisão de Lembretes com Zustand"
```
Preencha as seções no arquivo HTML gerado em `docs/reviews/<chave>-<slug>.html`:
1. **Resumo da Revisão e Parecer Geral** (`APROVADO`, `APROVADO COM RESSALVAS` ou `REPROVADO`)
2. **Conformidade com os Princípios de Desenvolvimento**
3. **Auditoria de Arquitetura e Camadas Front-end**
4. **Auditoria de Estado Zustand e Mocks**
5. **Auditoria de Acessibilidade Mobile (WCAG 2.2 Nível AAA / TouchTarget = 56 / Contraste 7:1)**
6. **Auditoria das 10 Heurísticas de Usabilidade de Nielsen (Tabela Heurística Completa)**
7. **Apontamentos e Sugestões de Melhoria (em Diff)**

---

### Passo 5 — Exibir Relatório no Navegador e Apresentar Conclusão

Abra o relatório no navegador:
```powershell
Start-Process "docs\reviews\lembri-10-revisao-de-lembretes-com-zustand.html"
```
Apresente o resumo final ao usuário com a assinatura canônica de `principios`:
`[código/plano] → [princípio que guiou] · dúvidas: 1) ... 2) ...`
