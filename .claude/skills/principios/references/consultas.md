# Consultas, Seletores e Filtragem de Dados Mockados no Front-end

Material de consulta da skill `principios`, par de `dados.md`.
A divisão entre os dois:
- **`dados.md`:** como o estado e os tipos de itens são modelados e estruturados no TypeScript e nas stores do Zustand.
- **este arquivo:** como os dados são lidos, filtrados, buscados, ordenados e consumidos de forma performática pelas telas e componentes React Native.

---

## 1. Seletores no Zustand: Granularidade e Re-renderizações

No Zustand, quando um componente se inscreve em uma store, qualquer alteração no valor retornado pelo seletor provocará uma re-renderização do componente.

### Boas Práticas de Seleção
- **Seletor atômico (Recomendado para valores primitivos ou ações):**
  ```tsx
  // ✅ Bom: o componente só re-renderiza se a contagem mudar
  const totalPendentes = useLembretesStore((state) => state.totalPendentes);
  const adicionarLembrete = useLembretesStore((state) => state.adicionarLembrete);
  ```

- **Evite retornar novos arrays/objetos sem memoização:**
  ```tsx
  // ❌ Ruim: `.filter()` cria uma nova referência de array a cada tick da store, causando re-render infinito ou excessivo
  const pendentes = useLembretesStore((state) => state.lembretes.filter((item) => !item.concluido));

  // ✅ Bom: Seletor combinado com useShallow (de 'zustand/shallow') ou pré-calculado na store
  import { useShallow } from 'zustand/react/shallow';

  const pendentes = useLembretesStore(
    useShallow((state) => state.lembretes.filter((item) => !item.concluido))
  );
  ```

- **Seletor de ação isolado:**
  As funções de ação do Zustand têm referências estáveis. Selecione-as diretamente:
  ```tsx
  const toggleConcluido = useLembretesStore((state) => state.toggleConcluido);
  ```

---

## 2. Filtragem e Busca de Itens na Camada Front-end

Como os dados são majoritariamente mockados, a busca e a ordenação ocorrem no dispositivo:

1. **Busca por texto com normalização:**
   - Converta termo de busca e texto do item para minúsculas e remova acentos para melhor UX:
   ```ts
   const normalizar = (str: string) =>
     str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

   const itensFiltrados = itens.filter((item) =>
     normalizar(item.titulo).includes(normalizar(termoBusca))
   );
   ```

2. **Debounce em inputs de pesquisa:**
   - Não dispare filtros a cada caractere se a lista de itens for longa; utilize um debounce simples (ex: 200-300ms) para evitar engasgos na thread JS do React Native.

3. **Ordenação declarativa:**
   - Mantenha a lista ordenada por prioridade, data de criação ou horário previsto:
   ```ts
   const itensOrdenados = [...itens].sort((a, b) => a.horario.localeCompare(b.horario));
   ```

---

## 3. Performance em Listas React Native (`FlatList`)

Para garantir 60fps na rolagem de listas com dados mockados:
- **`keyExtractor` estável e único:** Use sempre o `id` da entidade (`keyExtractor={(item) => item.id}`). Nunca use o índice do array como chave se a lista puder sofrer inserções, remoções ou reordenações.
- **`contentContainerStyle` para espaçamento:** Use `gap: Spacing.two` ou `ItemSeparatorComponent` em vez de margens externas nos itens.
- **`ListEmptyComponent` acessível:** Forneça sempre um componente descritivo quando a lista estiver vazia.
- **Evite funções anônimas no `renderItem`:** Prefira um componente ou callback memoizado para o renderizador de cada item.

---

## 4. Simulação de Requisições Assíncronas (Mock Services)

Ao testar carregamentos (`loading`), estados de erro ou operações assíncronas (como envio para o relógio):
- Utilize uma função auxiliar para simular latência de rede ou processamento:
  ```ts
  export const simularAtraso = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
  ```
- Isso permite testar se o indicador de atividade (`ActivityIndicator`), o botão desabilitado e as mensagens de sucesso/erro aparecem e desaparecem no momento correto.
