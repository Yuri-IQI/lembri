# Diretrizes para Agentes de IA — Projeto Lembri (MobileAPP & Wearable)

Este repositório contém o código do **Lembri**, uma solução mobile focada em **React Native (Expo)** com sincronização para relógio inteligente (**Wear OS** via Wearable Data Layer API).

O projeto é **focado no front-end** (`MobileAPP`), utilizando **Zustand** para gerenciamento de estado dos itens (lembretes, exercícios, tarefas, configurações), uma **camada de dados majoritariamente mockada** com contratos bem definidos e desacoplados, e padrão de acessibilidade mandatória **WCAG 2.2 Nível AAA**.

Todo agente de IA (Antigravity, Gemini, Claude, Codex, Copilot, Cursor, etc.) que atuar neste projeto deve seguir rigorosamente as diretrizes abaixo.

---

## 1. Skill Canônica de Desenvolvimento: `principios`

A fonte oficial e mandatória de princípios de arquitetura, engenharia front-end e processo deste projeto está localizada em:

👉 **[`.agents/skills/principios/SKILL.md`](.agents/skills/principios/SKILL.md)**

Antes de planejar, codificar, refatorar, corrigir defeitos ou revisar código, consulte e aplique a skill e seus documentos de referência:
- [Acessibilidade Mobile (WCAG 2.2 Nível AAA)](.agents/skills/principios/references/acessibilidade.md)
- [Camadas e Arquitetura Front-end (Expo + Zustand + Mocks)](.agents/skills/principios/references/camadas.md)
- [Consultas, Seletores e Filtragem de Dados Mockados](.agents/skills/principios/references/consultas.md)
- [Modelagem de Dados e Estado no Zustand](.agents/skills/principios/references/dados.md)
- [Escopo de Impacto e Decisões Front-end](.agents/skills/principios/references/escopo-impacto.md)
- [Planejamento de Tarefas e SDD Front-end](.agents/skills/principios/references/planejamento.md)
- [UI e Componentes em React Native (React 19 + Expo)](.agents/skills/principios/references/ui-componentes.md)
- [UX e Fluxos Operacionais Mobile (Lembri + Wear OS)](.agents/skills/principios/references/ux-fluxo.md)
- [As 10 Heurísticas de Usabilidade de Nielsen (Mobile & Acessibilidade)](.agents/skills/principios/references/heuristicas-nielsen.md)

### Skills Operacionais do Fluxo SDD (`.agents/skills/`)
> **Regra de Subordinação Obrigatória:** Ao executar qualquer uma das skills abaixo, o agente é **obrigado** a carregar e obedecer integralmente à skill canônica **[`principios`](.agents/skills/principios/SKILL.md)** e às suas referências (`Passo 0` bloqueante).

- **[`buscar-tarefa`](.agents/skills/buscar-tarefa/SKILL.md)** (`/buscar-tarefa`): Coleta dados do cartão ou tarefa no Trello (via `docs/scripts/trello-fetch.mjs` ou contexto local) e estrutura o contexto Gitflow da branch (`develop` como base).
- **[`plano`](.agents/skills/plano/SKILL.md)** (`/plano`): Planeja a tarefa aplicando a Regra da Dúvida e gera o SDD front-end em `docs/plans/<chave-tarefa>-<slug>.html` a partir de `docs/plans/EXEMPLO_PLANO.html`.
- **[`implementar`](.agents/skills/implementar/SKILL.md)** (`/implementar`): Implementa o plano SDD passo a passo em camadas (Types → Mocks → Zustand Stores → Hooks → UI Components & Screens).
- **[`testar`](.agents/skills/testar/SKILL.md)** (`/testar`): Executa a bateria de testes de componentes, stores Zustand, responsividade mobile, navegação no emulador/dispositivo e acessibilidade WCAG 2.2 AAA.
- **[`revisar`](.agents/skills/revisar/SKILL.md)** (`/revisar`): Realiza a revisão automatizada do diff da branch da tarefa contra `develop` validando camadas mobile, tipagem TypeScript estrita, Zustand, WCAG 2.2 AAA e gera o relatório visual em `docs/reviews/<chave-tarefa>-<slug>.html`.
- **[`documentar-modulo`](.agents/skills/documentar-modulo/SKILL.md)** (`/documentar-modulo`): Gera ou atualiza a documentação HTML de um módulo mobile em `docs/modulos/<MODULO>.html`.

### Scripts Utilitários de Automação e Economia de Tokens (`docs/scripts/`)
- **[`trello-fetch.mjs`](docs/scripts/trello-fetch.mjs)**: Coleta cartões, descrições e checklists de aceite do Trello (`node docs/scripts/trello-fetch.mjs <URL_OU_ID> --save` ou `--mine`).
- **[`mapa-codigo.mjs`](docs/scripts/mapa-codigo.mjs)**: Gera snapshot em Markdown das rotas Expo Router, componentes, stores Zustand e mocks de `MobileAPP` (`node docs/scripts/mapa-codigo.mjs`).
- **[`gerar-esqueleto.mjs`](docs/scripts/gerar-esqueleto.mjs)**: Cria o esqueleto HTML pré-preenchido com CSS e seções fixas para SDD (`node docs/scripts/gerar-esqueleto.mjs plano CARD-10`), Revisão (`node docs/scripts/gerar-esqueleto.mjs revisao CARD-10`) ou Módulo (`node docs/scripts/gerar-esqueleto.mjs modulo LEMBRETES`).
- **[`lembri-check.mjs`](docs/scripts/lembri-check.mjs)**: Executa pré-auditoria estática (TypeScript `tsc`, ESLint, convenção de stores Zustand, tokens de `theme.ts`, alvos de toque WCAG e boas práticas React Native).

