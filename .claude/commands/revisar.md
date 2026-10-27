---
description: Revisar código da branch atual contra develop no projeto Lembri e gerar relatório HTML em docs/reviews/<chave-tarefa>-<slug>.html
argument-hint: "[nome da branch, chave da tarefa ou vazio para revisar a branch atual contra develop]"
---

Carregue e aplique a skill canônica `.agents/skills/principios/SKILL.md` (e suas referências) e execute integralmente a skill `.agents/skills/revisar/SKILL.md`.

Audite as camadas front-end, estado no Zustand, tokens de `theme.ts`, acessibilidade mobile WCAG 2.2 AAA (`TouchTarget = 56`), tipagem estrita TypeScript e gere o relatório visual em `docs/reviews/<chave-tarefa>-<slug>.html`.

Contexto / Argumentos da solicitação:
$ARGUMENTS
