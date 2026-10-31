# UI — Execução de Tela e Componentes em React Native (Expo)

Material de consulta da skill `principios`, junto com `ux-fluxo.md` e `figma.md`. A divisão entre os três é por **momento**:
- **`ux-fluxo.md`:** decisão — quem usa, em que ordem, o que confirma, quais palavras e prevenção de toques acidentais. Leia antes de codar.
- **`figma.md`:** aparência — frame da tela no Figma, medidas, cores, textos e ícones, e os desvios intencionais por acessibilidade.
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

1. **Figma primeiro, acessibilidade acima do Figma:**
   - Toda tela com frame no Figma segue o frame (`figma.md`, seção 1). Abra o frame antes de codar.
   - Onde o Figma viola WCAG 2.2 AAA (contraste, entrelinha, alvo de toque), aplique a tabela de desvios de `figma.md` (seção 6).
2. **Componente Temático Antes de Primitiva Crua:**
   - Use `ThemedText` em vez de `<Text>` cru para garantir herança de tipografia e suporte semântico às variantes da seção 4.A.
   - Use `Card` ou `ThemedView` em vez de `<View style={{ backgroundColor: '#fff' }}>` solto.
   - Use `MainContainer` como container principal das telas para respeitar safe areas e espaçamentos padrão.
   - A top bar e a bottom bar vêm do layout das abas (`components/app-bar/`); telas não desenham as próprias barras.
3. **Tokens de `theme.ts` Vencem Valores Mágicos:**
   - Cores devem vir de `Colors` (`theme.text`, `theme.surface`, `theme.primary`, etc.). A correspondência hex do Figma → token está em `figma.md` (seção 2).
   - Espaçamentos devem usar `Spacing.one` (4), `Spacing.two` (8), `Spacing.three` (16), `Spacing.four` (24), `Spacing.five` (32). Margem lateral das telas = `Spacing.four` (24), como no Figma.
   - Raios de borda devem usar `Radius.sm` (8 — botões de ação e listas de ajustes), `Radius.md` (12 — inputs e etiquetas), `Radius.lg` (16 — cards), `Radius.full` (999 — chips e círculos).
   - Bordas: cards do Figma usam **2**; listas de ajustes e pílulas usam **1**. Use `BorderWidth` (ajuste o token para refletir 1 e 2 se ainda estiver em 1,5/2,5).
   - Alvos de toque interativos devem adotar `TouchTarget = 56` (`minWidth: TouchTarget, minHeight: TouchTarget`); quando o visual do Figma for menor, mantenha o visual e amplie a área com `hitSlop`/padding (mínimo 48).
   - **Proibido:** Números e cores hexadecimais literais soltos dentro de componentes. Valor do Figma sem token vira pergunta (Regra da Dúvida) e, confirmado, token novo em `theme.ts`.
4. **Padrão Estrito Mobile (Sem Elementos Web):**
   - É terminantemente proibido utilizar elementos HTML/DOM (`div`, `span`, `button`, `input`) ou bibliotecas web (como Material UI ou Tailwind web). O código que o Figma devolve em React + Tailwind é **referência** e precisa ser traduzido.
   - Use os equivalentes nativos: `<View>`, `<Text>`, `<Pressable>`, `<TextInput>`, `<FlatList>`, `<ScrollView>`.
5. **Tratamento dos 5 Estados Visuais:**
   - *Ideal:* Lista renderizada com cards temáticos legíveis.
   - *Carregando (Loading):* `<ActivityIndicator size="large" color={theme.primary} />` com mensagem de apoio.
   - *Vazio (Empty state):* `ListEmptyComponent` com mensagem amigável e botão/ação para criar o primeiro item (frame `lembretes nao encontrados`).
   - *Erro:* Card de aviso com mensagem clara e botão para tentar novamente.
   - *Parcial:* Notificação ou badge indicando pendência de sincronização com o relógio.

---

## 3. Diretrizes de Acessibilidade Mobile — WCAG 2.2 Nível AAA

1. **Contraste de Cores Aprimorado (Critério 1.4.6 — Mínimo 7:1):**
   - Todo texto normal deve apresentar taxa de contraste de pelo menos **7:1** contra o fundo (`theme.text` preto puro ou `theme.textSecondary` `#4E4E4E` — 7,43:1 no fundo `#F2F2F2`).
   - Texto grande (≥ 24sp regular ou ≥ 18,5sp bold) deve apresentar pelo menos **4.5:1**.
   - Os cinzas de texto do Figma (`#5E5E5E`, `#656565`, `#555555`, `#9E9E9E`) **não passam** — substitua por `theme.textSecondary` (ver `figma.md`, seção 6).
   - `Colors.textMuted` (`#949494`) possui ~3:1 de contraste e **nunca deve ser usado para texto com função informativa ou legível**; use-o estritamente para bordas e elementos decorativos.
2. **Apresentação Visual e Tipografia (Critério 1.4.8):**
   - **Sem texto justificado:** Todo bloco de texto deve ter alinhamento à esquerda (`textAlign: 'left'`). Títulos da top bar podem ser centralizados, como no Figma.
   - **Espaçamento entre linhas:** `lineHeight` deve ser no mínimo **1.5x o tamanho da fonte** em texto corrido (o Figma usa `normal`; aqui vale a regra AAA). Títulos de uma linha podem usar ~1,25x.
   - Espaçamento de parágrafo no mínimo 1.5x o espaçamento entre linhas.
