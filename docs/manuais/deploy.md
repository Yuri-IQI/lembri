# Deploy e Distribuição — Projeto Lembri (Mobile & Wearable)

Este documento descreve os fluxos de build, distribuição e publicação do aplicativo mobile **Lembri** através do **EAS (Expo Application Services)** e compilação nativa.

---

## 1. Visão Geral da Distribuição

O ecossistema Lembri é composto por:
- **MobileAPP (React Native / Expo):** Distribuído para smartphones Android via APK de teste (Preview) e pacote AAB (Android App Bundle) para a Google Play Store. Atualizações rápidas de JS/TS podem ser enviadas via OTA (Over-The-Air) com EAS Update.
- **WearableAPP (Wear OS):** Aplicativo companheiro em Kotlin compilado para Wear OS e distribuído na mesma faixa de lançamento da Play Store.

---

## 2. Configuração do EAS (Expo Application Services)

O projeto utiliza o EAS CLI para gerenciar builds na nuvem:

```bash
# Instalação do EAS CLI
npm install -g eas-cli

# Autenticação na conta Expo
eas login
```

O arquivo de configuração `MobileAPP/eas.json` define os perfis de build:
- **`development`:** Build nativo com dev-client habilitado para desenvolvimento local e depuração no emulador.
- **`preview`:** Gera APK instalável diretamente no celular de testers sem precisar da Google Play Store.
- **`production`:** Gera AAB otimizado e assinado para submissão à Google Play Console.

---

## 3. Comandos de Build

### Gerar APK de Teste (Preview Android):
```bash
cd MobileAPP
eas build --platform android --profile preview
```

### Gerar Pacote de Produção (AAB):
```bash
cd MobileAPP
eas build --platform android --profile production
```

### Publicar Atualização Rápida (OTA Update):
Para correções que envolvem apenas JavaScript, TypeScript, estilos ou dados mockados (sem alteração em módulos nativos ou `app.json`):
```bash
cd MobileAPP
eas update --branch production --message "Atualizacao de dados mockados e correcao de UI"
```

---

## 4. Build Nativo Local no Host

Caso prefira compilar o APK localmente sem utilizar a nuvem do Expo:
```powershell
cd MobileAPP
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
npx expo run:android --variant release
```
O arquivo APK gerado ficará disponível em `MobileAPP/android/app/build/outputs/apk/release/`.
