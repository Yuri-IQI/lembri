# Planejamento de Tarefas e Funcionalidades — Aplicativo Lembri

Lido pela skill `principios` quando invocada para planejar uma tarefa (`/principios planejar`, `/plano` ou pedido explícito de planejar uma tela, funcionalidade ou refatoração no Lembri).

Quando a `principios` for invocada para **planejar**, ela estabelece os princípios técnicos deste arquivo e orienta a elaboração do Plano Técnico de Implementação (SDD) front-end em conformidade com o processo do projeto e os padrões mandatórios de **Acessibilidade WCAG 2.2 Nível AAA**.

---

## O Fluxo de Trabalho do Projeto (Gitflow)

1. **Branches Principais:**
   - `main`: Versões estáveis e entregas validadas.
   - `develop`: Integração das funcionalidades em desenvolvimento.
2. **Branches de Trabalho (por tarefa, criadas a partir de `develop`):**
   - `feat/<nome-da-tarefa>`: Nova funcionalidade (ex: `feat/lembretes-zustand`, `feat/filtro-exercicios`).
   - `fix/<nome-da-tarefa>`: Correção de defeito (ex: `fix/wear-reconnect`).
   - `hotfix/<nome-da-tarefa>`: Correção urgente em produção.
   - `release/<versao>`: Preparação de release.
3. **Padrão de Commits (Conventional Commits):**
   - Formato: `tipo(escopo): descrição curta`
   - Tipos: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`.
   - Exemplos:
     - `feat(lembretes): criar store zustand para controle de lembretes (CARD-10)`
     - `feat(exercicios): adicionar tela com dados mockados e seletores`
     - `fix(wear): ajustar sincronizacao de confirmacao do relogio`
     - `style(theme): atualizar cores para garantir contraste wcag 2.2 aaa`
4. **Estrutura do Pull Request (`<branch-da-tarefa>` → `develop`):**
   - Título claro e objetivo;
   - Descrição da funcionalidade e capturas de tela/gravação de tela no emulador;
   - Passo a passo detalhado de teste manual no Expo;
   - Verificação dos critérios de acessibilidade de **Nível AAA** e checklist de qualidade.

---

## Estrutura Obrigatória do Plano Técnico Front-end (SDD)

Todo plano de implementação no Lembri deve cobrir os seguintes tópicos:

### 1. Objetivo e Escopo Front-end
- O que a pessoa usuária passa a conseguir fazer no aplicativo celular (e/ou relógio).
- O que entra no escopo e o que fica explicitamente fora dele (YAGNI).

### 2. Fluxo de Telas e Navegação (Expo Router)
- Identificação das rotas afetadas ou criadas em `MobileAPP/src/app/` (ex: `(tabs)/lembretes.tsx`, `(tabs)/exercicios.tsx`, modais).
- Transições de tela, parâmetros de rota via `useLocalSearchParams` e navegação via `router.push`/`router.replace`.

### 3. Modelagem de Dados e Tipos TypeScript (`src/types/`)
- Interfaces das entidades com tipagem estrita (sem `any`).
- Definição de campos obrigatórios, opcionais e status literais (`'pendente' | 'concluido'`).

### 4. Gerenciamento de Estado no Zustand (`src/stores/`)
- Definição da store necessária (ou extensão de store existente).
- Estrutura do estado (`items`, `filtro`, `isLoading`, `erro`).
- Ações imutáveis bem definidas (`adicionar`, `remover`, `toggle`, `filtrar`).
- Seletores otimizados (atômicos ou via `useShallow`) para evitar re-renderizações desnecessárias.

### 5. Camada de Dados Mockados (`src/mocks/`)
- Fixtures iniciais a serem criadas ou expandidas.
- Cenários de borda incluídos no mock (lista vazia, títulos longos, itens pendentes e concluídos).
- Simulação de latência assíncrona (se houver loading simulado).

### 6. Componentes e Estilização Mobile (`src/components/`)
- Componentes base reutilizados (`ThemedText`, `Card`, `MainContainer`, `TopBar`, `BottomBar`).
- Novos componentes necessários e sua decomposição hierárquica.
- Uso de tokens de `theme.ts` (`Colors`, `Spacing`, `Radius`, `BorderWidth`, `TouchTarget = 56`).
- Tratamento dos **5 Estados Visuais**:
  1. *Ideal:* Lista de itens renderizada com sucesso;
  2. *Carregando (Loading):* `ActivityIndicator` ou skeleton nativo;
  3. *Vazio (Empty State):* Mensagem amigável via `ListEmptyComponent` com ação sugerida;
  4. *Erro:* Feedback textual claro com opção de tentar novamente;
  5. *Parcial:* Indicação clara quando um lembrete foi salvo localmente mas falhou ao enviar para o relógio.

### 7. Acessibilidade Mobile Mandatória (WCAG 2.2 Nível AAA)
- **Contraste Aprimorado (1.4.6):** Relação de contraste mínima de **7:1** para texto normal e **4.5:1** para texto grande.
- **Tamanho do Alvo Aprimorado (2.5.5):** Mínimo de 44×44dp com recomendação do projeto de **56dp** (`TouchTarget`).
- **Finalidade do Botão Apenas no Texto (2.4.9):** Rótulos acessíveis completos (`accessibilityLabel`) identificando a ação e o item alvo.
- **Prevenção de Erros Aprimorada (3.3.6):** Exclusões e mutações de itens reversíveis (com *Undo*) ou confirmadas expressamente.
- **Apresentação Visual (1.4.8):** Texto alinhado à esquerda, sem justificação, entrelinha de no mínimo 1.5.

### 8. Integração com Relógio Wear OS (Se Aplicável)
- Contratos de mensagem no `contrato.ts`.
- Mapeamento de eventos enviados (`enviarLembrete`) e recebidos (`concluidoNoRelogio`).

### 9. Plano de Testes
- Testes unitários da store Zustand (testando ações e seletores).
- Teste manual no Expo dev-client / emulador Android com passos reproduzíveis.
- Verificação de acessibilidade via TalkBack e inspeção de contraste.
