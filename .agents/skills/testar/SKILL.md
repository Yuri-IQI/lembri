---
name: testar
description: >
  Executa e valida a bateria de testes funcionais, responsividade mobile,
  stores Zustand com dados mockados, acessibilidade WCAG 2.2 Nível AAA (TouchTarget = 56dp, contraste 7:1)
  e integração ponta a ponta com o relógio Wear OS no Android Studio (emuladores pareados Phone + Wearable).
  Use quando o usuário pedir /testar ou solicitar a verificação prática de uma funcionalidade.
argument-hint: "[nome da branch, chave da issue ou vazio para testar a branch atual]"
license: MIT
---

# Testar Aplicativo no Ambiente Mobile & Wearable — Projeto Lembri

Valida as funcionalidades do ecossistema **Lembri** (aplicativo mobile em React Native com Expo SDK 58 e Zustand + aplicativo do relógio em Kotlin / Jetpack Compose for Wear OS), executando pré-auditoria estática, testes de stores Zustand, testes interativos nos **emuladores pareados do Android Studio** e auditoria estrita de acessibilidade mobile (**WCAG 2.2 Nível AAA**).

---

## Argumentos (`$ARGUMENTS`)

`$ARGUMENTS` pode ser:
- A chave da tarefa (ex: `LEMBRI-10`);
- O nome da branch da tarefa (ex: `feat/lembretes-zustand`);
- Vazio: utiliza a branch atual (`git branch --show-current`).

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** Antes de executar os testes ou julgar o comportamento de uma tela ou store, leia e aplique obrigatoriamente **`.agents/skills/principios/SKILL.md`** e as referências `acessibilidade.md`, `ui-componentes.md`, `ux-fluxo.md`, `dados.md` e `camadas.md`. Aplique a **Regra da Dúvida** (não assuma comportamentos divergentes em silêncio).

---

### Passo 1 — Executar Validações Estáticas e Pré-Auditoria

No terminal, execute as checagens estáticas do projeto:
```powershell
cd MobileAPP
npx expo lint
npx tsc --noEmit
cd ..
node docs/scripts/lembri-check.mjs
```
Todos os erros de tipo ou linter devem ser resolvidos antes de testar em tela.

---

### Passo 2 — Testar Stores do Zustand e Mocks

Valide o comportamento das stores de itens e seletores:
1. **Adição de itens:** Garanta que a inclusão gera um novo ID único e atualiza o estado de forma imutável.
2. **Alternância de status (Toggle):** Verifique se o status do item transita corretamente entre pendente e concluído.
3. **Remoção:** Confirme que a exclusão remove apenas o item desejado e oferece mecanismo de reversão (*Undo*).
4. **Filtros e Seletores:** Teste se os seletores retornam a lista filtrada correta para `'todos'`, `'pendentes'` e `'concluidos'`.
5. **Reset para Mocks:** Valide se a ação `resetarParaMocks()` restaura as fixtures originais de `src/mocks/`.

---

### Passo 3 — Teste no Android Studio: Configuração dos Emuladores Pareados

O teste da solução completa exige dois emuladores rodando e pareados via **Android Studio**:

#### 1. Preparação dos AVDs no Device Manager do Android Studio:
* **Celular:** AVD com imagem **Google Play** (ex: `Pixel_10_Pro`, API 37, x86_64).
  > A imagem do celular *precisa* conter a Play Store para permitir a instalação do companion app (**Pixel Watch** ou **Wear OS by Google**).
* **Relógio:** AVD Wear OS (ex: `Wear_OS_Small_Round`, API 37, x86_64).

#### 2. Pareamento no Android Studio:
1. Abra o **Device Manager** no Android Studio e ligue ambos os emuladores;
2. Clique nos três pontos (`⋮`) ao lado de `Wear_OS_Small_Round` e selecione **Pair Wearable**;
3. Selecione o celular `Pixel_10_Pro` e conclua o fluxo do app companion na tela do celular;
4. Verifique no terminal se ambos aparecem como dispositivos conectados:
   ```powershell
   & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices -l
   ```
   (O celular aparece como `sdk_gphone...` e o relógio como `sdk_gwear...`).

---

### Passo 4 — Teste Isolado do Aplicativo do Relógio (`WearableAPP`)

