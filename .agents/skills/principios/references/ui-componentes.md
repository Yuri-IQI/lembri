# UI — Execução de Tela e Componentes em React Native (Expo)

Material de consulta da skill `principios`, par de `ux-fluxo.md`. A divisão entre os dois é por **momento**:
- **`ux-fluxo.md`:** decisão — quem usa, em que ordem, o que confirma, quais palavras e prevenção de toques acidentais. Leia antes de codar.
- **este arquivo:** execução — qual componente React Native, quais props, estrutura de acessibilidade (**WCAG 2.2 Nível AAA**), estilos via `StyleSheet` e design tokens de `theme.ts`. Leia ao implementar a tela.

---

## 1. Quando este arquivo é obrigatório

- Criação ou alteração de telas no Expo Router (`MobileAPP/src/app/`);
- Criação de novos componentes reutilizáveis em `MobileAPP/src/components/`;
- Ajustes de formulários (`TextInput`, botões, seletores, switches);
- Estilização via `StyleSheet.create` e uso de tokens de `theme.ts`;
- Exibição de listas e coleções de itens (`FlatList`);
- Conformidade mandatória com **WCAG 2.2 Nível AAA**.

---

## 2. Princípios de Execução de UI no Lembri

1. **Componente Temático Antes de Primitiva Crua:**
   - Use `ThemedText` em vez de `<Text>` cru para garantir herança de tipografia e suporte semântico a variantes (`title`, `subheading`, `default`, `defaultBold`, `label`, `button`, `link`, `small`).
   - Use `Card` ou `ThemedView` em vez de `<View style={{ backgroundColor: '#fff' }}>` solto.
   - Use `MainContainer` como container principal das telas para respeitar safe areas e espaçamentos padrão.
2. **Tokens de `theme.ts` Vencem Valores Mágicos:**
   - Cores devem vir de `Colors` (`theme.text`, `theme.surface`, `theme.primary`, etc.).
   - Espaçamentos devem usar `Spacing.one` (4), `Spacing.two` (8), `Spacing.three` (16), `Spacing.four` (24), `Spacing.five` (32).
   - Raios de borda devem usar `Radius.sm` (8), `Radius.md` (12), `Radius.lg` (16), `Radius.full` (999).
   - Alvos de toque interativos devem adotar `TouchTarget = 56` (`minWidth: TouchTarget, minHeight: TouchTarget`).
   - **Proibido:** Números e cores hexadecimais literais soltos dentro de componentes.
3. **Padrão Estrito Mobile (Sem Elementos Web):**
   - É terminantemente proibido utilizar elementos HTML/DOM (`div`, `span`, `button`, `input`) ou bibliotecas web (como Material UI ou Tailwind web).
   - Use os equivalentes nativos: `<View>`, `<Text>`, `<Pressable>`, `<TextInput>`, `<FlatList>`, `<ScrollView>`.
4. **Tratamento dos 5 Estados Visuais:**
   - *Ideal:* Lista renderizada com cards temáticos legíveis.
   - *Carregando (Loading):* `<ActivityIndicator size="large" color={theme.primary} />` com mensagem de apoio.
   - *Vazio (Empty state):* `ListEmptyComponent` com mensagem amigável e botão/ação para criar o primeiro item.
   - *Erro:* Card de aviso com mensagem clara e botão para tentar novamente.
   - *Parcial:* Notificação ou badge indicando pendência de sincronização com o relógio.

---

## 3. Diretrizes de Acessibilidade Mobile — WCAG 2.2 Nível AAA

1. **Contraste de Cores Aprimorado (Critério 1.4.6 — Mínimo 7:1):**
   - Todo texto normal deve apresentar taxa de contraste de pelo menos **7:1** contra o fundo (`theme.text` preto puro ou `theme.textSecondary` grafite escuro sobre fundo claro).
   - Texto grande (>= 18pt ou 14pt bold) deve apresentar pelo menos **4.5:1**.
   - `Colors.textMuted` (`#949494`) possui ~3.1:1 de contraste e **nunca deve ser usado para texto com função informativa ou legível**; use-o estritamente para itens desabilitados ou bordas secundárias.
2. **Apresentação Visual e Tipografia (Critério 1.4.8):**
   - **Sem texto justificado:** Todo bloco de texto deve ter alinhamento à esquerda (`textAlign: 'left'`).
   - **Espaçamento entre linhas:** `lineHeight` deve ser no mínimo **1.5x o tamanho da fonte** (`lineHeight: fontSize * 1.5`).
   - Espaçamento de parágrafo no mínimo 1.5x o espaçamento entre linhas.
3. **Alvos de Toque Mínimos Aprimorados (Critério 2.5.5 — Mínimo 44x44dp / Padrão 56dp):**
   - Qualquer elemento interativo (botão, ícone, toggle, item de lista clicável) deve ter dimensões mínimas de toque de **56x56dp** (`TouchTarget = 56`).
   - Se o ícone visual for menor (ex: 24x24dp), use `padding` ou `hitSlop` para atingir 56dp.
4. **Propósito do Botão Isolado (Critério 2.4.9):**
   - Rótulos de acessibilidade (`accessibilityLabel`) devem ser autoexplicativos sem depender do contexto visual imediato.
   - *Incorreto:* `accessibilityLabel="Excluir"`
   - *Correto (AAA):* `accessibilityLabel={`Excluir lembrete ${item.titulo}`}`

---

## 4. Catálogo de Componentes e Estrutura de Estilos

### A. Tipografia Padronizada (`ThemedText`)
```tsx
import { ThemedText } from '@/components/themed-text';

<ThemedText type="title">Lembretes</ThemedText>
<ThemedText type="subheading">Tomar remédio</ThemedText>
<ThemedText type="label">Horário de disparo</ThemedText>
<ThemedText type="small" themeColor="textSecondary">Concluído no relógio ✓</ThemedText>
```

Variantes disponíveis:
- `title`: 28sp / Bold (lineHeight: 34)
- `subheading`: 18sp / Semi-bold (lineHeight: 27)
- `default`: 16sp / Regular (lineHeight: 24 — 1.5x)
- `defaultBold`: 16sp / Bold (lineHeight: 24)
- `button`: 16sp / Semi-bold (centralizado)
- `label`: 14sp / Bold (com margem para formulários)
- `small`: 14sp / Regular (lineHeight: 21 — 1.5x)
- `smallBold`: 14sp / Bold (lineHeight: 21)
- `link`: 16sp / Underline com cor primária

### B. Cards e Superfícies (`ThemedView` e `Card`)
```tsx
import { Card } from '@/components/themed-view';

<Card>
  <ThemedText type="subheading">{item.titulo}</ThemedText>
  <ThemedText type="small" themeColor="textSecondary">{item.horario}</ThemedText>
</Card>
```

### C. Botões Acessíveis com Alvo de Toque Mínimo (`Pressable`)
```tsx
import { Pressable, StyleSheet } from 'react-native';
import { TouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const styles = StyleSheet.create({
  botao: {
    minHeight: TouchTarget,
    minWidth: TouchTarget,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
```

---

## 5. Ícones SVG e Imagens

- Ícones SVG ficam em `MobileAPP/assets/` e são importados como componentes React (`import BellIcon from '@/assets/bottom-bar/bell.svg'`) via `react-native-svg-transformer`.
- Ajuste `width`, `height` e `fill` diretamente nas props do componente SVG.
- Sempre envolva ícones interativos em um `<Pressable>` com `accessibilityRole="button"` e `accessibilityLabel` claro e autônomo (WCAG 2.4.9 AAA).
