---
description: Buscar e consolidar contexto de um cartão do Trello ou branch local no projeto Lembri
argument-hint: "[URL ou ID do cartão no Trello (ex: https://trello.com/c/q6Xyz123) ou vazio para ler a branch atual]"
---

Carregue e aplique a skill canônica `.agents/skills/principios/SKILL.md` e execute o fluxo utilitário da skill `.agents/skills/buscar-tarefa/SKILL.md`.

Se houver credenciais configuradas em `.credentials`, utilize `node docs/scripts/trello-fetch.mjs $ARGUMENTS --save`. Caso contrário, pergunte ao usuário ou leia o contexto local da branch ativa (`develop` como base).

Contexto / Argumentos da solicitação:
$ARGUMENTS
