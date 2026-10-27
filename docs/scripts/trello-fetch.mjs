#!/usr/bin/env node
/**
 * Utilitário de integração com a Trello REST API v1 — Projeto Lembri (MobileAPP & Wearable)
 *
 * Busca e estrutura dados de cartões (cards) do Trello, incluindo descrição,
 * checklists de critérios de aceite, etiquetas (módulos), prazos e membros,
 * além de salvar o contexto em .tmp/task-<KEY>/issue.json para os geradores de SDD.
 *
 * Uso:
 *   node docs/scripts/trello-fetch.mjs https://trello.com/c/q6Xyz123/10-criar-store-de-lembretes
 *   node docs/scripts/trello-fetch.mjs q6Xyz123
 *   node docs/scripts/trello-fetch.mjs 10
 *   node docs/scripts/trello-fetch.mjs --mine
 *   node docs/scripts/trello-fetch.mjs --list
 *   node docs/scripts/trello-fetch.mjs q6Xyz123 --save
 *
 * Requisitos:
 *   Node.js 20+ (usa fetch nativo).
 *   Credenciais em `.credentials` (ou `.env`) na raiz do repositório:
 *     TRELLO_API_KEY="sua-api-key"
 *     TRELLO_TOKEN="seu-token-gerado"
 *     TRELLO_BOARD_ID="id-ou-shortlink-do-quadro" (opcional para listar cartões)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

/**
 * Carrega variáveis de ambiente de um arquivo .credentials ou .env sem expor segredos.
 */
function loadCredentialsFile(filePath) {
  const vars = {};
  if (!fs.existsSync(filePath)) {
    return vars;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }
  return vars;
}

function getConfig() {
  const credFile = path.join(REPO_ROOT, '.credentials');
  const envFile = path.join(REPO_ROOT, '.env');
  const fromEnvFile = loadCredentialsFile(envFile);
  const fromCredFile = loadCredentialsFile(credFile);

  const apiKey =
    process.env.TRELLO_API_KEY ||
    process.env.TRELLO_KEY ||
    fromCredFile.TRELLO_API_KEY ||
    fromCredFile.TRELLO_KEY ||
    fromEnvFile.TRELLO_API_KEY ||
    fromEnvFile.TRELLO_KEY ||
    '';

  const token =
    process.env.TRELLO_TOKEN ||
    fromCredFile.TRELLO_TOKEN ||
    fromEnvFile.TRELLO_TOKEN ||
    '';

  const boardIdRaw =
    process.env.TRELLO_BOARD_ID ||
    fromCredFile.TRELLO_BOARD_ID ||
    fromEnvFile.TRELLO_BOARD_ID ||
    '';

  // Extrai id/shortlink do board caso tenham colado a URL completa
  const boardMatch = boardIdRaw.match(/trello\.com\/b\/([a-zA-Z0-9]+)/);
  const boardId = boardMatch ? boardMatch[1] : boardIdRaw.trim();

  return { apiKey, token, boardId };
}

