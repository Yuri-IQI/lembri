# Arquitetura em Camadas Front-end — Projeto Lembri

Este documento detalha o mapa de camadas arquiteturais do aplicativo **Lembri** (MobileAPP em React Native / Expo), o fluxo de dados unidirecional, o gerenciamento de estado com **Zustand** e o isolamento da **camada de dados mockados**.

---

## 1. Visão Geral da Arquitetura

O Lembri adota uma arquitetura em camadas focada no **front-end mobile**, priorizando:
- Desacoplamento entre lógica de apresentação (JSX) e gerenciamento de estado;
- Isolamento dos dados mockados, permitindo futura transição para API REST sem tocar na UI;
- Encapsulamento das comunicações nativas com o relógio inteligente (Wear OS).

```
┌─────────────────────────────────────────────────────────────┐
│                 ROTAS E TELAS (src/app/)                    │
│           Navegação Expo Router, Layouts e Abas             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             COMPONENTES VISUAIS (src/components/)           │
│    ThemedText, Card, MainContainer, TopBar, BottomBar       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          GERENCIAMENTO DE ESTADO (src/stores/ - Zustand)    │
│    useLembretesStore, useExerciciosStore, useSettingsStore  │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│  MOCKS & DADOS (src/mocks/)  │ │ SERVIÇOS WEAR (src/services)│
│  Fixtures, Mock Factories    │ │ Contrato, WearService       │
└──────────────────────────────┘ └─────────────┬───────────────┘
                                               │
                                               ▼
                                 ┌─────────────────────────────┐
                                 │ MÓDULO NATIVO WEAR CONNECTOR│
                                 │ Google Play Services Layer  │
                                 └─────────────────────────────┘
```

---

## 2. Detalhamento das Camadas

### A. Rotas e Telas (`src/app/`)
- Implementadas com **Expo Router** baseado no sistema de arquivos.
- Cada arquivo dentro de `src/app/` representa uma rota de navegação.
- Estrutura agrupada por abas: `src/app/(tabs)/_layout.tsx` orquestra a barra inferior e as rotas filhas (`index.tsx`, `lembretes.tsx`, `exercicios.tsx`, `configuracoes.tsx`).
- **Responsabilidade:** Compor componentes visuais, ler parâmetros de rota e invocar hooks/stores. Não contém manipulação direta de arrays ou lógica impura.

### B. Componentes Reutilizáveis de UI (`src/components/`)
- Componentes puros ou controlados de apresentação.
- Subdivididos em:
  - `components/themed-text.tsx`: Tipografia com suporte a variantes e cores do tema;
  - `components/themed-view.tsx`: Superfícies e `Card` com bordas e espaçamentos padronizados;
  - `components/main-container.tsx`: Container com tratamento de safe area e padding horizontal;
  - `components/app-bar/`: Barras de navegação (`top-bar.tsx` e `bottom-bar.tsx`).
- Estilizados exclusivamente com `StyleSheet.create` e os tokens de `src/constants/theme.ts`.

### C. Gerenciamento de Estado com Zustand (`src/stores/`)
- Padrão oficial para controle de itens (lembretes, exercícios, tarefas, configurações).
- As stores mantêm o estado imutável e expõem ações declarativas (`adicionarLembrete`, `toggleConcluido`, `removerLembrete`, `definirFiltro`).
- Consumo otimizado via seletores atômicos ou `useShallow`.

### D. Camada de Dados Mockados (`src/mocks/`)
- Fornece conjuntos de dados fictícios consistentes (`lembretes.mock.ts`, `exercicios.mock.ts`).
- Contém funções utilitárias de fábrica (`criarLembreteMock`) para geração dinâmica em testes.
- Garante conformidade estrita com as interfaces tipadas de `src/types/`.

### E. Serviços e Integração Nativa (`src/services/` e `modules/wear-connector`)
- `src/services/wear/wear-service.ts`: Envia mensagens ao relógio via módulo nativo e escuta confirmações.
- `src/services/wear/contrato.ts`: Define os caminhos de rota da API de dados do Wearable (ex: `/lembrete`, `/confirmacao`).
- `modules/wear-connector`: Módulo nativo em Kotlin integrado ao Expo via Continuous Native Generation.
