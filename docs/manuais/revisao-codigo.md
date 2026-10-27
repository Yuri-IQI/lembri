# Checklist de Revisão de Código (Code Review) — Projeto Lembri

Este documento serve como guia prático para desenvolvedores e revisores antes de aprovar qualquer Pull Request para a branch `develop` no aplicativo mobile **Lembri**.

---

## 1. Escopo, Gitflow e Commits

- [ ] A branch de trabalho segue o padrão Gitflow (`feat/<tarefa>`, `fix/<tarefa>`), criada a partir de `develop` atualizada, com PR apontando para `develop`.
- [ ] Os commits seguem o padrão **Conventional Commits** (`tipo(escopo): descrição curta`).
- [ ] O diff altera comportamento OU estrutura, nunca os dois ao mesmo tempo.
- [ ] Nenhum código gerado de Continuous Native Generation (`android/` ou `ios/`) foi incluído manualmente sem necessidade.

---

## 2. Clean Code, Nomenclatura e TypeScript Estrito

- [ ] Todo o código (arquivos, variáveis, funções, componentes, hooks, stores e types) está escrito em **inglês**.
- [ ] Textos de tela, placeholders e blocos TSDoc estão escritos em **português (PT-BR)**.
- [ ] Tipagem estrita TypeScript respeitada: **zero uso de `any`** ou `@ts-ignore`.
- [ ] Sem código comentado (código morto) e sem `console.log` de depuração esquecidos.
- [ ] Componentes e funções públicas possuem blocos TSDoc semânticos explicando seu propósito.

---

## 3. Arquitetura Front-end e Gerenciamento de Estado (Zustand)

- [ ] Separação de camadas respeitada:
  - Rotas de tela em `src/app/` apenas compõem componentes e conectam com stores;
  - Componentes de UI em `src/components/` não manipulam coleções de dados diretamente;
  - Regras de manipulação de itens residem em `src/stores/`.
- [ ] **Imutabilidade estrita:** nenhuma ação do Zustand altera arrays ou objetos diretamente via mutação.
- [ ] **Seletores otimizados:** seletores que computam listas ou retornam novos arrays utilizam `useShallow` de `zustand/react/shallow` para prevenir re-renderizações infinitas.
- [ ] Contratos de dados em `src/types/` preservam compatibilidade com mocks existentes.

---

## 4. UI React Native e Design Tokens (`src/constants/theme.ts`)

- [ ] Proibido o uso de tags HTML/DOM (`div`, `span`, `button`, `input`) ou bibliotecas web.
- [ ] Cores, tipografia, espaçamentos e raios consumidos exclusivamente de `theme.ts` ou do hook `useTheme()`.
- [ ] Sem valores mágicos de cores hexadecimais ou dimensões arbitrárias no código.
- [ ] Todos os 5 estados visuais (Ideal, Carregando, Vazio, Erro, Parcial) foram devidamente tratados nas listas e telas assíncronas.

---

## 5. Acessibilidade Mobile (WCAG 2.2 Nível AAA)

- [ ] **Contraste Aprimorado (1.4.6):** Contraste visual atende ao mínimo de **7:1** para texto normal e **4.5:1** para texto grande. Proibido usar `Colors.textMuted` para textos legíveis.
- [ ] **Alvo de Toque Aprimorado (2.5.5):** Alvo de toque de todos os botões, abas e controles interativos atinge no mínimo **44×44dp** com recomendação do projeto `TouchTarget = 56` (`56×56dp`).
- [ ] **Apresentação Visual (1.4.8):** Texto alinhado à esquerda (sem justificar) e entrelinha `lineHeight >= fontSize * 1.5`.
- [ ] **Propósito Autônomo (2.4.9):** Rótulos `accessibilityLabel` autônomos e descritivos em botões e ícones clicáveis (TalkBack / VoiceOver).
- [ ] **Prevenção de Erros Aprimorada (3.3.6):** Ações de exclusão de dados contam com opção de reversão (*Undo*) visível por 5 a 10s ou diálogo de confirmação explícito.
- [ ] **Sem Limite de Tempo Inflexível (2.2.3):** Ausência de timeouts ou contadores regressivos que descartem formulários ou sessões.
- [ ] O status de conclusão de itens não é indicado exclusivamente por cor (contém texto descritivo e ícone de checkmark `✓`).

---

## 6. Mocks e Sincronização Wear OS

- [ ] As fixtures em `src/mocks/` cobrem casos normais e de borda (lista vazia, títulos extensos).
- [ ] Se a tarefa envolver sincronização com o relógio inteligente, o contrato em `src/services/wear/contrato.ts` foi mantido ou atualizado coordenadamente.
- [ ] O script de auditoria estática (`node docs/scripts/lembri-check.mjs`) e `npx tsc --noEmit` rodam com zero erros.