3. **Alvos de Toque Mínimos Aprimorados (Critério 2.5.5 — Mínimo 44x44dp / Padrão 56dp):**
   - Qualquer elemento interativo (botão, ícone, toggle, item de lista clicável) deve ter dimensões mínimas de toque de **56x56dp** (`TouchTarget = 56`).
   - Se o ícone visual for menor (ex: botões circulares de 32 da top bar, chips de 32, dias de 38), use `padding` ou `hitSlop` para atingir no mínimo 48dp, preferencialmente 56dp.
4. **Propósito do Botão Isolado (Critério 2.4.9):**
   - Rótulos de acessibilidade (`accessibilityLabel`) devem ser autoexplicativos sem depender do contexto visual imediato.
   - *Incorreto:* `accessibilityLabel="Excluir"`
   - *Correto (AAA):* `accessibilityLabel={`Excluir lembrete ${item.titulo}`}`

---

## 4. Catálogo de Componentes e Estrutura de Estilos

### A. Tipografia Padronizada (`ThemedText`)
```tsx
import { ThemedText } from '@/components/themed-text';

<ThemedText type="title">Seus Lembretes</ThemedText>
<ThemedText type="subheading">Tomar remédio</ThemedText>
<ThemedText type="label">Horários</ThemedText>
<ThemedText type="small" themeColor="textSecondary">Concluído no relógio ✓</ThemedText>
```

Escala-alvo, derivada do Figma (fonte Inter; tamanhos do Figma, entrelinha AAA):

| Variante | Tamanho / peso | lineHeight | Uso no Figma |
|---|---|---|---|
| `display` | 64 / Regular | 76 | "18:00" do card de próximo lembrete |
| `headline` | 36 / Bold | 44 | Título do card destaque, "Hoje, 18:00" |
| `title` | 32 / ExtraBold (800) | 40 | Títulos de tela ("Seus Lembretes", "Bem Vindo ao Lembri!") |
| `subheading` | 24 / Bold | 32 | Título de card/item de lembrete, rótulos de formulário |
| `default` | 20 / Medium (500) | 30 | Corpo, itens de ajuste, descrições |
| `defaultBold` | 20 / SemiBold (600) | 30 | Valores em destaque ("Domingo e Quinta") |
| `button` | 24 / Bold | 32 | Botões de ação ("Editar", "SALVAR"); "Ver" usa 32 |
| `label` | 16 / SemiBold, caixa alta | 24 | Rótulos de seção ("PRÓXIMO LEMBRETE", "ACESSIBILIDADE") |
| `small` | 16 / Regular | 24 | Texto de apoio ("HOJE - Há 25 min.", descrição de ajuste) |
| `smallBold` | 16 / Bold | 24 | Parte em destaque do texto de apoio ("HOJE") |
| `link` | 18 / SemiBold, sublinhado | 27 | "Instruções de Uso", "Suporte" |

Rótulo da bottom bar e chip de horário usam **14 Bold** (estilo local, como no Figma).
Se `themed-text.tsx` ainda estiver com outra escala, alinhe-o a esta tabela ao tocar no arquivo e avise na entrega.

### B. Cards e Superfícies (`ThemedView` e `Card`)
```tsx
import { Card } from '@/components/themed-view';

<Card>
  <ThemedText type="subheading">{item.titulo}</ThemedText>
  <ThemedText type="small" themeColor="textSecondary">{item.horario}</ThemedText>
</Card>
```
- `Card` = fundo `surface`, borda 2 `border`, raio 16, padding 12 (Figma).
- Listas de ajustes/ajuda: borda 1, raio 8, linhas separadas por borda inferior 1 (ver `figma.md`, seção 4).

### C. Botões Acessíveis com Alvo de Toque Mínimo (`Pressable`)
```tsx
import { Pressable, StyleSheet } from 'react-native';
import { TouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const styles = StyleSheet.create({
  botaoPrimario: {
    minHeight: TouchTarget,
    minWidth: TouchTarget,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
});
```
- Primário: fundo `theme.primary`, texto `onPrimary`. Secundário: fundo `surface`, borda preta, texto `text`.
- Desabilitado: **não** use o cinza `#9C9C9C` do Figma; mantenha o estilo, reduza a opacidade e informe `accessibilityState={{ disabled: true }}`.

### D. Barras de navegação
- `TopBar` e `BottomBar` em `components/app-bar/`, montadas no layout `(tabs)/_layout.tsx`. Medidas e variantes em `figma.md`, seção 4.

---

## 5. Ícones SVG e Imagens

- Ícones SVG ficam em `MobileAPP/assets/<area>/` e são importados como componentes React (`import BellIcon from '@/assets/bottom-bar/bell.svg'`) via `react-native-svg-transformer` (`metro.config.js` + `.svgrrc`).
- Ajuste `width` e `height` nas props do componente SVG. Cores que variam por estado (ex.: aba ativa) viram prop pelo `.svgrrc` (`replaceAttrValues`), como o `preenchimento` da bottom bar.
- Ícones genéricos do Figma (Simple Design System / Material 3) → `expo-symbols` (`SymbolView`, nome Material). Desenhos próprios (logo, bottom bar, sino do lembrete) → SVG exportado do Figma.
- Assets baixados do Figma: remova atributos de web que quebram no React Native (ex.: `style="display: block;"`).
- Sempre envolva ícones interativos em um `<Pressable>` com `accessibilityRole="button"` e `accessibilityLabel` claro e autônomo (WCAG 2.4.9 AAA).