function getGitBranch() {
  try {
    return execSync('git branch --show-current', {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Infere o módulo do Lembri a partir do texto e etiquetas do card.
 */
function inferLembriContext(name, desc = '', labels = []) {
  const labelNames = labels.map((l) => (typeof l === 'string' ? l : l.name || '')).join(' ');
  const combined = `${name} ${desc} ${labelNames}`.toLowerCase();

  let modulo = 'LEMBRETES';
  if (/\b(exerc[ií]cio|exercicios|treino|alongamento|respira[cç][aã]o|s[eé]rie)\b/.test(combined)) {
    modulo = 'EXERCICIOS';
  } else if (/\b(watch|relogio|rel[oó]gio|wear|wearable|bluetooth|pareamento|connector)\b/.test(combined)) {
    modulo = 'WEAR_CONNECTOR';
  } else if (/\b(config|configura[cç][aã]o|configuracoes|tema|prefer[eê]ncia|notifica[cç][aã]o|som|alerta)\b/.test(combined)) {
    modulo = 'CONFIGURACOES';
  } else if (/\b(store|zustand|mock|fixture|persistencia|dados)\b/.test(combined)) {
    modulo = 'STORES_MOCKS';
  } else if (/\b(lembrete|lembretes|remedio|rem[eé]dio|hor[aá]rio|tarefa)\b/.test(combined)) {
    modulo = 'LEMBRETES';
  }

  return { modulo };
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .slice(0, 5)
    .join('-');
}

/**
 * Extrai o identificador ou shortLink do card a partir do argumento, URL ou branch.
 */
function extractCardIdentifier(rawArg, currentBranch) {
  if (rawArg) {
    const trimmed = rawArg.trim();
    // Exemplo: https://trello.com/c/q6Xyz123/10-nome-do-card
    const urlMatch = trimmed.match(/trello\.com\/c\/([a-zA-Z0-9]+)/);
    if (urlMatch) return urlMatch[1];

    // Se for string alfanumérica típica do Trello (ex: q6Xyz123 ou ID de 24 hex)
    if (/^[a-zA-Z0-9]{6,24}$/.test(trimmed)) {
      return trimmed;
    }

    // Se for número puro (idShort)
    if (/^\d+$/.test(trimmed)) {
      return trimmed;
    }
  }

  if (currentBranch) {
    // Tenta encontrar padrão card-ID ou número na branch
    const branchMatch = currentBranch.match(/(?:card|trello|lembri)[/-]([a-zA-Z0-9]+)/i);
    if (branchMatch) return branchMatch[1];
  }

  return null;
}

/**
 * Executa requisição à Trello REST API v1.
 */
async function trelloRequest(config, endpoint) {
  if (!config.apiKey || !config.token) {
    throw new Error(
      'Credenciais do Trello ausentes. Configure TRELLO_API_KEY e TRELLO_TOKEN em `.credentials`.'
    );
  }

  const delimiter = endpoint.includes('?') ? '&' : '?';
  const url = `https://api.trello.com/1${endpoint}${delimiter}key=${config.apiKey}&token=${config.token}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error(
        'Falha de autenticação no Trello (HTTP 401). Verifique se TRELLO_API_KEY e TRELLO_TOKEN estão corretos.'
      );
    }
    if (response.status === 404) {
      throw new Error(
        `Recurso não encontrado no Trello (HTTP 404). Confirme se o ID do card ou quadro existe e se você tem acesso.`
      );
    }
    const errText = await response.text().catch(() => '');
    throw new Error(`Erro HTTP ${response.status} na API do Trello: ${errText.slice(0, 200)}`);
  }

  return response.json();
}

/**
 * Busca detalhes completos de um cartão pelo ID ou shortLink.
 */
async function fetchCardDetails(config, cardIdentifier) {
  // Se for número puro (idShort) e tivermos boardId, busca no board primeiro
  if (/^\d+$/.test(cardIdentifier) && config.boardId) {
    const cards = await trelloRequest(config, `/boards/${config.boardId}/cards?fields=id,idShort,name,shortLink`);
    const found = cards.find((c) => String(c.idShort) === cardIdentifier);
    if (found) {
      cardIdentifier = found.id;
    }
  }

  const card = await trelloRequest(
    config,
    `/cards/${cardIdentifier}?fields=id,name,desc,url,shortUrl,shortLink,idShort,labels,idList,due,closed&checklists=all&members=true`
  );

  // Busca nome da lista (ex: "A Fazer", "Em Progresso")
  let listName = 'Geral';
  if (card.idList) {
    try {
      const listData = await trelloRequest(config, `/lists/${card.idList}?fields=name`);
      listName = listData.name || listName;
    } catch {
      // Ignora falha de leitura de lista
    }
  }

  return { ...card, listName };
}

/**
 * Lista cartões atribuídos ao usuário ou do quadro padrão.
 */
async function listCards(config, onlyMine = false) {
  if (onlyMine) {
    return trelloRequest(config, '/members/me/cards?fields=id,idShort,name,url,shortUrl,shortLink,idList,labels,closed');
  }

  if (!config.boardId) {
    // Se não tiver boardId, busca do membro atual
    return trelloRequest(config, '/members/me/cards?fields=id,idShort,name,url,shortUrl,shortLink,idList,labels,closed');
  }

  return trelloRequest(
    config,
    `/boards/${config.boardId}/cards?fields=id,idShort,name,url,shortUrl,shortLink,idList,labels,closed`
  );
}

function formatCardSummaryMarkdown(card) {
  const labelsText = (card.labels || [])
    .map((l) => `\`${l.name || l.color || 'etiqueta'}\``)
    .join(', ') || '*(sem etiquetas)*';

  const membersText = (card.members || [])
    .map((m) => `${m.fullName} (@${m.username})`)
    .join(', ') || '*(não atribuído)*';

  const checklists = card.checklists || [];
  let checklistsMd = '';
  if (checklists.length > 0) {
    checklistsMd = checklists
      .map((chk) => {
        const items = (chk.checkItems || [])
          .map((item) => `- [${item.state === 'complete' ? 'x' : ' '}] ${item.name}`)
          .join('\n');
        return `#### Checklist: ${chk.name}\n${items || '*(vazio)*'}`;
      })
      .join('\n\n');
  } else {
    checklistsMd = '*(Nenhum checklist registrado no cartão)*';
  }

  const { modulo } = inferLembriContext(card.name, card.desc, card.labels);
  const cardKey = card.idShort ? `CARD-${card.idShort}` : card.shortLink || card.id;
  const suggestedBranch = `feat/${slugify(card.name) || cardKey.toLowerCase()}`;
  const planFileName = `${cardKey.toLowerCase()}-${slugify(card.name) || 'plano'}.html`;

  const out = [
    `## Cartão Trello: ${card.name}`,
    '',
    `- **ID Curto:** \`${card.idShort || 'N/A'}\` (Chave: \`${cardKey}\`)`,
    `- **Link Trello:** ${card.shortUrl || card.url}`,
    `- **Coluna / Lista:** \`${card.listName || 'N/A'}\``,
    `- **Etiquetas:** ${labelsText}`,
    `- **Membros Atribuídos:** ${membersText}`,
    `- **Prazo (Due Date):** ${card.due ? new Date(card.due).toLocaleDateString('pt-BR') : '*(sem prazo)*'}`,
    `- **Módulo Lembri Sugerido:** \`${modulo}\``,
    `- **Sugestão de Branch Gitflow:** \`${suggestedBranch}\` (baseada em \`develop\`)`,
    `- **Arquivo de Plano Sugerido:** \`docs/plans/${planFileName}\``,
    '',
    '### Descrição do Cartão',
    card.desc ? card.desc.trim() : '*(Sem descrição informada)*',
    '',
    '### Critérios de Aceite e Checklists',
    checklistsMd,
    '',
    '---',
    '### Próximos Passos Sugeridos:',
    `1. Atualizar \`develop\`: \`git switch develop && git pull\``,
    `2. Criar branch da tarefa: \`git switch -c ${suggestedBranch}\``,
    `3. Gerar o Plano SDD: \`node docs/scripts/gerar-esqueleto.mjs plano ${cardKey} --titulo "${card.name.replace(/"/g, '')}" --modulo ${modulo}\``,
    `4. Executar a skill \`/plano\` para detalhar os requisitos.`,
  ];

  return {
    markdown: out.join('\n'),
    meta: {
      cardKey,
      id: card.id,
      idShort: card.idShort,
      shortLink: card.shortLink,
      name: card.name,
      summary: card.name,
      description: card.desc,
      url: card.shortUrl || card.url,
      listName: card.listName,
      modulo,
      suggestedBranch,
      planFileName,
      labels: card.labels,
      checklists: card.checklists,
    },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const saveFlag = args.includes('--save');
  const mineFlag = args.includes('--mine');
  const listFlag = args.includes('--list');
  const cleanArgs = args.filter((a) => !a.startsWith('--'));

  const config = getConfig();

  if (!config.apiKey || !config.token) {
    console.error(
      [
        '⚠️ Credenciais do Trello não configuradas.',
        'Configure o arquivo `.credentials` na raiz do repositório com:',
        '',
        'TRELLO_API_KEY="sua-chave-aqui"',
        'TRELLO_TOKEN="seu-token-aqui"',
        'TRELLO_BOARD_ID="id-do-quadro-aqui" # Opcional para listas',
        '',
        'Obtenha sua API Key e Token em: https://trello.com/power-ups/admin',
      ].join('\n')
    );
    process.exit(1);
  }

  // Listar cartões
  if (mineFlag || listFlag || (cleanArgs.length === 0 && !getGitBranch().includes('card'))) {
    try {
      const cards = await listCards(config, mineFlag);
      console.log(`\n📋 Cartões do Trello ${mineFlag ? 'atribuídos a você' : 'no quadro'}:`);
      if (cards.length === 0) {
        console.log('*(nenhum cartão encontrado)*');
        return;
      }
      for (const c of cards) {
        const idLabel = c.idShort ? `#${c.idShort}` : c.shortLink;
        console.log(`- [${idLabel}] ${c.name} (${c.shortUrl})`);
      }
      console.log('\nPara buscar detalhes de um cartão específico:');
      console.log('  node docs/scripts/trello-fetch.mjs <ID_OU_URL> --save\n');
      return;
    } catch (err) {
      console.error(`❌ Erro ao listar cartões do Trello: ${err.message}`);
      process.exit(1);
    }
  }

  const currentBranch = getGitBranch();
  const cardIdentifier = extractCardIdentifier(cleanArgs[0], currentBranch);

  if (!cardIdentifier) {
    console.error(
      [
        'Uso:',
        '  node docs/scripts/trello-fetch.mjs <URL_OU_ID_DO_CARD> [--save]',
        '  node docs/scripts/trello-fetch.mjs --mine',
        '  node docs/scripts/trello-fetch.mjs --list',
      ].join('\n')
    );
    process.exit(1);
  }

  try {
    const cardData = await fetchCardDetails(config, cardIdentifier);
    const { markdown, meta } = formatCardSummaryMarkdown(cardData);

    console.log(markdown);

    if (saveFlag) {
      const tmpDirKey = path.join(REPO_ROOT, '.tmp', `task-${meta.cardKey}`);
      fs.mkdirSync(tmpDirKey, { recursive: true });
      fs.writeFileSync(
        path.join(tmpDirKey, 'issue.json'),
        JSON.stringify(meta, null, 2),
        'utf-8'
      );

      // Salva também com idShort ou shortLink para redundância de lookup
      if (meta.idShort) {
        const tmpDirShort = path.join(REPO_ROOT, '.tmp', `task-LEMBRI-${meta.idShort}`);
        fs.mkdirSync(tmpDirShort, { recursive: true });
        fs.writeFileSync(
          path.join(tmpDirShort, 'issue.json'),
          JSON.stringify(meta, null, 2),
          'utf-8'
        );
      }

      console.log(`\n💾 Contexto da tarefa salvo com sucesso em: .tmp/task-${meta.cardKey}/issue.json`);
    }
  } catch (err) {
    console.error(`❌ Erro ao consultar cartão no Trello: ${err.message}`);
    process.exit(1);
  }
}

main();
