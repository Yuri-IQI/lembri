---
name: revisar
description: >
  Realiza a revisão automatizada de código e conformidade arquitetural da branch
  atual contra develop no projeto Lembri, auditando camadas front-end (Expo Router,
  UI Components, Zustand Stores, Mocks e Wear Connector), imutabilidade de estado,
  design tokens do theme.ts, acessibilidade WCAG 2.2 AAA (TouchTarget = 56dp, contraste 7:1) e
  gera o Relatório de Revisão autocontido em HTML em docs/reviews/<chave-tarefa>-<slug>.html
  a partir de docs/reviews/EXEMPLO_REVISAO.html. Use quando o usuário pedir /revisar
  ou solicitar code review da tarefa antes do Pull Request.
argument-hint: "[nome da branch, chave da issue ou vazio para revisar a branch atual contra develop]"
model: sonnet
effort: high
license: MIT
---

# Revisão Automatizada de Código Front-end — Projeto Lembri

Executa uma revisão técnica e funcional completa da branch atual contra a branch base **`develop`**, verificando a conformidade com a skill canônica **`.agents/skills/principios/SKILL.md`** e as diretrizes mobile de `docs/`, gerando o **Relatório de Revisão em HTML** em `docs/reviews/<chave-tarefa>-<slug>.html` seguindo o template `docs/reviews/EXEMPLO_REVISAO.html`.

> **Formato de saída da revisão: HTML autocontido em `docs/reviews/<chave-tarefa>-<slug>.html` + resumo executivo no terminal.**

A revisão avalia:
1. Aderência ao requisito e ao plano técnico SDD (`docs/plans/`);
2. Arquitetura front-end em camadas (`src/app/`, `src/components/`, `src/stores/`, `src/services/`, `src/mocks/`);
3. Gerenciamento de estado com **Zustand** (imutabilidade, seletores otimizados, ausência de re-renders infinitos);
4. Design Tokens: uso estrito de `src/constants/theme.ts` (sem cores hexadecimais ou espaçamentos mágicos hardcoded);
5. Acessibilidade Mobile (**WCAG 2.2 Nível AAA** com contraste 7:1, `TouchTarget = 56`, leitores de tela `accessibilityLabel` autônomos, reversibilidade de mutações e entrelinha >= 1.5);
6. Qualidade de código TypeScript (estrito, zero `any`, sem código comentado nem `console.log` de debug);
7. Pré-auditoria estática (`npx expo lint`, `npx tsc --noEmit` e `node docs/scripts/lembri-check.mjs`).

---

## Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- A chave da tarefa (ex: `LEMBRI-10`);
- O nome da branch da tarefa (ex: `feat/lembretes-zustand`);
- Vazio: revisa a branch atual (`git branch --show-current`) contra `develop`.

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** É terminantemente proibido emitir parecer de code review ou sugerir alterações sem antes ler e aplicar integralmente a skill canônica **`.agents/skills/principios/SKILL.md`** e seus documentos de referência.

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

### Passo 3 — Gerar o Relatório HTML de Revisão

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
6. **Apontamentos e Sugestões de Melhoria (em Diff)**

---

### Passo 4 — Exibir Relatório no Navegador e Apresentar Conclusão

Abra o relatório no navegador:
```powershell
Start-Process "docs\reviews\lembri-10-revisao-de-lembretes-com-zustand.html"
```
Apresente o resumo final ao usuário com a assinatura canônica de `principios`:
`[código/plano] → [princípio que guiou] · dúvidas: 1) ... 2) ...`
