# Catálogo de Módulos — Projeto Lembri

Este documento lista e descreve os módulos funcionais e técnicos do aplicativo **Lembri**. Esta lista é a fonte de verdade para a skill `/documentar-modulo`.

---

## 1. Módulos Oficiais

| Chave do Módulo | Nome Oficial | Escopo Funcional | Camadas Principais |
|---|---|---|---|
| **`LEMBRETES`** | Gestão de Lembretes | Criação, listagem, edição, filtragem por pendentes/concluídos e disparo de notificações de lembrete | `src/app/(tabs)/lembretes.tsx`, `src/stores/useLembretesStore.ts`, `src/mocks/lembretes.mock.ts` |
| **`EXERCICIOS`** | Rotinas e Exercícios | Listagem de rotinas de exercícios periódicos, instruções, dados mockados e acompanhamento de conclusão | `src/app/(tabs)/exercicios.tsx`, `src/stores/useExerciciosStore.ts`, `src/mocks/exercicios.mock.ts` |
| **`WEAR_CONNECTOR`** | Sincronização Wear OS | Comunicação bidirecional entre smartphone e smartwatch via Wearable Data Layer API (envio e confirmação) | `modules/wear-connector`, `src/services/wear/`, `src/hooks/use-wear.ts` |
| **`CONFIGURACOES`** | Configurações do App | Preferências visuais (tema claro/escuro), notificações, alertas e status de pareamento com o relógio | `src/app/(tabs)/configuracoes.tsx`, `src/constants/theme.ts` |
| **`STORES_MOCKS`** | Estado Global e Mocks | Infraestrutura de dados locais, stores Zustand, seletores otimizados e geradores de dados fictícios | `src/stores/`, `src/mocks/`, `src/types/` |

---

## 2. Regra de Atualização

Ao criar ou expandir novas funcionalidades de grande porte no Lembri:
1. Registre o novo módulo nesta tabela com sua respectiva chave em `UPPER_SNAKE_CASE`;
2. Gere a documentação em HTML correspondente em `docs/modulos/<CHAVE_MODULO>.html` utilizando a skill `/documentar-modulo`.
