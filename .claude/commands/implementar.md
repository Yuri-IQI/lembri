---
description: Implementar o Plano Técnico (SDD em docs/plans/<chave-tarefa>-<slug>.html) seguindo rigorosamente a skill principios
argument-hint: "[caminho do SDD em docs/plans/<arquivo>.html, chave da tarefa (ex: LEMBRI-10) ou vazio para a tarefa atual]"
---

Carregue e aplique obrigatoriamente a skill canônica `.agents/skills/principios/SKILL.md` (e todas as suas referências em `.agents/skills/principios/references/`) e execute integralmente o fluxo da skill `.agents/skills/implementar/SKILL.md`.

Implemente em camadas front-end: Types → Mocks → Zustand Stores → Hooks/Services → UI Components → Expo Router Screens. Se encontrar qualquer divergência ou ambiguidade, aplique a Regra da Dúvida e pergunte ao usuário antes de improvisar.

Contexto / Argumentos da solicitação:
$ARGUMENTS
