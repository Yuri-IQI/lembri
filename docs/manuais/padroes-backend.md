# Padrões de Dados Mockados e Serviços Front-end — Projeto Lembri

Como o aplicativo Lembri é **focado no front-end** e os dados são **majoritariamente mockados**, este manual estabelece os padrões para construção de serviços, repositórios em memória, simulação de dados e preparação para futura integração com APIs externas.

---

## 1. Separação de Responsabilidades na Camada de Dados

| Camada | Localização | O que faz | O que é proibido |
|---|---|---|---|
| **Mocks & Fixtures** | `src/mocks/` | Fornece massa de dados inicial e geradores para itens (lembretes, exercícios) | Conter lógica de renderização JSX ou efeitos colaterais impuros |
| **Serviços / Repositórios** | `src/services/` | Encapsula chamadas a dados (mockados ou reais) e comunicação com hardware (Wear OS) | Renderizar UI ou acoplar-se diretamente ao ciclo de vida de componentes |
| **Stores (Zustand)** | `src/stores/` | Mantém o estado reativo da aplicação, manipula coleções e orquestra chamadas aos serviços | Realizar mutações diretas de estado sem passar pelo `set()` |
| **Types / Contratos** | `src/types/` | Define interfaces estritas de dados e contratos de mensagens do relógio | Conter implementações executáveis |

---

## 2. Padrão de Repositório Mockado (In-Memory Repository)

Para garantir desacoplamento, estruture o acesso a dados mockados através de contratos de interface:

```ts
// src/services/lembretes/lembretes-repository.interface.ts
import type { Lembrete } from '@/types/lembrete';

export interface ILembretesRepository {
  obterTodos(): Promise<Lembrete[]>;
  salvar(lembrete: Lembrete): Promise<void>;
  atualizar(id: string, atualizacao: Partial<Lembrete>): Promise<void>;
  remover(id: string): Promise<void>;
}
```

Implementação mockada em memória com simulação assíncrona:
```ts
// src/services/lembretes/lembretes-mock.repository.ts
import { lembretesIniciaisMock } from '@/mocks/lembretes.mock';
import type { Lembrete } from '@/types/lembrete';
import type { ILembretesRepository } from './lembretes-repository.interface';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export class LembretesMockRepository implements ILembretesRepository {
  private itens: Lembrete[] = [...lembretesIniciaisMock];

  async obterTodos(): Promise<Lembrete[]> {
    await delay();
    return [...this.itens];
  }

  async salvar(lembrete: Lembrete): Promise<void> {
    await delay();
    this.itens = [lembrete, ...this.itens];
  }

  async atualizar(id: string, atualizacao: Partial<Lembrete>): Promise<void> {
    await delay();
    this.itens = this.itens.map((item) =>
      item.id === id ? { ...item, ...atualizacao } : item
    );
  }

  async remover(id: string): Promise<void> {
    await delay();
    this.itens = this.itens.filter((item) => item.id !== id);
  }
}
```

---

## 3. Mock Factories (Geradores Dinâmicos de Dados)

Em testes e simulações, evite duplicar objetos literais gigantes. Crie funções de fábrica em `src/mocks/`:

```ts
import type { Lembrete } from '@/types/lembrete';

export const criarLembreteMock = (override: Partial<Lembrete> = {}): Lembrete => ({
  id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  titulo: 'Tomar vitamina C',
  horario: '08:00',
  concluido: false,
  criadoEm: new Date().toISOString(),
  ...override,
});
```

---

## 4. Comunicação com Relógio (Wear Service)

A comunicação com o relógio é tratada como um serviço externo assíncrono em `src/services/wear/`:
- `contrato.ts`: Define as rotas do Wearable Data Layer (`/lembrete`, `/confirmacao`).
- `wear-service.ts`: Abstrai o envio para múltiplos nós conectados e registra listeners para eventos de confirmação.
- O hook `useWear` conecta esses eventos com a store do Zustand para atualização reativa da interface.
