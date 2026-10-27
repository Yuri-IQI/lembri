---
description: Planejar tarefa do projeto Lembri e gerar o SDD em HTML (docs/plans/<chave-tarefa>-<slug>.html) seguindo a skill principios
argument-hint: "[URL ou ID do cartão no Trello (ex: https://trello.com/c/q6Xyz123) ou descrição da funcionalidade]"
---

Carregue e aplique obrigatoriamente a skill canônica `.agents/skills/principios/SKILL.md` (e todas as suas referências em `.agents/skills/principios/references/`) e execute integralmente o fluxo da skill `.agents/skills/plano/SKILL.md`.

Planeje o fluxo mobile, telas no Expo Router, gerenciamento de itens com Zustand, dados mockados e acessibilidade mobile WCAG 2.2 AAA. Se houver qualquer dúvida, ambiguidade ou informação inconclusiva, aplique a Regra da Dúvida e pergunte ao usuário antes de gerar o arquivo HTML em `docs/plans/`.
Ao finalizar o preenchimento do plano SDD, abra o arquivo HTML gerado no navegador padrão (`Start-Process` no Windows).

Contexto / Argumentos da solicitação:
$ARGUMENTS
