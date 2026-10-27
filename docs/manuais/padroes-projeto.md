# Padrões de Projeto (Design Patterns) — Projeto Lembri

Este documento estabelece os **Padrões de Projeto (Design Patterns)** adotados no desenvolvimento front-end do aplicativo **Lembri** (React Native, Expo SDK 58, Zustand e Wear OS).

---

## 1. Matriz Canônica de Padrões

| Camada / Desafio | Padrão Principal | Papel no Lembri |
|---|---|---|
| **Estado Global** | *Zustand Store Pattern* | Centralização reativa do estado de itens (lembretes, exercícios), coleções e filtros, com mutações estritamente imutáveis. |
| **Camada de Dados Mockada** | *Mock Repository Pattern* | Abstração do acesso a dados mockados através de interfaces tipadas, permitindo substituição transparente por API REST futura. |
| **Lógica Reutilizável de UI** | *Custom Hook Pattern* | Encapsulamento de regras reativas e subscrições (`useTheme`, `useWear`, `useLembretes`) fora dos componentes visuais. |
| **Composição de Telas** | *Compound Components / Container & Presentational* | Componentes puros de exibição (`ThemedText`, `Card`) combinados em containers orquestradores de tela (`MainContainer`, abas). |
| **Comunicação com Hardware** | *Observer / Event Listener Pattern* | Notificação reativa e desacoplada de eventos originados no relógio Wear OS via Wearable Data Layer API. |
| **Geração de Dados de Teste** | *Factory Pattern (Mock Factories)* | Criação parametrizada de fixtures consistentes em `src/mocks/` para testes e desenvolvimento. |

---

## 2. Detalhamento dos Padrões

### 2.1 Zustand Store Pattern (Estado e Ações)
O padrão do Zustand divide a store em três partes claras:
1. **Estado (`State`):** Dados de domínio e controle;
2. **Ações (`Actions`):** Métodos que executam transições imutáveis usando a função `set()`;
3. **Seletores:** Funções puras para extrair fatias do estado evitando re-renderizações desnecessárias.

```ts
interface LembretesStore {
  lembretes: Lembrete[];
  adicionar: (titulo: string) => void;
  alternarConcluido: (id: string) => void;
}

export const useLembretesStore = create<LembretesStore>((set) => ({
  lembretes: lembretesIniciaisMock,
  adicionar: (titulo) =>
    set((state) => ({
      lembretes: [{ id: Date.now().toString(), titulo, concluido: false }, ...state.lembretes],
    })),
  alternarConcluido: (id) =>
    set((state) => ({
      lembretes: state.lembretes.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      ),
    })),
}));
```

### 2.2 Mock Repository Pattern (Acesso a Dados Desacoplado)
Garante que a UI dependa de contratos de dados em vez de fixtures hardcoded na tela:

```ts
export interface ILembretesRepository {
  listar(): Promise<Lembrete[]>;
  salvar(item: Lembrete): Promise<void>;
}

export class LembretesMockRepository implements ILembretesRepository {
  private itens = [...lembretesIniciaisMock];

  async listar() {
    return [...this.itens];
  }

  async salvar(item: Lembrete) {
    this.itens.push(item);
  }
}
```

### 2.3 Observer / Event Listener (Wear Sync)
O serviço de comunicação com o Wear OS escuta mensagens enviadas pelo relógio através do Google Play Services:

```ts
// src/services/wear/wear-service.ts
type Listener = (item: { id: string; concluido: boolean }) => void;

class WearService {
  private listeners: Listener[] = [];

  inscrever(fn: Listener) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  notificar(item: { id: string; concluido: boolean }) {
    this.listeners.forEach((l) => l(item));
  }
}
```
O hook `useWear` se inscreve nesse serviço e despacha a atualização diretamente para a store do Zustand.
