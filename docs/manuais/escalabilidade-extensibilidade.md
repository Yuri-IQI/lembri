# Escalabilidade e Extensibilidade — Projeto Lembri

Diretrizes para garantir que a base de código do **Lembri** cresça de forma modular, sustentável e preparada para futuras evoluções (como transição de dados mockados para API REST real ou banco local SQLite).

---

## 1. Modularização do Estado com Zustand (Store Slices)

Conforme novos tipos de itens e funcionalidades forem adicionados (ex: medicamentos, hidratação, exercícios de respiração), evite criar uma única store monolítica gigantesca.

Adote a técnica de **Slices** do Zustand:
```ts
import { StateCreator } from 'zustand';

export interface LembretesSlice {
  lembretes: Lembrete[];
  adicionarLembrete: (titulo: string) => void;
}

export const createLembretesSlice: StateCreator<LembretesSlice> = (set) => ({
  lembretes: [],
  adicionarLembrete: (titulo) =>
    set((state) => ({ lembretes: [...state.lembretes, { id: Date.now().toString(), titulo, concluido: false }] })),
});
```
Isso permite manter as regras isoladas por domínio sem perder a capacidade de compor o estado.

---

## 2. Preparação para Backend Real (Repository Pattern Front-end)

Atualmente, o projeto utiliza dados **majoritariamente mockados**. Para garantir que a chegada futura de uma API backend não exija reescrever telas ou stores:

1. **Defina Contratos de Serviço:**
   ```ts
   // src/services/lembretes/lembretes-service.interface.ts
   export interface ILembretesService {
     listar(): Promise<Lembrete[]>;
     criar(titulo: string): Promise<Lembrete>;
     atualizar(id: string, concluido: boolean): Promise<void>;
   }
   ```
2. **Implemente o Serviço Mockado Atual:**
   ```ts
   // src/services/lembretes/lembretes-mock.service.ts
   export class LembretesMockService implements ILembretesService {
     async listar(): Promise<Lembrete[]> {
       await simularAtraso(300);
       return lembretesIniciaisMock;
     }
     // ...
   }
   ```
3. No futuro, bastará implementar `LembretesHttpService` chamando `fetch()` ou `axios` sem alterar nenhum componente de tela.

---

## 3. Escalabilidade de Performance em Listas Grandes

Se a lista de lembretes ou exercícios crescer:
- **Janelamento do `FlatList`:**
  Ajuste `initialNumToRender={10}`, `maxToRenderPerBatch={10}` e `windowSize={5}` para economizar consumo de memória.
- **`getItemLayout` para Itens de Altura Fixa:**
  Permite que o React Native calcule a posição dos itens sem precisar medi-los dinamicamente, acelerando a rolagem para milhares de itens.

---

## 4. Extensibilidade da Navegação (Expo Router)

Ao adicionar fluxos secundários (ex: detalhes do item, tela de edição, onboarding):
- Crie rotas dinâmicas em `src/app/lembrete/[id].tsx`;
- Utilize grupos de rota `(auth)`, `(tabs)` para separar fluxos conceituais sem alterar a URL pública.
