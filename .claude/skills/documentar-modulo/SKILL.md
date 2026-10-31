---
name: documentar-modulo
description: >
  Gera ou atualiza a documentação funcional e técnica em HTML de um módulo do
  aplicativo Lembri em docs/modulos/<CHAVE_MODULO>.html seguindo o template
  docs/modulos/EXEMPLO_MODULO.html. Use quando o usuário pedir /documentar-modulo ou
  solicitar a criação/atualização da documentação de um módulo (LEMBRETES, EXERCICIOS,
  WEAR_CONNECTOR, CONFIGURACOES, STORES_MOCKS).
argument-hint: "[chave ou nome do módulo: LEMBRETES, EXERCICIOS, WEAR_CONNECTOR, CONFIGURACOES, STORES_MOCKS]"
license: MIT
---

# Documentar Módulo — Projeto Lembri

Gera ou atualiza o arquivo `docs/modulos/<CHAVE_MODULO>.html` com a documentação funcional e técnica completa de um módulo do **Lembri** (MobileAPP React Native Expo + Wear OS), seguindo rigorosamente a estrutura de `docs/modulos/EXEMPLO_MODULO.html`.

> **A análise cobre Telas Expo Router, Componentes Visuais, Stores Zustand, Mocks e Conexão Wearable.** A documentação consolida fluxos de tela em `src/app/`, componentes em `src/components/`, estado global nas stores Zustand (`src/stores/`), contratos de sincronização com relógio em `src/services/wear/`, acessibilidade mobile (**WCAG 2.2 AAA**) e fixtures em `src/mocks/`.
>
> **Formato de saída: exclusivamente HTML.** Não gere arquivos intermediários `.md` dentro de `docs/modulos/`.

---

## Argumentos

`$ARGUMENTS` pode ser:
- A chave ou o nome do módulo listado em `docs/manuais/modulos.md` (ex: `LEMBRETES`, `EXERCICIOS`, `WEAR_CONNECTOR`, `CONFIGURACOES`, `STORES_MOCKS`).
- Vazio: consulte `docs/manuais/modulos.md` e pergunte ao desenvolvedor qual módulo deseja documentar.

---

## Instruções de Execução

### Passo 0 — Pré-Condição Inegociável: Carregar e Obedecer a Skill `principios` (Bloqueante)

> **REGRA DE BLOQUEIO:** Antes de documentar qualquer módulo, leia e aplique obrigatoriamente **`.claude/skills/principios/SKILL.md`** e as referências `camadas.md`, `dados.md`, `ui-componentes.md` e `acessibilidade.md`. Respeite a **Regra da Dúvida** (nunca invente comportamentos não suportados pelo código).

---

### Passo 1 — Identificar o Módulo e Mapear o Codebase

1. Leia `docs/manuais/modulos.md` para identificar o escopo oficial do módulo correspondente a `$ARGUMENTS`.
2. Execute o mapeador estático do repositório para inspecionar telas, stores, componentes e mocks:
   ```bash
   node docs/scripts/mapa-codigo.mjs
   ```

---

### Passo 2 — Mapear as Camadas do Módulo

1. **Rotas e Telas (`MobileAPP/src/app/`):**
   - Identifique as telas que compõem o módulo, parâmetros de rota e hierarquia de navegação no Expo Router.
2. **Componentes e Acessibilidade (`MobileAPP/src/components/`):**
   - Mapeie os componentes visuais, uso de tokens de `theme.ts`, alvos de toque (`TouchTarget = 56`) e suporte a TalkBack/VoiceOver.
3. **Gerenciamento de Estado (`MobileAPP/src/stores/`):**
   - Extraia o estado, ações imutáveis e seletores otimizados do Zustand.
4. **Camada de Mocks (`MobileAPP/src/mocks/`):**
   - Documente as fixtures e cenários de teste suportados.
5. **Integração com Relógio (se aplicável, `MobileAPP/src/services/wear/`):**
   - Registre os contratos de mensagens trafegadas pela Wearable Data Layer API.

---

### Passo 3 — Gerar o Documento HTML

Execute o gerador de esqueleto para o módulo:
```bash
node docs/scripts/gerar-esqueleto.mjs modulo LEMBRETES --titulo "Módulo de Lembretes"
```
Preencha as seções no arquivo HTML em `docs/modulos/<CHAVE_MODULO>.html`:
1. **Visão Geral e Propósito do Módulo**
2. **Fluxos de Usuário e Telas (Expo Router)**
3. **Arquitetura de Estado e Stores Zustand**
4. **Catálogo de Componentes e Tokens Visuais**
5. **Acessibilidade Mobile (WCAG 2.2 AAA)**
6. **Massa de Dados Mockados e Casos de Teste**
7. **Integração com Wearable (se aplicável)**

---

### Passo 4 — Exibir no Navegador e Apresentar Conclusão

Abra o arquivo HTML no navegador:
```powershell
Start-Process "docs\modulos\LEMBRETES.html"
```
Apresente o resumo ao desenvolvedor com a assinatura canônica de `principios`:
`[código/plano] → [princípio que guiou] · dúvidas: 1) ... 2) ...`
