---
name: implementar
description: >
  Implementa passo a passo um Plano Técnico de Implementação (SDD) localizado
  em docs/plans/<chave-tarefa>-<slug>.html no aplicativo Lembri, obedecendo
  integralmente à skill canônica principios (Regra da Dúvida, DRY, SOLID, KISS,
  YAGNI, Clean Code, TSDoc, padrões front-end, React Native / Expo, Zustand,
  dados mockados e WCAG 2.2 AAA). Use quando o usuário pedir /implementar ou
  solicitar a codificação de um plano técnico já elaborado.
argument-hint: "[caminho do SDD em docs/plans/<arquivo>.html, chave da tarefa (ex: LEMBRI-10) ou vazio para a tarefa atual]"
license: MIT
---

# Implementar Plano Técnico (SDD) Front-end — Projeto Lembri

Lê um **Plano Técnico de Implementação (SDD)** aprovado em `docs/plans/<chave-tarefa>-<slug>.html` e executa a codificação completa em camadas front-end (`Types` → `Mocks & Fixtures` → `Zustand Stores` → `Hooks / Services` → `UI Components` → `Expo Router Screens` → `Testes`), garantindo conformidade estrita com a skill canônica **`principios`**.

---

## Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- O caminho ou nome do arquivo SDD (ex: `docs/plans/lembri-10-controle-de-itens-com-zustand.html`);
- A chave da tarefa (ex: `LEMBRI-10`);
- Vazio: localiza automaticamente o SDD correspondente à branch atual em `docs/plans/`.

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** É terminantemente proibido escrever ou alterar qualquer linha de código sem antes carregar e aplicar integralmente a skill canônica **`.claude/skills/principios/SKILL.md`** e seus documentos de referência.

1. **Leitura obrigatória imediata:**
   - `.claude/skills/principios/SKILL.md` (Regra da Dúvida, Teste do *"provavelmente"*, ordem de precedência dos 9 princípios e formato de saída);
   - `.claude/skills/principios/references/camadas.md` e `.claude/skills/principios/references/escopo-impacto.md`;
   - `docs/manuais/padroes-projeto.md` (Zustand Store Pattern, Mock Repositories, Custom Hooks e Compound Components);
   - `docs/manuais/padroes-frontend.md` e `docs/manuais/padroes-docblocks.md`.
2. **Leitura condicional obrigatória conforme o escopo do SDD:**
   - Se envolver telas React Native, navegação ou componentes: leia `.claude/skills/principios/references/ui-componentes.md`, `.claude/skills/principios/references/ux-fluxo.md` e `.claude/skills/principios/references/acessibilidade.md`;
   - Se envolver estado, coleções de itens ou mocks: leia `.claude/skills/principios/references/dados.md` e `.claude/skills/principios/references/consultas.md`.
3. **Ordem de precedência inegociável:**
   `1. Padrões do projeto` → `2. Escopo de impacto` → `3. Compatibilidade de contratos` → `4. Idempotência e imutabilidade` → `5. YAGNI` → `6. DRY` → `7. SOLID` → `8. KISS` → `9. Clean Code`.

---

### Passo 1 — Localizar o Plano SDD e Preparar a Branch Gitflow

1. Identifique o arquivo do plano em `docs/plans/<chave-tarefa>-<slug>.html`.
   - Caso não exista um SDD para a tarefa solicitada, **interrompa** e pergunte ao usuário se deseja gerar o plano primeiro via `/plano`.
2. Leia integralmente todas as seções do SDD.
3. Verifique a branch ativa e o estado do repositório:
   ```bash
   git branch --show-current
   git status --short
   ```
   - Caso esteja em `develop` ou `main`, crie/troque para a branch da tarefa conforme o Gitflow (`feat/<nome-da-tarefa>` ou `fix/<nome-da-tarefa>`) a partir de `develop` atualizada.

---

### Passo 2 — Implementar em Camadas Front-end (De Dentro para Fora)

Implemente a solução respeitando a sequência estrita de camadas:

#### 1. Tipos e Contratos (`MobileAPP/src/types/`)
- Crie ou atualize interfaces com tipagem estrita TypeScript (zero `any`).

#### 2. Mocks e Fixtures (`MobileAPP/src/mocks/`)
- Crie ou atualize os dados mockados iniciais e geradores de mock, cobrindo cenários com dados, listas vazias e casos extremos.

#### 3. Stores do Zustand (`MobileAPP/src/stores/`)
- Implemente a store com estado imutável, ações claras e seletores otimizados (atômicos ou via `useShallow`).
- Adicione ação de reset para mocks (`resetarParaMocks`).

#### 4. Custom Hooks & Serviços (`MobileAPP/src/hooks/` e `MobileAPP/src/services/`)
- Encapsule consumo da store e lógica de comunicação com o relógio Wear OS se necessário.

#### 5. Componentes Visuais Reutilizáveis (`MobileAPP/src/components/`)
- Construa componentes com `ThemedText`, `Card`, estilos via `StyleSheet` usando tokens de `theme.ts`.
- Garanta conformidade estrita com **WCAG 2.2 Nível AAA**: contraste mínimo de 7:1 para texto normal, alvos de toque de no mínimo **56dp** (`TouchTarget`), alinhamento à esquerda, entrelinha >= 1.5 e rótulos de acessibilidade descritivos autônomos.

#### 6. Telas e Rotas no Expo Router (`MobileAPP/src/app/`)
- Integre as telas em `src/app/` com os hooks/stores criados, tratando os 5 estados visuais (Ideal, Carregando, Vazio, Erro, Parcial).

---

### Passo 3 — Validação Estática e Qualidade de Código

Execute a validação estática no diretório `MobileAPP`:
```powershell
cd MobileAPP
npx expo lint
npx tsc --noEmit
cd ..
node docs/scripts/lembri-check.mjs
```
Corrija imediatamente qualquer erro de tipagem ou linter apontado.

---

### Passo 4 — Entregar e Concluir

Apresente as alterações realizadas com clareza e encerre com a assinatura oficial de `principios`:
`[código/plano] → [princípio que guiou] · dúvidas: 1) ... 2) ...`
