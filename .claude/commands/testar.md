---
description: Testar telas, stores Zustand, mocks, responsividade mobile, integração com Wearable no Android Studio e acessibilidade WCAG 2.2 AAA
argument-hint: "[nome da branch, chave da issue ou vazio para testar a branch atual]"
---

Carregue e aplique a skill canônica `.agents/skills/principios/SKILL.md` (e suas referências) e execute o fluxo da skill `.agents/skills/testar/SKILL.md`.

Execute as checagens estáticas (`npx expo lint`, `npx tsc --noEmit`), valide o comportamento das stores Zustand com dados mockados, teste a navegação nos emuladores pareados do Android Studio (celular Pixel e relógio Wear OS via Metro e Run ▶), valide a sincronização bidirecional de mensagens via Wearable Data Layer API e audite os 5 estados visuais e acessibilidade WCAG 2.2 AAA.

Contexto / Argumentos da solicitação:
$ARGUMENTS
