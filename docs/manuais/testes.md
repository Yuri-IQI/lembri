# QA, Qualidade de Código e Testes — Projeto Lembri

Este documento descreve as práticas de verificação estática, testes automatizados de stores Zustand, testes de componentes React Native, testes no **Android Studio com emuladores pareados (Phone + Wear OS)** e auditoria de acessibilidade mobile (**WCAG 2.2 Nível AAA**) no **Lembri**.

---

## 1. Ferramentas de Verificação e QA

| Ferramenta | Onde Atua | Objetivo |
|---|---|---|
| **TypeScript (`tsc`)** | `MobileAPP/` | Verificação estática estrita de tipos, interfaces de dados e props de componentes React Native. |
| **Expo Linter (`eslint-config-expo`)** | `MobileAPP/` | Detecção de problemas em hooks React, regras do Expo Router e padronização de código. |
| **Testes de Stores (Zustand)** | `MobileAPP/src/stores/` | Testes unitários para validar mutações imutáveis de estado, seletores e ações de itens. |
| **Auditoria Mobile (`lembri-check.mjs`)** | Repositório | Auditoria automatizada de boas práticas mobile, ausência de `any`, tokens de `theme.ts` e acessibilidade WCAG AAA. |
| **Android Studio & Device Manager** | Celular e Relógio | Execução de AVDs pareados, testes de Compose for Wear OS, inspeção de UI em telas circulares e logs via Logcat. |

---

## 2. Comandos de Verificação Estática

Execute a partir do diretório `MobileAPP`:

```powershell
cd MobileAPP

# 1. Executar linter do Expo
npx expo lint

# 2. Executar checagem estrita de tipos TypeScript
npx tsc --noEmit

# 3. Diagnóstico de dependências e ambiente
npx expo-doctor
```

---

## 3. Estratégia de Teste de Stores Zustand

Como o projeto é focado no front-end e os itens são gerenciados com **Zustand**, as stores concentram as principais regras de negócio:

### Exemplo de Teste de Store Zustand:
```ts
import { useLembretesStore } from '@/stores/useLembretesStore';

describe('useLembretesStore', () => {
  beforeEach(() => {
    useLembretesStore.getState().resetarParaMocks();
  });

  it('deve adicionar um novo lembrete de forma imutável', () => {
    const totalInicial = useLembretesStore.getState().lembretes.length;
    const novo = useLembretesStore.getState().adicionarLembrete('Tomar remédio', '14:00');

    const estado = useLembretesStore.getState();
    expect(estado.lembretes.length).toBe(totalInicial + 1);
    expect(estado.lembretes[0].id).toBe(novo.id);
    expect(estado.lembretes[0].titulo).toBe('Tomar remédio');
    expect(estado.lembretes[0].concluido).toBe(false);
  });

  it('deve alternar status de conclusão de um lembrete', () => {
    const item = useLembretesStore.getState().lembretes[0];
    const statusOriginal = item.concluido;

    useLembretesStore.getState().toggleConcluido(item.id);
    const atualizado = useLembretesStore.getState().lembretes.find((l) => l.id === item.id);

    expect(atualizado?.concluido).toBe(!statusOriginal);
  });
});
```

---

## 4. Bateria de Testes Funcionais no Emulador Mobile

1. **Navegação e Layout:**
   - Navegue por todas as abas da barra inferior (`Início`, `Lembretes`, `Exercícios`, `Configurações`);
   - Verifique se a tela adapta-se a diferentes densidades de tela e orientações.
2. **Ciclo de Vida do Lembrete:**
   - Digite um novo título de lembrete e toque no botão de envio;
   - Verifique a mensagem de sucesso e a inclusão do item na lista;
   - Toque no lembrete para alternar o status e verifique a atualização do texto e do ícone de checkmark (`✓`).
3. **Auditoria de Acessibilidade Mobile (WCAG 2.2 Nível AAA):**
   - Inspecione se os botões interativos cumprem o tamanho de **56dp** (`TouchTarget`, mínimo 44x44dp AAA);
   - Inspecione a taxa de contraste (mínimo de 7:1 para texto normal e 4.5:1 para texto grande);
   - Verifique se ações de exclusão possuem mecanismo de reversão (*Undo* com 5 a 10s);
   - Verifique ausência de limites de tempo inflexíveis;
   - Ative o leitor de tela TalkBack (Android) ou VoiceOver (iOS) e navegue pelos cards;
   - Verifique se as descrições dos botões e status são anunciadas claramente e de forma autônoma (`accessibilityLabel`).

---

## 5. Testes no Android Studio e Emuladores Pareados

O ecossistema Lembri conecta dois aplicativos distintos pela **Wearable Data Layer API**. Os testes integrados devem ser realizados utilizando o **Android Studio**:

### A. Preparação dos AVDs no Device Manager
1. Abra **Tools → Device Manager** no Android Studio;
2. **AVD do Celular (`Pixel_10_Pro`):** Deve utilizar uma imagem de sistema **Google Play (API 37)**;
3. **AVD do Relógio (`Wear_OS_Small_Round`):** Deve utilizar imagem de sistema **Wear OS (API 37)**;
4. **Pareamento:** No Device Manager, clique nos três pontos (`⋮`) do `Wear_OS_Small_Round` e selecione **Pair Wearable**. Escolha o `Pixel_10_Pro` e complete a configuração no app companion (*Pixel Watch* ou *Wear OS by Google*) na tela do celular.

### B. Testando o WearableAPP no Android Studio
1. **Compose Previews:** Abra o arquivo `LembretesScreen.kt` no Android Studio. A anotação `@WearPreviewDevices` renderiza a interface instantaneamente para formatos circulares e quadrados na aba *Design/Split*;
2. **Execução no Emulador:** Selecione o dispositivo do relógio no seletor de target e clique em **Run ▶** (usando o JBR do Android Studio);
3. **Casos a Validar no Relógio:**
   - Mensagem *"Procurando celular…"* transita para *"Celular conectado"* quando pareado;
   - Lista vazia exibe texto explicativo amigável;
   - O botão `EdgeButton` (*Atualizar*) na curvatura inferior força a checagem da conexão;
   - O toque em um lembrete altera o texto para *"Concluído ✓"* e desabilita o botão para evitar toques acidentais.

### C. Teste de Sincronização Ponta a Ponta (Celular ↔ Relógio)
1. Inicie o `MobileAPP` no celular:
   ```powershell
   cd MobileAPP
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
   npx expo run:android --device Pixel_10_Pro
   ```
2. **Fluxo Celular → Relógio:**
   - Adicione um lembrete na tela inicial do celular;
   - O item deve surgir na tela do relógio quase instantaneamente via path `/lembri/lembrete`.
3. **Fluxo Relógio → Celular:**
   - Toque no lembrete na tela do relógio;
   - O aplicativo do relógio envia mensagem via path `/lembri/confirmacao`;
   - O aplicativo do celular atualiza a store Zustand e exibe o selo *"Concluído no relógio ✓"*.

---

## 6. Diagnóstico e Depuração com Logcat no Android Studio

Na aba **Logcat** do Android Studio, filtre os eventos do relógio para confirmar a integridade das mensagens trocadas:

```
tag:LembriWearListener | tag:CelularDataSource
```

Eventos esperados no Logcat:
* `LembriWearListener: Mensagem recebida: /lembri/lembrete`
* `CelularDataSource: Mensagem enviada com sucesso para node: <node_id>`
