---
name: plano
description: >
  Planeja uma tarefa do aplicativo Lembri (React Native com Expo, Zustand e dados mockados)
  aplicando a skill canônica principios e a Regra da Dúvida, e gera o Plano Técnico
  de Implementação (SDD) autocontido em HTML em docs/plans/<chave-tarefa>-<slug>.html
  a partir de docs/plans/EXEMPLO_PLANO.html. Use quando o usuário pedir /plano,
  solicitar o planejamento técnico/SDD de um cartão do Trello, tela, componente,
  store ou funcionalidade no Lembri.
argument-hint: "[URL ou ID do cartão no Trello (ex: https://trello.com/c/q6Xyz123) ou descrição da funcionalidade]"
model: opus
effort: high
license: MIT
---

# Planejar Tarefa e Gerar SDD Front-end — Projeto Lembri

Coleta o contexto de uma tarefa (via Trello / `.agents/skills/buscar-tarefa/SKILL.md` ou descrição direta do desenvolvedor), carrega obrigatoriamente a skill canônica **`.agents/skills/principios/SKILL.md`** e o guia **`.agents/skills/principios/references/planejamento.md`**, resolve **todas as dúvidas e ambiguidades antes de decidir** e gera o Plano Técnico de Implementação (SDD) em `docs/plans/<chave-tarefa>-<slug>.html` seguindo o template oficial `docs/plans/EXEMPLO_PLANO.html`.

> **Formato de saída do plano: exclusivamente HTML (`docs/plans/<chave-tarefa>-<slug>.html`).** Não gere arquivos `.md` dentro de `docs/plans/`.

---

## Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- A URL ou ID do cartão no Trello (ex: `https://trello.com/c/q6Xyz123` ou `q6Xyz123`);
- A descrição direta da tela, funcionalidade, store ou correção desejada no app mobile.

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** É terminantemente proibido iniciar a análise ou gerar qualquer linha do plano sem antes ler e ativar integralmente a skill canônica **`.agents/skills/principios/SKILL.md`**.

1. **Leitura obrigatória imediata:**
   - `.agents/skills/principios/SKILL.md` (Regra da Dúvida, Teste do *"provavelmente"*, ordem de precedência dos 9 princípios e formato de saída);
   - `.agents/skills/principios/references/planejamento.md` (guia canônico de planejamento front-end);
   - `.agents/skills/principios/references/camadas.md` e `.agents/skills/principios/references/escopo-impacto.md`;
   - `docs/manuais/padroes-projeto.md` (padrões front-end: Zustand Store, Mock Repository, Custom Hooks e Compound Components).
2. **Leitura condicional obrigatória conforme o escopo:**
   - Se envolver telas React Native, formulários, animações ou navegação Expo Router: leia `.agents/skills/principios/references/ux-fluxo.md`, `.agents/skills/principios/references/ui-componentes.md` e `.agents/skills/principios/references/acessibilidade.md`;
   - Se envolver estado, coleções de itens ou mocks: leia `.agents/skills/principios/references/dados.md` e `.agents/skills/principios/references/consultas.md`.
3. **Subordinação estrita:** Todas as decisões deste plano devem respeitar a ordem de precedência de `principios/SKILL.md` (`1. Padrões do projeto` → `2. Escopo de impacto` → `3. Compatibilidade de contratos` → `4. Idempotência e imutabilidade` → `5. YAGNI` → `6. DRY` → `7. SOLID` → `8. KISS` → `9. Clean Code`) e encerrar a resposta com a assinatura `[código/plano] → [princípio que guiou] · dúvidas: ...`.

---

### Passo 1 — Coletar Dados do Cartão e Identificar a Branch Gitflow

1. Se `$ARGUMENTS` contiver uma URL ou ID do Trello, busque o contexto da tarefa via script utilitário:
   ```bash
   node docs/scripts/trello-fetch.mjs https://trello.com/c/q6Xyz123 --save
   ```
2. Verifique a branch atual (`git branch --show-current`) e determine a branch da tarefa (a partir de `develop` atualizada, ex: `feat/lembretes-zustand`).

---

### Passo 2 — Gerar o Esqueleto HTML do SDD

Execute o gerador de esqueleto oficial do projeto:
```bash
node docs/scripts/gerar-esqueleto.mjs plano CARD-10 --titulo "Controle de Itens com Zustand"
```
O esqueleto cria o arquivo em `docs/plans/<chave>-<slug>.html` com o CSS, cabeçalho e seções padronizadas.

---

### Passo 3 — Aplicar a Regra da Dúvida Antes de Preencher

Verifique se restou qualquer dúvida sobre:
- Fluxo de tela, campos obrigatórios ou validação de formulários;
- Estrutura da store Zustand (ações, persistência, seletores);
- Cenários de dados mockados a cobrir;
- Comunicação com o relógio Wear OS (caso o item trafegue para o relógio).

Se houver dúvida, **interrompa e pergunte ao usuário com sua recomendação técnica**. Não assuma em silêncio.

---

### Passo 4 — Preencher as Seções Técnicas do Plano

Preencha as seções no arquivo HTML gerado:
1. **Objetivo e Escopo Front-end**
2. **Requisitos e Regras de Negócio (Casos de Borda e Checklists do Trello)**
3. **Navegação no Expo Router e Telas** (`MobileAPP/src/app/`)
4. **Gerenciamento de Estado no Zustand** (`MobileAPP/src/stores/`)
5. **Camada de Dados Mockados e Fixtures** (`MobileAPP/src/mocks/` e `services/`)
6. **Componentes UI e Design Tokens** (`MobileAPP/src/components/`, `theme.ts`)
7. **Acessibilidade Mobile WCAG 2.2 Nível AAA** (`TouchTarget = 56`, leitores de tela)
8. **Integração com Wear OS (se aplicável)** (`contrato.ts`, `wear-service.ts`)
9. **Plano de Testes** (stores Zustand, testes manuais no emulador)
10. **Checklist Pré-PR**

---

### Passo 5 — Entregar e Abrir o Plano no Navegador

Abra o arquivo HTML gerado no navegador para conferência visual:
```powershell
Start-Process "docs\plans\card-10-controle-de-itens-com-zustand.html"
```
Apresente o resumo ao desenvolvedor com a assinatura canônica de `principios`.
