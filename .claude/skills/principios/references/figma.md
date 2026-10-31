# Figma — Fonte Visual do Lembri (`lembri_proto`)

Material de consulta da skill `principios`, par de `ui-componentes.md`. Este arquivo diz **o que o protótipo
desenha** (telas, medidas, cores, textos, ícones); `ui-componentes.md` diz **como isso vira código** no projeto.
Leia antes de criar ou alterar qualquer tela que tenha frame no Figma.

> **Regra de precedência:** o Figma define a aparência (cores de fundo, tamanhos de fonte, pesos, raios,
> ícones, textos). Quando uma medida do Figma violar a acessibilidade WCAG 2.2 AAA de `acessibilidade.md`
> (contraste, entrelinha, alvo de toque), **a acessibilidade vence** e o desvio fica registrado na seção 6.
> Não "corrija" o código de volta para o valor do Figma nesses casos.

---

## 1. Arquivo e acesso

- **Arquivo:** `lembri_proto` — <https://www.figma.com/design/Wmxfr3VnYjHLZtHgbyHhQZ/lembri_proto>
- **fileKey:** `Wmxfr3VnYjHLZtHgbyHhQZ` · página única `0:1` · frames de **412 × 917** (Android compacto).
- **Acesso pelo Claude:** conector do Figma (MCP). Antes de `get_design_context`, carregue a skill
  `figma:figma-design-to-code`. Sempre peça o frame pelo `nodeId` da tabela abaixo.
- O arquivo quase não usa **variáveis** do Figma (só `#1E1E1E` para ícones e `#1D1B20` do Material 3):
  os valores vêm soltos nos nós. Por isso os tokens consolidados estão aqui e em `theme.ts`.

### Frames (telas)

| Frame | nodeId | Tela / rota | Cartão do Trello |
|---|---|---|---|
| `inicial` | `77:1153` | Abertura (splash) | Criar splash screen |
| `home` | `77:1348` | `(tabs)/index` | Home unificada com Lembretes |
| `lembretes` | `77:1159` | `(tabs)/lembretes` | Lista de lembretes e estado vazio |
| `lembretes nao encontrados` | `77:1225` | `(tabs)/lembretes` (vazio) | Lista de lembretes e estado vazio |
| `detalhe lembrete` | `79:868` | Detalhe do lembrete | Detalhe do lembrete |
| `criar lembrete` | `77:1233` | Criar/editar lembrete | Criar/editar lembrete com templates |
| `criar tipo de lembrete` | `79:1135` | Tipos de lembrete | Tipos de lembrete |
| `exercicios_lista` | `31:1667` | `(tabs)/exercicios` | Lista de exercícios |
| `exercicios_detalhe` | `31:1736` | Detalhe do exercício | Detalhe do exercício |
| `exercicios_preview` | `31:1776` | Memorização | Criar fluxo de exercício |
| `exercicios_exec` | `31:1928` | Resposta | Criar fluxo de exercício |
| `exercicios_res_err` | `31:1996` | Correção após erro | Criar fluxo de exercício |
| `exercicios_review` | `31:1847` | Resumo da execução | Resumo de execução |
| `Android Compact - 7` | `80:1860` | `(tabs)/configuracoes` | Ajustes e dispositivos |
| `Android Compact - 10` | `102:1379` | Ajustes com dispositivos expandidos | Ajustes e dispositivos |
| `Android Compact - 9` | `99:1282` | Ajuda | Ajuda |

---

## 2. Cores do protótipo → tokens

| Uso no Figma | Hex | Token em `theme.ts` |
|---|---|---|
| Texto principal, botão primário, toggle ligado | `#000000` | `Colors.text`, `Colors.primary` |
| Texto do botão primário | `#FFFFFF` | `Colors.onPrimary` |
| Fundo das telas | `#F2F2F2` | `Colors.background` |
| Cards, top bar, bottom bar | `#FFFFFF` | `Colors.surface` |
| Rótulos de seção (PRÓXIMO LEMBRETE, HORÁRIOS…) | `#4E4E4E` | `Colors.textSecondary` |
| Contorno de cards, pílulas do topo, listas de ajustes | `#949494` | `Colors.border` |
| Divisória dentro de card | `#D0D0D0` | `Colors.borderSubtle` |
| Borda de etiqueta | `#D2D2D2` | `Colors.divider` |
| Chip de horário selecionado, borda de chip e toggle | `#CCCCCC` | `Colors.chipSelected` |
| Miolo do ícone da aba ativa | `#DADADA` | `Colors.tabActive` |
| Degradê do card "Próximo lembrete" | `#EAE28A` → `#FFFFFF` | `Colors.accent` (+ `Colors.surface`) |
| Sino do lembrete, círculo do logo | `#EAE28A` | `Colors.accent` |
| Preto do logo e círculo do sino | `#1A1A1A` | `Colors.brand` |
| Ícones (Simple Design System) | `#1E1E1E` | `Colors.text` (diferença imperceptível) |
| Etiqueta "Tarefa Doméstica" | `#D5EA9B` | `Colors.tag` |
| Etiqueta "Saúde" | `#FF8181` | **ainda não existe** — criar token (ex.: `tagHealth`) ao implementar tipos |
| Fundo de input | `#F9F9F9` | **ainda não existe** — criar token (ex.: `inputBackground`) |
| Fundo da busca | `#FAFAFA` | usar o mesmo token de input |
| Borda tracejada "Novo Tipo" | `#787878` | **ainda não existe** — criar token ao implementar tipos |
| Subtítulos e descrições cinza | `#5E5E5E`, `#656565`, `#555555` | **não usar** → `Colors.textSecondary` (seção 6) |
| Placeholder | `#9E9E9E` | **não usar** → ver seção 6 |
| Botão desabilitado | `#9C9C9C` (texto branco) | **não usar** → ver seção 6 |

