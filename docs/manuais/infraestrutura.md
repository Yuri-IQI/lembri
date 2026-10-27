# Infraestrutura Mobile — Projeto Lembri

Este documento detalha os componentes de infraestrutura de desenvolvimento e empacotamento do ecossistema **Lembri**.

---

## 1. Stack de Infraestrutura Mobile

- **Bundler:** Metro Bundler (iniciado via `npx expo start`), responsável pela compilação do JavaScript/TypeScript e Hot Module Replacement (Fast Refresh).
- **Continuous Native Generation (CNG):** O diretório nativo `android/` é gerado ou sincronizado automaticamente a partir do `app.json` e dos plugins de configuração (`plugins/`), garantindo que o repositório permaneça limpo de código nativo gerado.
- **Módulo Nativo Local (`modules/wear-connector`):** Módulo Expo nativo integrado que encapsula as chamadas da API do Google Play Services (`com.google.android.gms:play-services-wearable`).
- **Nuvem de Build (EAS):** Expo Application Services utilizado para geração de artefatos APK e AAB em ambiente seguro e padronizado na nuvem.

---

## 2. Pontes de Comunicação (ADB Bridge)

Para o celular comunicar-se com o relógio nos emuladores locais:
- O Google Play Services roteia as mensagens através do socket de depuração do Android (`ADB`).
- Comando de verificação de conexão entre dispositivos pareados:
  ```powershell
  & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices -l
  ```
- O tráfego de dados entre o celular e o relógio utiliza a **Wearable Data Layer API** sob os nós de rede virtuais criados pelo emulador.
