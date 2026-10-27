# Padrões de Documentação de Código (TSDoc / DocBlocks) — Projeto Lembri

Este documento define o padrão oficial de documentação de componentes React Native, hooks customizados, stores do Zustand e serviços para o projeto **Lembri**.

---

## 1. Princípios Gerais

1. **Código em inglês, TSDoc em português:** identificadores (`useLembretesStore`, `addReminder()`, `ThemedTextProps`) são escritos em **inglês**, enquanto o texto explicativo dentro dos blocos TSDoc (`/** ... */`) é escrito em **português claro (PT-BR)**.
2. **Documente o "porquê", não o "o quê":** registre o propósito do componente, fluxos assíncronos, comportamento de acessibilidade e sincronização com o relógio.
3. **Não duplique tipagem estática:** o compilador TypeScript já valida os tipos. **Não utilize tipos manuais dentro das tags** (ex: evite `@param {string} title`).
4. **Metadados pertencem ao Git:** proíbem-se tags redundantes como `@author`, `@since` ou `@version`.
5. **Mantenha atualizado:** ao alterar props de um componente ou ações de uma store, atualize o bloco TSDoc no mesmo commit.

---

## 2. Estrutura e Exemplos

### A. Para Componentes React Native
```tsx
/**
 * Superfície padronizada em formato de Card para agrupamento visual de itens.
 *
 * Aplica automaticamente fundo surface, cantos arredondados (Radius.lg)
 * e borda sutil definidos no theme.ts do Lembri.
 *
 * @param children - Elementos internos do card.
 * @param style - Estilos adicionais opcionais via StyleSheet.
 */
export function Card({ children, style, ...rest }: CardProps) {
  // ...
}
```

### B. Para Stores do Zustand
```ts
/**
 * Store global para controle e reatividade de lembretes no smartphone.
 *
 * Gerencia a lista de lembretes, filtros ativos, alternância de conclusão
 * e sincronização bidirecional com o relógio Wear OS.
 */
export const useLembretesStore = create<LembretesState>((set) => ({
  /**
   * Adiciona um novo lembrete à coleção de forma imutável.
   *
   * @param title - Título descritivo da tarefa ou remédio.
   * @param time - Horário formatado no padrão HH:mm.
   * @returns O objeto do novo lembrete cadastrado com ID gerado.
   */
  addReminder: (title, time) => { /* ... */ },
}));
```

### C. Para Hooks e Serviços
```ts
/**
 * Hook para gerenciar conexão e envio de lembretes ao relógio inteligente.
 *
 * Escuta eventos do módulo nativo wear-connector e atualiza a store reativamente.
 */
export function useWear() {
  // ...
}
```