1. **Testes de Preview no Android Studio:**
   * Abra a pasta `WearableAPP/` no Android Studio;
   * Abra `LembretesScreen.kt` e confira a aba **Split / Design** para inspecionar os previews `@WearPreviewDevices` nos diferentes formatos de relógio (Small Round, Large Round e Square).
2. **Execução no Emulador Wear OS:**
   * No Android Studio, selecione o dispositivo `Wear_OS_Small_Round` no dropdown superior e clique em **Run ▶** (ou via terminal com o JBR: `cd WearableAPP; .\gradlew.bat :app:installDebug`);
   * **Cenários a Validar no Relógio:**
     * *Sem celular conectado:* Exibe texto central *"Procurando celular…"*;
     * *Com celular conectado:* Exibe *"Celular conectado"*;
     * *Lista vazia:* Exibe mensagem explicativa *"Nenhum lembrete. Envie um pelo celular."*;
     * *Botão inferior (EdgeButton):* O botão curvo *"Atualizar"* na borda inferior dispara nova busca de nós pareados.

---

### Passo 5 — Teste de Integração Ponta a Ponta: Celular ↔ Relógio

Execute o `MobileAPP` no celular emulado:
```powershell
cd MobileAPP
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
npx expo run:android --device Pixel_10_Pro
```

#### Roteiro de Verificação da Sincronização:
1. **Reconhecimento Mútuo:**
   * No celular: o card superior exibe `"Conectado: Wear OS Small Round"`;
   * No relógio: o status exibe `"Celular conectado"`.
2. **Disparo Celular → Relógio (Path `/lembri/lembrete`):**
   * Digite o título de um lembrete no celular e toque em **Enviar ao relógio**;
   * O input de texto limpa imediatamente e a mensagem *"Enviado para 1 relógio"* aparece;
   * No relógio, o novo card surge instantaneamente no topo da lista com o título e o horário formatado.
3. **Conclusão no Pulso → Celular (Path `/lembri/confirmacao`):**
   * Toque no card do lembrete na tela do relógio;
   * No relógio: o texto secundário transita imediatamente para `"Concluído ✓"` e o botão se torna desabilitado;
   * No celular: o status do item na lista transita em tempo real para `"Concluído no relógio ✓"`.
4. **Inspeção de Logs no Android Studio Logcat:**
   * Abra a aba **Logcat** no Android Studio, selecione o emulador do relógio e filtre por tags:
     ```
     tag:LembriWearListener | tag:CelularDataSource
     ```
   * Confirme os eventos de recebimento de JSON e envio de confirmação com timestamp.

---

### Passo 6 — Auditoria de Acessibilidade Mobile (WCAG 2.2 Nível AAA)

Tanto no celular quanto no relógio, valide os critérios mandatórios AAA:
1. **Contraste Aprimorado (1.4.6):** Relação mínima de 7:1 para texto normal e 4.5:1 para títulos;
2. **Alvo de Toque Aprimorado (2.5.5):** Mínimo de 44×44dp no celular (com recomendação `TouchTarget = 56`) e largura total no relógio;
3. **Rótulos Autônomos (2.4.9):** `accessibilityLabel` descritivo completo em todos os botões e ícones clicáveis;
4. **Prevenção de Erros (3.3.6):** Ações de exclusão de dados possuem mecanismo de reversão (*Undo* de 5-10s) ou confirmação explícita;
5. **Sem Limite de Tempo Inflexível (2.2.3):** Ausência de timers regressivos que descartem tarefas;
6. **Apresentação Visual (1.4.8):** Texto alinhado à esquerda, sem texto justificado, entrelinha >= 1.5;
7. **Navegação TalkBack:** Ative o leitor de tela TalkBack nas configurações de acessibilidade do emulador do celular e confira a ordem do cursor e anúncios de voz.

---

### Passo 7 — Relatório dos Testes

Apresente um resumo claro com:
1. Cenários testados no emulador do celular e no emulador do relógio;
2. Status da sincronização Wearable Data Layer API (envio e confirmação);
3. Conformidade de acessibilidade (WCAG 2.2 Nível AAA);
4. Assinatura de princípios: `[código/plano] → [princípio que guiou] · dúvidas: 1) ... 2) ...`.
