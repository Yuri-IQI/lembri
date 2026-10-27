# Ambiente de Desenvolvimento — Projeto Lembri (Mobile & Wearable)

Este documento descreve a configuração e operação do ambiente de desenvolvimento do **Lembri**, composto pelo aplicativo mobile para smartphone (**MobileAPP** em React Native com Expo) e pelo aplicativo companheiro para relógio (**WearableAPP** em Kotlin com Compose for Wear OS).

---

## 1. Pré-requisitos

| Ferramenta | Finalidade | Requisito / Versão |
|---|---|---|
| **Node.js** | Runtime para o Metro bundler e scripts do MobileAPP | Versão 20+ (LTS) |
| **Android Studio + SDK** | Compilação nativa, emuladores e platform-tools (ADB) | Com Android SDK Platform 34+ e Imagens de Emulador |
| **JDK 17** | Compilação do app React Native Android (`MobileAPP`) | JDK 17 obrigatório (versões 24+ causam incompatibilidade) |
| **JBR (Android Studio)** | Compilação do `WearableAPP` (relógio Wear OS) | Já incluído na instalação do Android Studio |
| **AVD Celular** | Emulador do smartphone | Imagem com Google Play Services (ex: `Pixel_10_Pro`) |
| **AVD Relógio** | Emulador do relógio inteligente | Imagem Wear OS (ex: `Wear_OS_Small_Round`) |

---

## 2. Instalação e Preparação

Clone o repositório e instale as dependências JavaScript do aplicativo móvel:

```powershell
cd MobileAPP
npm install
cd ..
```

---

## 3. Inicialização dos Emuladores Android e Pareamento

Abra dois emuladores (celular e relógio). No PowerShell:

```powershell
# 1. Iniciar o emulador do celular
Start-Process "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd","Pixel_10_Pro"

# 2. Iniciar o emulador do relógio Wear OS
Start-Process "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -ArgumentList "-avd","Wear_OS_Small_Round"
```

Verifique os identificadores seriais atribuídos pelo ADB:
```powershell
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices -l
```
*(O relógio geralmente é identificado como `emulator-5556` e o celular como `emulator-5554`)*.

---

## 4. Executando o Aplicativo Mobile (`MobileAPP`)

O `MobileAPP` é o foco principal de desenvolvimento (React Native com Expo SDK 58, Zustand e dados mockados).

No terminal exclusivo do MobileAPP:
```powershell
cd MobileAPP
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17" # Ajuste para seu caminho do JDK 17
```

### A. Para Desenvolvimento Diário (apenas JS/TS e Front-end com dados mockados):
```powershell
npx expo start --dev-client
```
Pressione `a` para abrir no emulador Android já aberto. O Hot Reload (Fast Refresh) atualizará a tela instantaneamente a cada salvamento.

### B. Para Compilar o Build Nativo (quando alterar plugins, app.json ou módulos nativos):
```powershell
npx expo run:android --device Pixel_10_Pro
```

---

## 5. Executando o Aplicativo Wearable (`WearableAPP` — Opcional)

Se for testar a sincronização física via Wearable Data Layer API:

Em um terminal separado:
```powershell
cd WearableAPP
$env:JAVA_HOME = "$env:LOCALAPPDATA\Programs\Android Studio\jbr"
$env:ANDROID_SERIAL = "emulator-5556" # Serial do emulador do relógio
.\gradlew.bat :app:installDebug
& "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" shell am start -n com.borabill.lembriwearable/.presentation.MainActivity
```
*(Ou abra a pasta `WearableAPP/` diretamente no Android Studio e clique no botão verde **Run** com o relógio selecionado)*.

---

## 6. Comandos Úteis de Diagnóstico

```powershell
cd MobileAPP
npx expo lint               # Executa o linter oficial do Expo
npx tsc --noEmit            # Checagem estrita de tipos TypeScript
npx expo-doctor             # Diagnostica problemas de compatibilidade de dependências
npx expo install --fix      # Corrige versões incompatíveis de dependências com o SDK
```
