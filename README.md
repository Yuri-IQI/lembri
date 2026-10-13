# Lembri: celular + relógio

Dois apps que conversam pela **Wearable Data Layer API** (Google Play Services):

| Pasta          | Tecnologia                          | Papel                                        |
|----------------|-------------------------------------|----------------------------------------------|
| `MobileAPP/`   | Expo (React Native) + módulo nativo | Cria lembretes e envia ao relógio            |
| `WearableAPP/` | Kotlin + Compose for Wear OS        | Exibe lembretes e confirma quando concluídos |

## Exemplo implementado

```
Celular                                         Relógio
───────                                         ───────
[Enviar ao relógio] ── /lembri/lembrete ──────▶ LembriWearListenerService
                         {id, titulo, horario}        │
                                                      ▼
                                                LembreteRepository ─▶ tela atualiza
                                                      │
Lembrete "Concluído ✓" ◀── /lembri/confirmacao ── toque no lembrete
                         {lembreteId, concluidoEm}
```

## Arquitetura

### Contrato compartilhado
O "idioma" entre os apps (paths, capabilities, JSON) fica definido em **dois arquivos espelhados**:

- `WearableAPP/.../data/comunicacao/ContratoComunicacao.kt` (+ `data/model/Lembrete.kt`)
- `MobileAPP/src/services/wear/contrato.ts`

Mudou um? Mude o outro.

### MobileAPP (camadas)
```
src/app/index.tsx                 Tela: só usa o hook
src/hooks/use-wear.ts             Estado React (relógios, lembretes enviados)
src/services/wear/
  ├─ contrato.ts                  Paths, capabilities e tipos
  └─ wear-service.ts              Regras: monta JSON, envia, filtra respostas
modules/wear-connector/           Módulo nativo Expo (Kotlin), transporte genérico
  ├─ index.ts                     API JS tipada (null no iOS/web/Expo Go)
  └─ android/.../WearConnectorModule.kt   MessageClient + CapabilityClient
plugins/with-shared-debug-keystore.js     Alinha a assinatura de debug com o relógio
```

### WearableAPP (MVVM + repositório)
```
LembriWearApplication.kt          Cria o AppContainer (DI manual)
di/AppContainer.kt                Instâncias únicas compartilhadas
data/comunicacao/
  ├─ ContratoComunicacao.kt       Paths e capabilities
  ├─ CelularDataSource.kt         Envia mensagens ao celular
  └─ LembriWearListenerService.kt Recebe mensagens (mesmo com o app fechado)
data/model/Lembrete.kt            Modelos + JSON
data/repository/LembreteRepository.kt   Fonte única da verdade (StateFlow)
presentation/
  ├─ MainActivity.kt              Liga ViewModel → tela
  ├─ LembretesViewModel.kt        UiState + ações
  └─ LembretesScreen.kt           UI stateless (com preview)
```

## Requisitos para a comunicação funcionar

1. **Mesmo `applicationId`** nos dois apps: `com.borabill.lembriwearable`
   (`WearableAPP/app/build.gradle.kts` e `android.package` em `MobileAPP/app.json`).
2. **Mesma chave de assinatura.** Em debug, o plugin `with-shared-debug-keystore`
   faz o Expo usar `~/.android/debug.keystore`, a mesma do Android Studio.
   Em release, configure a mesma keystore nos dois projetos.
3. **Capabilities** declaradas em `res/values/wear.xml` de cada lado
   (`lembri_mobile` no celular, `lembri_wear` no relógio).
4. O app mobile precisa de um **development build**. O Expo Go não inclui módulos nativos customizados.

## Como rodar

1. Crie no Android Studio um emulador de celular (com Google Play) e um emulador Wear OS,
   e pareie os dois (Device Manager → *Pair Wearable*). Também funciona com aparelhos reais.
2. Relógio: abra `WearableAPP/` no Android Studio e rode no emulador Wear OS.
3. Celular:
   ```bash
   cd MobileAPP
   npm install
   npx expo run:android
   ```
   O `run:android` gera a pasta `android/` (prebuild) e aplica o plugin de assinatura.
   Se você mudar `app.json` ou o plugin, rode `npx expo prebuild -p android --clean`.
4. No celular, digite um lembrete e toque em **Enviar ao relógio**. No relógio, toque no
   lembrete; o celular mostra **Concluído ✓**.

## Próximos passos sugeridos

- **Persistência**: trocar o `MutableStateFlow` do `LembreteRepository` por Room/DataStore
  e o `useState` do `use-wear.ts` por `expo-sqlite`.
- **Sincronizar estado** (não só eventos): usar `DataClient` (DataItems), que entrega mesmo
  se o outro lado estiver offline no momento do envio. `MessageClient` é "dispare e esqueça".
- **Receber no celular com o app fechado**: criar um `WearableListenerService` dentro do
  módulo `wear-connector` (hoje o celular só ouve enquanto a tela está aberta).
- **iOS**: Apple Watch não usa Wear OS; exigiria um app watchOS + WatchConnectivity.