Cor nova só entra em `theme.ts`, com nome por função (não por cor). Nunca hexadecimal solto em componente.

---

## 3. Tipografia (Inter)

O Figma usa **Inter** em tudo, exceto o logo "LEMBRI!" (EB Garamond, vem pronto no SVG
`assets/splash/splash-logo.svg`) e o "18:00" do card de próximo lembrete (IBM Plex Sans Devanagari —
**use Inter Regular**, a fonte não está embutida). Pesos usados: 400, 500, 600, 700, 800.

| Papel | Figma (tamanho / peso) | Exemplo |
|---|---|---|
| Horário em destaque | 64 / Regular | "18:00" no card de próximo lembrete |
| Título do card destaque e "Hoje, 18:00" | 36 / Bold | "Lavar roupas" no card amarelo |
| Título da top bar | 32 / ExtraBold (800) | "Lembretes", "Ajustes" |
| Título de tela e de abertura | 32 / ExtraBold ou Bold | "Seus Lembretes", "Bem Vindo ao Lembri!" |
| Título de card de lembrete / rótulo de formulário | 24 / Bold ou ExtraBold | "Lavar roupas", "Titulo", "Horário" |
| Texto de botão grande | 24–32 / Bold | "Editar", "SALVAR", "Ver" |
| Corpo, itens de ajuste, descrição | 20 / Regular, Medium ou SemiBold | "Domingo e Quinta", "Texto Amplificado" |
| Rótulo de seção (caixa alta) | 16 / SemiBold | "PRÓXIMO LEMBRETE", "ACESSIBILIDADE" |
| Etiqueta de categoria | 16 / SemiBold | "Tarefa Doméstica" |
| Texto de apoio de item | 14–16 / Regular | "Receba notificações…", "HOJE - Há 25 min." |
| Rótulo da bottom bar, chip de horário | 14 / Bold | "Home", "12:00" |
| Meta de exercício | 12 / Regular + Bold | "Última atividade: 2 dias" |

**Entrelinha:** o Figma usa `normal` (~1,2×). No código vale a regra AAA: `lineHeight ≥ 1,5 × fontSize`
em texto corrido (seção 6). Títulos de uma linha podem usar ~1,25×.

---

## 4. Componentes do protótipo

Medidas em dp, frame de 412 de largura, conteúdo com **24** de margem lateral (largura útil 364).

### Top bar — `Frame 1/Variant2` (nó `77:1160`)
- Fundo branco, padding 12, altura ~72.
- Esquerda: seta voltar (ícone `Arrow left`, 24–32). Centro: título 32 ExtraBold.
- Direita: grupo com borda 1 `#949494`, raio 18, padding 8, contendo botões circulares de 32 com borda 1
  `#949494` (Ajuda `?` e Microfone). Na tela Ajuda só aparece o microfone.
- Variante da Home (`77:1350`): título à esquerda e pílulas expandidas "Ajuda"/"Áudio" (ícone + texto 20 Medium).
- **Código:** `components/app-bar/top-bar.tsx`. Alvo de toque dos botões ≥ 48 (seção 6).

### Bottom bar — `bot-bar` (nó `85:416`)
- Fundo branco, altura 80, padding 12×8, 4 itens com gap 32: Home, Exercícios, Lembretes, Ajustes.
- Ícone ~42 + rótulo 14 Bold, gap 4. Aba ativa: miolo do ícone preenchido `#DADADA`.
- **Código:** `components/app-bar/bottom-bar.tsx` + SVGs em `assets/bottom-bar/` (prop `preenchimento`).

### Cards
- **Card padrão:** fundo branco, borda **2** `#949494`, raio **16**, padding 12, gap 8–16.
- **Card de exercício:** igual, mas borda 2 `#CFCFCF` e altura ~169 com linha de botões no rodapé.
- **Card "Próximo lembrete"** (`77:1357`): degradê `linear-gradient(-59.4deg, #EAE28A 18.9%, #FFFFFF 114.5%)`,
  borda 2, raio 16, padding 12, altura ~266; rótulo + "18:00" (64) + título (36) + dia (24 Light) + botão "Ver".
- **Item de lembrete** (`96:879`): fundo branco, borda 2, raio 16, padding 8; ícone 56 (círculo `#1A1A1A`
  com sino `#EAE28A`, asset `assets/home/lembrete-icone.svg`), título 24 Bold, linha 16 (dia em Bold), seta.
