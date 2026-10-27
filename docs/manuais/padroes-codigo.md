# Padrões de Codificação e Clean Code — Projeto Lembri

Este documento estabelece as convenções de escrita de código, nomenclatura, tipagem e boas práticas de engenharia para todo o código TypeScript, React Native (Expo) e Zustand do aplicativo **Lembri**.

---

## 1. Ordem de Precedência dos Princípios

Em qualquer decisão técnica ou refatoração, os princípios do projeto valem nesta exata ordem:

1. **Padrões do Projeto Lembri:** a convenção existente no front-end (`src/app/`, `src/components/`, `src/stores/`, `src/services/`, `src/mocks/`) vence preferências individuais.
2. **Escopo de Impacto no Front-end:** diferencie estado local (`useState`) de estado global compartilhado (`Zustand`) e integrações Wear OS.
3. **Compatibilidade de Contratos e Mocks:** preserve interfaces de itens e compatibilidade com os dados mockados e com o módulo Wear.
4. **Idempotência e Imutabilidade:** atualizações de store do Zustand são estritamente imutáveis (nunca mutar arrays ou objetos de estado diretamente).
5. **YAGNI (*You Aren't Gonna Need It*):** não adicione bibliotecas pesadas ou camadas arquiteturais especulativas.
6. **DRY (*Don't Repeat Yourself*):** reutilize componentes temáticos (`ThemedText`, `Card`) e centralize cálculos de itens em seletores da store.
7. **SOLID com pragmatismo:** separe apresentação (componentes) de gerenciamento de estado (stores Zustand) e dados (mocks).
8. **KISS (*Keep It Simple, Stupid*):** prefira a solução mais legível e direta no ecossistema React Native.
9. **Clean Code:** identificadores em inglês, tipagem estrita (zero `any`), alvos de toque acessíveis e ausência de código comentado.

---

## 2. Convenções de Nomenclatura

Todo o código-fonte (**funções, interfaces, types, variáveis, constantes, componentes, hooks, stores e arquivos**) deve ser escrito em **inglês**. Apenas os **comentários TSDoc (`/** ... */`)** e os **textos/mensagens exibidos ao usuário na interface mobile** são escritos em **português (PT-BR)**.

| Elemento | Convenção | Exemplos no Lembri |
|---|---|---|
| **Variáveis e parâmetros** | `camelCase` em inglês | `reminderTitle`, `pendingItems`, `scheduledTime`, `watchDevice` |
| **Booleanos** | `camelCase` em inglês com prefixo `is`, `has`, `can` | `isCompleted`, `isConnected`, `hasWatch`, `isLoading` |
| **Funções e métodos** | `camelCase` em inglês (verbo + substantivo) | `addReminder()`, `toggleItem()`, `syncWithWatch()`, `formatTime()` |
| **Interfaces e Types** | `PascalCase` em inglês | `Reminder`, `ExerciseItem`, `WearDevice`, `LembretesState` |
| **Valores literais / Enums** | `kebab-case` ou `camelCase` em inglês | `'pending'`, `'completed'`, `'all'` |
| **Componentes React Native** | `PascalCase` em inglês | `ThemedText`, `MainContainer`, `ReminderCard`, `TopBar` |
| **Custom Hooks** | `camelCase` iniciando com `use` | `useTheme`, `useWear`, `useReminders` |
| **Stores do Zustand** | `camelCase` iniciando com `use` e terminando com `Store` | `useLembretesStore`, `useExerciciosStore`, `useSettingsStore` |
| **Constantes e Tokens** | `PascalCase` para objetos de token, `UPPER_SNAKE_CASE` para escalares | `Colors`, `Spacing`, `Radius`, `TouchTarget = 56` |
| **Arquivos de código** | `kebab-case.tsx` / `kebab-case.ts` | `themed-text.tsx`, `wear-service.ts`, `use-wear.ts` |

---

## 3. Tipagem TypeScript Estrita

- **Proibido `any`:** utilize tipos genéricos, união literal ou `unknown` com validação de tipo.
- **Tipagem de Retorno em Funções Exportadas:** Declare explicitamente o tipo de retorno em métodos de serviços, stores e hooks compartilhados.
- **Evite Type Assertions desnecessárias (`as SomeType`):** prefira tipar variáveis na declaração ou utilizar type guards (`typeof`, `instanceof`).
