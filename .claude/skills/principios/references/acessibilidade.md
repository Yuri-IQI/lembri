# Acessibilidade Mobile — WCAG 2.2 Nível AAA no Aplicativo Lembri

Material de consulta da skill `principios`, terceiro documento do trio de interface mobile junto com `ux-fluxo.md` (decisão de fluxo) e `ui-componentes.md` (execução em React Native). Acessibilidade atravessa tanto o desenho de fluxos quanto a marcação de componentes mobile no Expo.

**Alvo adotado: WCAG 2.2 Nível AAA como requisito inegociável do projeto Lembri.**

---

## Quando ler este arquivo

**Leia sempre que o resultado da tarefa for lido ou operado por uma pessoa no aplicativo:**
- Criação e estilização de telas no Expo Router (`MobileAPP/src/app/`), abas (`(tabs)`), modais ou listas;
- Criação e validação de formulários (`TextInput`, botões de envio de lembretes, seletores);
- Cards de lembretes, tarefas ou exercícios e ações interativas (concluir, editar, excluir);
- Componentes de navegação (`TopBar`, `BottomBar`) e contraste de cores;
- Alertas visuais, mensagens de feedback de envio e sincronização com o relógio Wear OS.

---

## O contexto operacional real do Lembri (Mobile + Wearable)

O Lembri é um aplicativo de apoio a rotinas, medicamentos e exercícios, atendendo pessoas idosas, usuários em reabilitação, indivíduos com baixa visão, daltonismo, tremor essencial ou dificuldades cognitivas. O **Nível AAA** garante máxima inclusão, autonomia e prevenção de falhas humanas.

---

## Critérios Mandatórios da WCAG 2.2 (Nível AAA) no React Native

### 1. Perceptível

#### 1.4.6 Contraste Aprimorado (Nível AAA)
- **Texto Normal (< 18pt / < 24sp regular, ou < 14pt / < 18.5sp bold):** Relação de contraste mínima de **7:1** contra o fundo.
- **Texto Grande (>= 18pt regular ou >= 14pt bold):** Relação de contraste mínima de **4.5:1**.
- **Ícones funcionais e bordas de controles:** Contraste mínimo de **4.5:1** contra o fundo.
- **Auditoria de Cores do Lembri (`src/constants/theme.ts`):**
  - `Colors.text` (`#000000`) sobre `Colors.surface` (`#FFFFFF`): **21:1** ✅ (Supera AAA)
  - `Colors.textSecondary` (`#4E4E4E`) sobre `Colors.surface` (`#FFFFFF`): **8.33:1** ✅ (Supera 7:1)
  - `Colors.textSecondary` (`#4E4E4E`) sobre `Colors.background` (`#F2F2F2`): **7.43:1** ✅ (Supera 7:1)
  - Texto preto sobre as etiquetas e chips do Figma: `#D5EA9B` **16:1**, `#FF8181` **8.7:1**, `#CCCCCC` **13:1** ✅
  - ❌ **Cinzas de texto do Figma que reprovam no AAA** (fundo `#F2F2F2` / `#FFFFFF`): `#555555` 6.7 / 7.5:1, `#5E5E5E` 5.8 / 6.5:1, `#656565` 5.2 / 5.8:1, placeholder `#9E9E9E` 2.4 / 2.7:1, texto branco em botão desabilitado `#9C9C9C` 2.75:1. Use `Colors.textSecondary` no lugar — desvios registrados em `figma.md` (seção 6).
  - ⚠️ **Atenção para `Colors.textMuted` (`#949494`):** Possui contraste de ~3.0:1. **É terminantemente proibido utilizar `textMuted` para textos legíveis essenciais.** Seu uso é restrito a estados inativos/desabilitados (isentos da regra) ou placeholders auxiliares. Textos informativos secundários devem utilizar `textSecondary`.

#### 1.4.8 Apresentação Visual (Nível AAA)
- **Alinhamento:** Todo texto em parágrafos e cards deve ser **alinhado à esquerda**. Nunca use alinhamento justificado (`textAlign: 'justify'` é proibido).
- **Entrelinha (Line Height):** O espaçamento entre linhas dentro de parágrafos deve ser de no mínimo **1.5x o tamanho da fonte** (`lineHeight: fontSize * 1.5`). O Figma usa entrelinha `normal` (~1.2x); no código esta regra prevalece.
- **Comprimento de Linha:** Evite blocos de texto com mais de 80 caracteres por linha.
- **Cores Customizáveis:** Respeito à alternância de tema claro/escuro (`useTheme`).

