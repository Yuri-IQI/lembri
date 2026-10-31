# Dados — Modelagem Front-end, TypeScript e Estado no Zustand

Material de consulta dos princípios 3 (compatibilidade de dados e contratos) e 4 (idempotência e imutabilidade) da skill `principios`. Leia quando a tarefa criar ou alterar a estrutura de dados de itens (lembretes, exercícios, tarefas), stores do Zustand, mocks ou contratos de sincronização no **Lembri**.

---

## 1. Princípios de Modelagem no Front-end

1. **Tipagem Estrita em TypeScript:**
   - Toda entidade deve possuir uma interface clara em `src/types/` (ex: `Lembrete`, `Exercicio`, `WearDevice`).
   - Proibido o uso de `any`. Use tipos literais (`'pendente' | 'concluido'`), generics bem definidos ou interfaces estritas.
2. **Identificadores Únicos e Estáveis:**
   - Todo item deve ter um `id: string` único (gerado via `Date.now().toString()`, UUID ou gerador mock).
   - O `id` é usado como chave no React Native (`FlatList keyExtractor`) e para referenciar o item na comunicação com o relógio.
3. **Uma Informação, Uma Fonte de Verdade:**
   - Evite flags duplicadas na store que possam divergir (ex: manter um array de `lembretes` e outro array paralelo de `concluidos`). Calcule estados derivados através de seletores ou propriedades do próprio item.
4. **Imutabilidade Obrigatória nas Stores:**
   - Nunca altere propriedades de objetos ou elementos de arrays diretamente. Retorne sempre um novo estado através de cópia (`spread`, `.map`, `.filter`).

---

## 2. Padrão Estrutural de Stores Zustand no Lembri

As stores devem ser organizadas em `MobileAPP/src/stores/` seguindo uma estrutura padronizada contendo:
1. **Estado (`State`):** dados das entidades, filtros e status de carregamento.
2. **Ações (`Actions`):** métodos que alteram o estado de forma imutável.

### Exemplo Canônico: `useLembretesStore.ts`

```ts
import { create } from 'zustand';
import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type { Lembrete } from '@/types/lembrete';

interface LembretesState {
  lembretes: Lembrete[];
  filtro: 'todos' | 'pendentes' | 'concluidos';
  isLoading: boolean;
  erro: string | null;

  // Ações
  adicionarLembrete: (titulo: string, horario?: string) => Lembrete;
  toggleConcluido: (id: string) => void;
  removerLembrete: (id: string) => void;
  definirFiltro: (filtro: 'todos' | 'pendentes' | 'concluidos') => void;
  sincronizarComRelogio: (id: string, concluidoNoRelogio: boolean) => void;
  resetarParaMocks: () => void;
}

export const useLembretesStore = create<LembretesState>((set) => ({
  lembretes: lembretesIniciaisMock,
  filtro: 'todos',
  isLoading: false,
  erro: null,

  adicionarLembrete: (titulo, horario = new Date().toLocaleTimeString().slice(0, 5)) => {
    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      horario,
      concluido: false,
      criadoEm: new Date().toISOString(),
    };

    set((state) => ({
      lembretes: [novoLembrete, ...state.lembretes],
    }));

    return novoLembrete;
  },

  toggleConcluido: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((l) =>
        l.id === id ? { ...l, concluido: !l.concluido } : l
      ),
    })),

  removerLembrete: (id) =>
    set((state) => ({
      lembretes: state.lembretes.filter((l) => l.id !== id),
    })),

  definirFiltro: (filtro) => set({ filtro }),

  sincronizarComRelogio: (id, concluidoNoRelogio) =>
    set((state) => ({
      lembretes: state.lembretes.map((l) =>
        l.id === id ? { ...l, concluido: concluidoNoRelogio } : l
      ),
    })),

  resetarParaMocks: () => set({ lembretes: lembretesIniciaisMock }),
}));
```

---

## 3. Gestão e Organização de Mocks (`src/mocks/`)

Como o projeto é focado no front-end e os dados são majoritariamente mockados:
- **Fixtures Iniciais:** Crie arrays estáticos representativos com cenários realistas em `src/mocks/` (ex: `lembretes.mock.ts`, `exercicios.mock.ts`).
- **Diversidade de Cenários:** Inclua nos mocks:
  - Itens curtos e longos (para testar quebra de texto e layout);
  - Itens concluídos e pendentes;
  - Itens com diferentes prioridades e horários;
  - Cenário vazio (para testar o `ListEmptyComponent`).
- **Fábricas de Mock (Mock Factories):**
  ```ts
  export const criarLembreteMock = (override: Partial<Lembrete> = {}): Lembrete => ({
    id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    titulo: 'Lembrete de Teste',
    horario: '10:00',
    concluido: false,
    criadoEm: new Date().toISOString(),
    ...override,
  });
  ```

---

## 4. Persistência Opcional (AsyncStorage via Zustand)

Se for necessário manter os dados do usuário salvos entre reinicializações do aplicativo no celular:
- Utilize o middleware `persist` do Zustand em conjunto com o `@react-native-async-storage/async-storage`:
  ```ts
  import { create } from 'zustand';
  import { persist, createJSONStorage } from 'zustand/middleware';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  export const usePersistedStore = create(
    persist(
      (set, get) => ({ /* estado e ações */ }),
      {
        name: 'lembri-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  );
  ```
- Garanta que a store inicialize com os dados mockados caso o storage local esteja vazio.
