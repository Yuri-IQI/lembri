# Padrões de Implementação Frontend — Projeto Lembri

Este documento define as diretrizes de desenvolvimento de interface, componentes reutilizáveis, experiência do usuário (UX/IHC) e acessibilidade (**WCAG 2.2 Nível AAA**) para o aplicativo mobile **Lembri** (**React Native, Expo SDK 58, React 19, TypeScript e Zustand**).

---

## 1. Princípios de Interface Mobile

1. **Mobile-First & One-Hand Usability:**
   - Componentes essenciais e botões de ação devem ficar em posições acessíveis para a operação com apenas uma mão.
   - Alvos de toque devem seguir o padrão `TouchTarget = 56` definido em `src/constants/theme.ts` (mínimo de 44×44dp da WCAG AAA, com recomendação de 56×56dp).
2. **Design Tokens Centralizados (`src/constants/theme.ts`):**
   - Todas as cores, fontes, espaçamentos e raios devem ser consumidos de `theme.ts` ou do hook `useTheme()`.
   - Proibido hardcoded hexadecimais ou números arbitrários dentro de componentes.
3. **Padrão Estrito React Native (Sem Primitivas Web):**
   - Proibido o uso de elementos HTML (`div`, `button`, `input`) ou de bibliotecas exclusivas de web (como Material UI ou CSS Modules).
   - Utilize `<View>`, `<Text>`, `<Pressable>`, `<TextInput>`, `<FlatList>`.
4. **Tratamento dos 5 Estados Visuais:**
   - **Ideal:** Apresentação clara dos dados nos cards temáticos;
   - **Carregando (Loading):** `<ActivityIndicator>` ou skeleton nativo enquanto dados são processados;
   - **Vazio (Empty):** `ListEmptyComponent` amigável com mensagem explicativa e botão para adicionar item;
   - **Erro:** Feedback descritivo do problema com opção de tentar novamente;
   - **Parcial:** Sinalização visual de itens pendentes de sincronização com o relógio.

---

## 2. Catálogo de Componentes Base (`src/components/`)

### Tipografia (`components/themed-text.tsx`)
```tsx
import { ThemedText } from '@/components/themed-text';

<ThemedText type="title">Lembretes</ThemedText>
<ThemedText type="subheading">Tomar remédio</ThemedText>
<ThemedText type="small" themeColor="textSecondary">08:00 - Concluído no relógio ✓</ThemedText>
```

### Cards e Superfícies (`components/themed-view.tsx`)
```tsx
import { Card } from '@/components/themed-view';

<Card>
  <ThemedText type="subheading">Exercício Matinal</ThemedText>
  <ThemedText type="small">10 minutos de alongamento</ThemedText>
</Card>
```

### Barra Superior e Inferior (`components/app-bar/`)
- `TopBar`: exibe o título da tela ativa e ações rápidas.
- `BottomBar`: gerencia a navegação entre as 4 abas principais com ícones SVG acessíveis.

---

## 3. Padrão de Integração com Zustand

Os componentes de tela devem consumir as stores de forma atômica para evitar re-renderizações excessivas:

```tsx
import { useLembretesStore } from '@/stores/useLembretesStore';
import { useShallow } from 'zustand/react/shallow';

export const LembretesList = () => {
  const lembretes = useLembretesStore(
    useShallow((state) => state.lembretes.filter((item) => !item.concluido))
  );
  const toggleConcluido = useLembretesStore((state) => state.toggleConcluido);

  return (
    <FlatList
      data={lembretes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Card>
          <ThemedText type="subheading">{item.titulo}</ThemedText>
          <Pressable
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Marcar ${item.titulo} como concluído`}
            onPress={() => toggleConcluido(item.id)}
          >
            <ThemedText type="link">Concluir</ThemedText>
          </Pressable>
        </Card>
      )}
    />
  );
};
```

---

## 4. Diretrizes de Acessibilidade Mobile — WCAG 2.2 Nível AAA

1. **Contraste Aprimorado (Critério 1.4.6 — 7:1):**
   - Todo texto informativo deve respeitar taxa de contraste mínima de **7:1** para texto normal e **4.5:1** para texto grande (>= 18pt regular ou >= 14pt bold).
   - Proibido usar `Colors.textMuted` para textos legíveis.
2. **Apresentação Visual do Texto (Critério 1.4.8):**
   - Sem texto justificado: alinhe sempre à esquerda (`textAlign: 'left'`).
   - Espaçamento entre linhas (`lineHeight`) obrigatório de pelo menos **1.5x o tamanho da fonte**.
3. **Alvo de Toque Aprimorado (Critério 2.5.5 — Mínimo 44x44dp / Padrão 56dp):**
   - Todos os elementos acionáveis devem medir no mínimo **56x56dp** através de `minWidth: TouchTarget, minHeight: TouchTarget` ou `hitSlop`.
4. **Prevenção de Erros e Reversibilidade (Critério 3.3.6):**
   - Ações de exclusão de dados devem ser reversíveis (*Undo*) através de aviso de confirmação na tela por 5 a 10 segundos ou confirmação expressa antes de efetivar.
5. **Propósito do Botão Isolado (Critério 2.4.9):**
   - Propriedade `accessibilityLabel` autônoma que dispensa a leitura de elementos vizinhos para ser compreendida.
