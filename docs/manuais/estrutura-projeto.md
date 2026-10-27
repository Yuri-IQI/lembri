# Estrutura do Projeto — Lembri

Este documento descreve a organização física de pastas e arquivos do repositório **Lembri**.

---

## 1. Visão Geral da Raiz

```
lembri/
├── MobileAPP/          # Aplicativo para smartphone (React Native + Expo SDK 58 + Zustand)
├── WearableAPP/        # Aplicativo para relógio (Kotlin + Compose for Wear OS)
├── .agents/            # Skills de IA e referências de engenharia (principios, plano, etc.)
├── .claude/            # Slash commands do Claude Code
├── docs/               # Manuais técnicos, planos SDD, revisões e scripts de automação
├── AGENTS.md           # Diretrizes gerais mandatórias para agentes de IA
├── README.md           # Guia de introdução rápida e setup dos emuladores
└── .gitignore          # Arquivos e pastas ignorados pelo controle de versão
```

---

## 2. Estrutura do Aplicativo Mobile (`MobileAPP/`)

```
MobileAPP/
├── assets/             # Ícones SVG, splash screens e imagens institucionais
│   ├── bottom-bar/     # Ícones da barra inferior (home.svg, task.svg, bell.svg, settings.svg)
│   ├── icon/           # Ícones do aplicativo para Android/iOS
│   └── splash/         # Telas de splash
├── modules/            # Módulos nativos Expo Continuous Native Generation (CNG)
│   └── wear-connector/ # Módulo nativo Android para o Google Play Services Wearable
├── plugins/            # Config plugins do Expo para build nativo (CMake, Gradle, Keystore)
├── scripts/            # Scripts utilitários de manutenção (reset-project.js)
├── src/                # Código-fonte principal em TypeScript
│   ├── app/            # Rotas e telas gerenciadas pelo Expo Router
│   │   ├── (tabs)/     # Abas principais (index.tsx, lembretes.tsx, exercicios.tsx, configuracoes.tsx)
│   │   └── _layout.tsx # Root layout da aplicação
│   ├── components/     # Componentes visuais reutilizáveis
│   │   ├── app-bar/    # TopBar e BottomBar
│   │   ├── themed-text.tsx  # Tipografia consistente
│   │   ├── themed-view.tsx  # Superfícies e Card
│   │   ├── main-container.tsx # Container com safe area
│   │   └── splash.tsx  # Tela de inicialização animada
│   ├── constants/      # Constantes e tokens de design (theme.ts)
│   ├── hooks/          # Custom hooks React (useTheme, useWear)
│   ├── stores/         # Gerenciamento de estado global com Zustand
│   ├── mocks/          # Fixtures e geradores de dados mockados
│   ├── services/       # Serviços e adaptadores (wear/wear-service.ts, contrato.ts)
│   └── types/          # Definições de tipos e interfaces TypeScript
├── app.json            # Configuração do Expo (nome, slug, versão, plugins)
├── package.json        # Dependências e scripts do Node.js
└── tsconfig.json       # Configurações do compilador TypeScript
```

---

## 3. Estrutura do Aplicativo Wearable (`WearableAPP/`)

```
WearableAPP/
├── app/
│   ├── src/main/
│   │   ├── java/com/borabill/lembriwearable/
│   │   │   ├── data/          # DataSource e comunicação com Wearable Data Layer
│   │   │   ├── presentation/  # Telas e UI com Jetpack Compose for Wear OS
│   │   │   └── theme/         # Cores e tipografia do Wear OS
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts       # Configurações do módulo Wear OS
└── build.gradle.kts           # Configurações do Gradle da raiz do wearable
```
