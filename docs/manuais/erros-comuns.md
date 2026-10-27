# Erros Comuns e Soluções — Projeto Lembri

Guia de resolução rápida para os problemas mais frequentes encontrados durante o desenvolvimento do **Lembri** (React Native, Expo, Zustand, Wear OS).

---

## 1. Conflito de Versões de JDK (Java)

**Sintoma:** Erro de compilação no Gradle com mensagem sobre versão incompatível de Java ao executar `npx expo run:android` ou `gradlew`.

**Causa:** O React Native não suporta versões recentes do Java (JDK 24+). O MobileAPP exige estritamente o **JDK 17**.

**Solução:**
Defina a variável `JAVA_HOME` para o JDK 17 antes de rodar os comandos no terminal do MobileAPP:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
npx expo run:android
```

---

## 2. Comunicação com Relógio não Funciona no Expo Go

**Sintoma:** O app exibe a mensagem: *"Comunicação com relógio disponível apenas em um development build Android (não funciona no Expo Go)"*.

**Causa:** O módulo `wear-connector` (`modules/wear-connector`) é um módulo nativo em Kotlin. O app padrão do Expo Go não contém código nativo customizado.

**Solução:**
Gere e execute o development build nativo no emulador:
```powershell
cd MobileAPP
npx expo run:android --device <NOME_DO_AVD>
```

---

## 3. Loop de Re-renderizações no Zustand

**Sintoma:** O componente congela ou emite aviso de *Maximum update depth exceeded* ao ler itens da store.

**Causa:** O seletor da store está retornando uma nova referência de array ou objeto a cada render (ex: `state.lembretes.filter(...)`).

**Solução:**
Utilize `useShallow` de `zustand/react/shallow` ou selecione o array base e compute com `useMemo`:
```tsx
import { useShallow } from 'zustand/react/shallow';

// ✅ Correto: evita re-render desnecessário
const pendentes = useLembretesStore(
  useShallow((state) => state.lembretes.filter((item) => !item.concluido))
);
```

---

## 4. Cache do Metro Bundler Corrompido

**Sintoma:** Alterações em arquivos JS/TS não refletem no emulador ou surgem erros de módulo não encontrado após renomear arquivos.

**Solução:**
Reinicie o servidor Metro limpando o cache:
```powershell
cd MobileAPP
npx expo start -c
```
Ou execute o script de reset:
```powershell
npm run reset-project
```

---

## 5. Ícones SVG não Renderizam

**Sintoma:** Erro ao importar arquivos `.svg` como componentes React.

**Causa:** Falta de tipagem ou configuração do transformer.

**Solução:**
Certifique-se de que o arquivo `MobileAPP/src/types/svg.d.ts` declara o módulo SVG:
```ts
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```
E use a importação default: `import BellIcon from '@/assets/bottom-bar/bell.svg'`.

---

## 6. Violações de Acessibilidade Mobile (WCAG 2.2 AAA)

**Sintomas:** Botões com área de toque inferior a 44x44dp / 56dp, texto com baixo contraste (< 7:1) ou ações destrutivas sem confirmação/desfazer (*Undo*).

**Solução:**
1. Aplique o token `TouchTarget = 56` de `src/constants/theme.ts`:
```tsx
<Pressable style={{ minHeight: TouchTarget, minWidth: TouchTarget, justifyContent: 'center' }}>
  {/* Conteúdo */}
</Pressable>
```
Ou utilize a prop `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`.
2. Utilize exclusivamente combinações de cores que garantam **contraste 7:1** para texto normal (`Colors.text` ou `Colors.textSecondary` sobre `Colors.surface` ou `Colors.background`).
3. Forneça mecanismo de reversão (*Undo*) para ações de exclusão.