---

## 2. A Regra Inegociável da Dúvida

- **É terminantemente proibido assumir premissas.**
- Toda dúvida, divergência entre o pedido e a base de código, ou informação inconclusiva deve ser interrompida e perguntada diretamente ao usuário antes de virar código ou plano.
- *Teste do Provavelmente:* Frases como *"provavelmente"*, *"imagino que"*, *"deve ser"* indicam premissa não confirmada. Transforme-as em perguntas objetivas com a sua recomendação técnica.

---

## 3. Stack Tecnológica e Arquitetura Front-end

### MobileAPP (React Native & Expo)
- **Framework & Runtime:** Expo SDK ~58, React Native 0.88, React 19.3.0, TypeScript ~6.0.
- **Roteamento:** **Expo Router** baseado em arquivos dentro de `MobileAPP/src/app/` (`(tabs)`, `_layout.tsx`). Use `Link`, `router` e `useLocalSearchParams` do `expo-router`.
- **Gerenciamento de Estado:** **Zustand** para controle reativo dos itens, coleções, filtros e estados de UI compartilhados (localizado em `MobileAPP/src/stores/`).
  - Mantenha stores focadas por domínio (`useLembretesStore`, `useExerciciosStore`, `useSettingsStore`).
  - Use seletores atômicos ou `useShallow` para evitar re-renderizações desnecessárias.
  - Ações devem ser imutáveis e autoexplicativas.
- **Camada de Dados Mockada:**
  - O projeto é **focado no front-end** com dados majoritariamente mockados em `MobileAPP/src/mocks/` e serviços/repositórios mockados em `MobileAPP/src/services/`.
  - Simulações de latência assíncrona (Promise com timeout) opcionais para validar estados de loading.
  - Contratos tipados em `MobileAPP/src/types/` facilitando transição futura para APIs reais ou persistência local via AsyncStorage.
- **Design System & Tokens:**
  - Centralizado em `MobileAPP/src/constants/theme.ts`:
    - Cores (`Colors`), Tipografia (`FontFamily = 'Inter'`), Espaçamentos (`Spacing`), Raios (`Radius`), Bordas (`BorderWidth`) e `TouchTarget = 56`.
  - Estilização nativa via `StyleSheet.create`. Proibido hardcoded colors fora de `theme.ts`.
- **Acessibilidade Mobile Mandatória (WCAG 2.2 Nível AAA):**
  - **Contraste Aprimorado (Critério 1.4.6):** Relação de contraste mínima de **7:1** para texto normal e **4.5:1** para texto grande.
  - **Tamanho do Alvo de Toque Aprimorado (Critério 2.5.5):** Mínimo de **44x44dp** com recomendação padrão do projeto `TouchTarget = 56` (`56x56dp`).
  - **Sem Limite de Tempo Inflexível (Critério 2.2.3):** Nenhuma ação ou sessão expira sem opção de desativação ou extensão total.
  - **Prevenção de Erros Aprimorada (Critério 3.3.6):** Ações de exclusão e mutação de itens devem ser confirmadas ou possuir ação imediata de desfazer (*Undo*).
  - **Leitores de Tela Ativos:** Propriedades semânticas completas (`accessibilityRole`, `accessibilityLabel`, `accessibilityHint`, `accessibilityState`).
- **Comunicação com Relógio (Wear OS):**
  - Módulo nativo Expo `modules/wear-connector` integrando com o Google Play Services Wearable Data Layer API.
  - Orquestrado via `useWear` hook e `wear-service.ts`.

### Comandos Essenciais do MobileAPP
```bash
cd MobileAPP
npx expo start              # Inicia o servidor Metro
npx expo run:android        # Compila e roda no emulador/dispositivo Android
npx expo lint               # Executa linter
npx tsc --noEmit            # Checagem estrita de tipos TypeScript
npx expo install <package>  # SEMPRE use em vez de npm install para garantir compatibilidade com o Expo SDK
```

---

## 4. Fluxo Git (Gitflow) e Commits

- **Branches Principais:**
  - `main`: Versões estáveis e entregas validadas.
  - `develop`: Integração das funcionalidades em desenvolvimento.
- **Branches de Trabalho (criadas a partir de `develop`):**
  - `feat/<nome-da-tarefa>`: Nova funcionalidade (ex: `feat/lembretes-zustand`, `feat/filtro-exercicios`).
  - `fix/<nome-da-tarefa>`: Correção de defeito (ex: `fix/wear-reconnect-sync`).
  - `hotfix/<nome-da-tarefa>`: Correção urgente em produção.
  - `release/<versao>`: Preparação de release.
  - Fluxo: atualizar `develop` (`git switch develop && git pull origin develop`) → criar branch da tarefa (`git switch -c feat/<nome-da-tarefa>`) → implementar e testar → abrir **Pull Request para `develop`**.
- **Commits:** Padrão Conventional Commits (`tipo(escopo): descrição curta`):
  - `feat(lembretes): implementar store zustand para criacao de lembretes`
  - `feat(exercicios): adicionar lista com dados mockados e seletores`
  - `fix(wear): tratar reconexao com relogio em background`
  - `style(theme): garantir contraste de cores conforme wcag 2.2 aaa`
