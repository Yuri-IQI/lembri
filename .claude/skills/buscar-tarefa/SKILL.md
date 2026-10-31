---
name: buscar-tarefa
description: >
  Coleta e estrutura todos os dados de um cartão ou tarefa do Trello (via API
  REST v1 com docs/scripts/trello-fetch.mjs) ou do contexto local da branch
  para o projeto Lembri (React Native com Expo e Wearable). Use quando o usuário
  pedir para buscar, consultar ou listar cartões do Trello (/buscar-tarefa),
  informar uma URL ou ID de card (ex: https://trello.com/c/q6Xyz123 ou q6Xyz123)
  ou como etapa inicial das skills plano, implementar, revisar e testar.
argument-hint: "[URL ou ID do cartão no Trello, ex: https://trello.com/c/q6Xyz123 ou q6Xyz123]"
license: MIT
---

# Coletar Dados de Tarefa no Trello — Projeto Lembri

Sub-skill utilitária para buscar e estruturar todos os dados de um cartão (card) do **Trello** ou consolidar o contexto local da branch no **Projeto Lembri** (MobileAPP React Native Expo + Wear OS).

Pode ser invocada diretamente (`/buscar-tarefa`) ou chamada pelas skills `plano` (`.claude/skills/plano/SKILL.md`), `implementar` (`.claude/skills/implementar/SKILL.md`), `revisar` (`.claude/skills/revisar/SKILL.md`) e `testar` (`.claude/skills/testar/SKILL.md`).

---

## 1. Configuração e Segurança de Credenciais (`.credentials`)

Quando a consulta for realizada via **Trello REST API v1**, as credenciais nunca devem ser expostas na conversa, em relatórios, planos SDD ou commits. Elas residem no arquivo `.credentials` na raiz do repositório:

```ini
TRELLO_API_KEY="sua-chave-de-desenvolvedor"
TRELLO_TOKEN="seu-token-de-autorizacao"
TRELLO_BOARD_ID="id-ou-shortlink-do-quadro" # Opcional, para listar cartões do quadro
```

> **Como obter credenciais do Trello:**
> 1. Obtenha sua **API Key** em: `https://trello.com/power-ups/admin`
> 2. Gere seu **Token** pessoal com permissão de leitura através do link gerado na mesma página.

### Regras inegociáveis de segurança
- Nunca exiba o valor de `TRELLO_TOKEN` ou `TRELLO_API_KEY` na conversa.
- Caso o arquivo `.credentials` não esteja configurado, solicite ao desenvolvedor que cole o título, descrição e checklist do cartão diretamente na conversa.

---

## 2. Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- A URL completa do cartão no Trello (ex: `https://trello.com/c/q6Xyz123/10-criar-store-de-lembretes`);
- O identificador curto / shortLink (ex: `q6Xyz123`);
- O número do cartão no quadro (ex: `10`);
- `--mine`: para listar todos os cartões atribuídos ao usuário autenticado;
- `--list`: para listar os cartões presentes no quadro configurado;
- Vazio: a skill verifica a branch atual (`git branch --show-current`, ex: `feat/lembretes-zustand`) e consulta o desenvolvedor caso a referência do cartão não tenha sido informada.

---

## 3. Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Obedecer à Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** Esta skill opera sob subordinação direta a **`.claude/skills/principios/SKILL.md`**. Aplique a **Regra da Dúvida** (não assuma requisitos de tela ou fluxos quando houver ambiguidade no cartão).

---

### Passo 1 — Buscar o Cartão e Salvar o Contexto Local

1. Se uma URL ou ID foi informada, execute o script utilitário com a flag `--save`:
   ```bash
   node docs/scripts/trello-fetch.mjs https://trello.com/c/q6Xyz123 --save
   ```
2. O script exibirá o resumo formatado e salvará os metadados do cartão em `.tmp/task-<KEY>/issue.json`.
3. Verifique a branch Gitflow atual:
   ```bash
   git branch --show-current
   ```
   - Se estiver em `develop` ou `main`, utilize a sugestão de branch exibida pelo script (ex: `feat/criar-store-de-lembretes`) criada a partir de `develop` atualizada.

---

### Passo 2 — Estruturar o Resumo Executivo da Tarefa

Apresente um resumo claro com:
1. **Identificação:** Nome do Cartão, ID Curto e Lista/Coluna no Trello.
2. **Objetivo do Usuário:** O que a pessoa usuária fará no aplicativo mobile.
3. **Critérios de Aceite:** Itens extraídos dos checklists do cartão do Trello.
4. **Módulo Identificado:** (`LEMBRETES`, `EXERCICIOS`, `WEAR_CONNECTOR`, `CONFIGURACOES`, `STORES_MOCKS`).
5. **Próximo Passo Recomendado:**
   - Executar `/plano` (`.claude/skills/plano/SKILL.md`) para gerar o SDD front-end correspondente.