#### 1.4.9 Texto em Imagens (Sem Exceção - Nível AAA)
- É proibido utilizar imagens para exibir texto (exceto logotipos institucionais indispensáveis). Todo texto de interface deve ser tipográfico nativo renderizado via `ThemedText`.

---

### 2. Operável

#### 2.2.3 Sem Limite de Tempo (Nível AAA)
- Nenhuma ação, preenchimento de formulário ou leitura possui cronômetro regressivo que encerre a sessão sem ação explícita do usuário. O usuário dispõe de tempo ilimitado para ler, preencher e enviar seus lembretes.

#### 2.2.4 Interrupções Adiantáveis (Nível AAA)
- O usuário tem controle sobre notificações e alertas do aplicativo, podendo adiar interrupções não emergenciais.

#### 2.4.8 Localização (Nível AAA)
- O usuário deve saber com clareza em qual tela ou contexto está localizado. A `TopBar` exibe o título da tela e a `BottomBar` destaca a aba ativa com indicador visual e estado `accessibilityState={{ selected: true }}`.

#### 2.4.9 Finalidade do Botão/Link Apenas no Rótulo (Nível AAA)
- O propósito do elemento interativo deve ser compreensível de forma isolada através do seu `accessibilityLabel`, sem depender do texto de elementos adjacentes:
  ```tsx
  // ❌ Inadequado para AAA (ambíguo quando lido isoladamente pelo leitor de tela)
  <Pressable accessibilityLabel="Concluir" ... />

  // ✅ Conforme WCAG 2.2 AAA (contexto completo no próprio rótulo)
  <Pressable
    accessible={true}
    accessibilityRole="button"
    accessibilityLabel={`Marcar como concluído: ${item.titulo}, horário previsto: ${item.horario}`}
    ...
  />
  ```

#### 2.5.5 Tamanho do Alvo Aprimorado (Nível AAA)
- A área de toque de qualquer controle interativo (botões, abas, switches, itens de lista) deve ter dimensões mínimas de **44×44dp**, sendo o padrão oficial do Lembri configurado para **`TouchTarget = 56`** (`56×56dp`).
- Espaçamento entre alvos adjacentes de no mínimo 8dp (`Spacing.two`).

---

### 3. Compreensível

#### 3.3.5 Ajuda Contextual (Nível AAA)
- Formulários devem conter orientações contextuais claras sobre o formato esperado (ex: *"Ex.: Tomar 1 comprimido de vitamina C às 08:00"*).

#### 3.3.6 Prevenção de Erros (Todos os Dados - Nível AAA)
- Para qualquer ação que resulte em exclusão, mutação permanente ou envio ao relógio, ao menos uma das seguintes garantias deve ser fornecida:
  1. **Reversibilidade (Desfazer / *Undo*):** A exclusão permite restauração imediata (ex: aviso temporário com botão "Desfazer");
  2. **Confirmação Explícita:** Diálogo de confirmação que descreve claramente a consequência antes de efetivar;
  3. **Validação Prévia:** Verificação que impede submissões com dados inválidos (botão desabilitado enquanto título estiver vazio).

---

## Checklist de Acessibilidade WCAG 2.2 AAA

- [ ] A relação de contraste de todo texto normal contra o fundo atinge no mínimo **7:1**?
- [ ] Todo texto grande (>= 18pt regular ou >= 14pt bold) atinge no mínimo **4.5:1**?
- [ ] O token `textMuted` não está sendo utilizado para texto essencial legível?
- [ ] Todos os alvos de toque têm no mínimo **44×44dp** (padrão de projeto `TouchTarget = 56`)?
- [ ] O `accessibilityLabel` dos botões identifica a ação e o item completo (Critério 2.4.9)?
- [ ] As ações de exclusão ou mutação possuem opção de reversão (*Undo*) ou confirmação (Critério 3.3.6)?
- [ ] Os textos estão alinhados à esquerda, sem justificação, com `lineHeight >= 1.5` (Critério 1.4.8)?
- [ ] Leitores de tela (TalkBack / VoiceOver) navegam de maneira lógica e fluida por todos os cards?
