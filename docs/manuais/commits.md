# Padrão de Commits — Projeto Lembri

O projeto Lembri adota a convenção de **Conventional Commits** para padronizar o histórico do Git, facilitar a geração automatizada de changelogs e simplificar as revisões de código.

---

## 1. Estrutura da Mensagem de Commit

```
<tipo>(<escopo>): <descrição no imperativo e em minúsculas> [(LEMBRI-XX)]
```

### Regras Obrigatórias:
- O `<tipo>` deve ser um dos tipos permitidos abaixo;
- O `<escopo>` indica a parte do app afetada (veja tabela de escopos);
- A `<descrição>` deve ser concisa (máximo 72 caracteres), sem ponto final e iniciando em minúsculas;
- A chave da tarefa (ex: `LEMBRI-10`) deve ser incluída no final ou no corpo do commit quando houver.

---

## 2. Tipos Permitidos

| Tipo | Finalidade | Exemplo |
|---|---|---|
| `feat` | Nova funcionalidade de tela, store ou integração | `feat(lembretes): criar store zustand para adicionar lembretes (LEMBRI-10)` |
| `fix` | Correção de defeito ou bug visual/lógico | `fix(wear): corrigir reconexao de relogio ao voltar de background` |
| `style` | Ajustes de estilo, tema, cores ou tokens sem mudar lógica | `style(theme): ajustar contraste de cores para wcag 2.2 aaa` |
| `refactor` | Refatoração de código sem mudar comportamento | `refactor(components): extrair card de item reutilizavel` |
| `test` | Adição ou ajuste de testes automatizados | `test(stores): adicionar testes unitarios da store de lembretes` |
| `docs` | Alteração em documentações (`docs/`, `README.md`) | `docs(manuais): documentar arquitetura da store zustand` |
| `chore` | Tarefas de manutenção de dependências ou build | `chore(deps): atualizar pacote expo para versao 58.0.16` |

---

## 3. Escopos Recomendados do Lembri

| Escopo | Descrição |
|---|---|
| `lembretes` | Telas, componentes e regras de lembretes |
| `exercicios` | Telas e dados mockados de exercícios |
| `wear` | Módulo nativo, sincronização e serviço do Wear OS |
| `ui` | Componentes visuais base (`ThemedText`, `Card`, `BarFrame`) |
| `store` | Gerenciamento de estado global com Zustand |
| `mock` | Fixtures de dados mockados e geradores |
| `theme` | Design tokens (`src/constants/theme.ts`) |
| `app` | Rotas do Expo Router e estrutura de abas |