- **Lista de ajustes** (`80:1990`): fundo branco, borda **1** `#949494`, raio **8**, linhas com padding
  12×8 separadas por borda inferior 1; título 20 SemiBold + descrição 14 Regular + controle à direita.

### Botões
- **Primário:** fundo preto, texto branco Bold, raio **8** (ações de tela: "Editar", "SALVAR", "+ Novo")
  ou **16** ("Ver"); altura 48–64.
- **Secundário:** fundo branco, borda 1–2 preta, raio 8, texto preto ("DETALHES", "Excluir").
- **Linha de dois botões:** gap 12, cada um `flex: 1`, altura 48 (exercícios).

### Controles
- **Toggle:** 56 × 32, raio 16, ligado = fundo preto + borda 1 `#CCCCCC`, bolinha branca 28.
- **Chip de horário** (`Day-Bubble`): altura 32, raio 19, padding 12×8, texto 14 Bold; selecionado `#CCCCCC`,
  não selecionado branco com borda 1 `#CCCCCC`.
- **Dia da semana:** círculo 38, texto 14 Bold; ativo = preto com texto branco.
- **Etiqueta de categoria:** padding 8×4, raio 12, borda 1 `#D2D2D2`, texto 16 SemiBold.
- **Chip de tipo (formulário):** padding 8, raio 32, borda 2; "Novo Tipo" com borda tracejada `#787878`.
- **Input:** fundo `#F9F9F9`, borda 1 preta, raio 12, padding 12×16, texto 20.
- **Busca:** fundo `#FAFAFA`, raio 16, borda inferior 1 preta, ícone `Search` + "Buscar...".
- **Acordeão (Ajuda):** botão circular 28 com borda 2 preta e ícone `+`/`−`.

### Ícones
Os ícones do Figma vêm do **Simple Design System** (Arrow left, Mic, Plus, Minus, Clock, Edit, Search,
Phone call, Mail, External link) e do **Material 3** (keyboard_arrow). No app, use **`expo-symbols`**
(`SymbolView` com nome Material equivalente) ou o SVG exportado do Figma quando o desenho for próprio
(bottom bar, sino do lembrete, logo). Ícone de exercício: `list-ordered`, `arrow-up-down`, `link`,
`shopping-cart` (44 dentro de área 64).

---

## 5. Fluxo para implementar uma tela a partir do Figma

1. Ache o frame na tabela da seção 1 e carregue a skill `figma:figma-design-to-code`.
2. Chame `get_design_context` com `fileKey` + `nodeId`. O código retornado é React + Tailwind de
   referência: **traduza** para `StyleSheet.create` + tokens; nunca instale Tailwind.
3. Mapeie cada valor para um token (seções 2–3). Valor sem token: pergunte se vira token novo (Regra da Dúvida).
4. Reuse os componentes existentes (`TopBar`, `BottomBar`, `Card`, `ThemedText`, `MainContainer`) antes de criar.
5. **Assets:** as URLs `figma.com/api/mcp/asset/...` expiram em 7 dias — baixe com `curl -L` para
   `MobileAPP/assets/<area>/` e importe o `.svg` como componente. Remova atributos só de web que quebram no
   React Native (ex.: `style="display: block;"` na raiz do SVG). Cores que precisam variar viram prop via
   `.svgrrc` (`replaceAttrValues`).
6. Aplique a seção 6 e confira no emulador lado a lado com o screenshot do Figma.

---

## 6. Desvios intencionais do Figma (acessibilidade vence)

| Figma | No código | Motivo |
|---|---|---|
| Texto cinza `#5E5E5E` / `#656565` / `#555555` | `Colors.textSecondary` `#4E4E4E` | Contraste 5,2–6,7:1 no fundo `#F2F2F2`; AAA exige 7:1 (1.4.6). `#4E4E4E` dá 7,43:1. |
| Placeholder `#9E9E9E` | Placeholder `Colors.textSecondary` **ou** rótulo sempre visível acima do campo | 2,5:1. Placeholder não pode carregar informação. |
| Botão desabilitado `#9C9C9C` com texto branco | Manter o estilo do botão e reduzir opacidade + `accessibilityState={{ disabled: true }}` e texto explicando o motivo | 2,75:1. |
| `textMuted` `#949494` em texto | Só bordas e elementos decorativos | 3,03:1. |
| Entrelinha `normal` (~1,2×) | `lineHeight ≥ 1,5 × fontSize` em texto corrido | 1.4.8. |
| Botões circulares de 28–32 (topo, acordeão), chips de 32, dias de 38 | Área de toque ≥ 48 (`hitSlop`/padding), visual do Figma mantido; padrão do projeto `TouchTarget = 56` | 2.5.5. |
| Texto de apoio 12 ("Última atividade") | Mínimo 14 | Legibilidade para o público idoso. |
| "Ver" e itens sem rótulo acessível | `accessibilityLabel` com o nome do item ("Ver lembrete Lavar roupas") | 2.4.9. |

Ao revisar uma tela, cite esta tabela para justificar diferenças em relação ao screenshot do Figma.
