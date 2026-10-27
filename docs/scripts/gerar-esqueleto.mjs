#!/usr/bin/env node
/**
 * Gerador de Esqueleto HTML (SDD, Revisão e Módulo) — Projeto Lembri (MobileAPP & Wearable)
 *
 * Gera automaticamente o arquivo HTML padronizado com CSS oficial, cabeçalho,
 * metadados, sumário (TOC), Checklist Pré-PR e Princípios de Desenvolvimento para o
 * aplicativo mobile Lembri (React Native com Expo SDK 58, Zustand e dados mockados).
 *
 * Uso:
 *   node docs/scripts/gerar-esqueleto.mjs plano LEMBRI-10
 *   node docs/scripts/gerar-esqueleto.mjs plano LEMBRI-10 --titulo "Controle de Lembretes" --modulo LEMBRETES
 *   node docs/scripts/gerar-esqueleto.mjs modulo LEMBRETES --titulo "Módulo de Lembretes"
 *   node docs/scripts/gerar-esqueleto.mjs revisao LEMBRI-10 --titulo "Revisão de Lembretes"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

function slugify(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return null;
}

function extractStyleBlock(templatePath) {
  if (!fs.existsSync(templatePath)) {
    return `<style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 960px; margin: 0 auto; padding: 24px; color: #1a1a1a; background: #fafafa; }
      h1, h2, h3 { color: #000; }
      .meta-block { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
      .toc { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 32px; }
      code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
      pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
      table { width: 100%; border-collapse: collapse; margin: 16px 0; background: #fff; }
      th, td { border: 1px solid #e2e8f0; padding: 10px 14px; text-align: left; }
      th { background: #f8fafc; font-weight: 600; }
      .badge-ok { background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
      .badge-warn { background: #fef9c3; color: #854d0e; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
      .badge-block { background: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-weight: bold; }
      .badge-na { background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; }
      .verdict-approved { background: #dcfce7; border: 2px solid #16a34a; color: #166534; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 1.2em; text-align: center; margin: 24px 0; }
      .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0; }
      .summary-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
      .summary-card .count { font-size: 2em; font-weight: bold; display: block; }
      .summary-card .label { font-size: 0.9em; color: #64748b; }
      ul.check { list-style: none; padding-left: 0; }
      ul.check li { margin-bottom: 8px; }
    </style>`;
  }
  const html = fs.readFileSync(templatePath, 'utf-8');
  const match = html.match(/<style>[\s\S]*?<\/style>/i);
  return match ? match[0] : '';
}

function normalizeKey(targetKeyRaw) {
  const upper = String(targetKeyRaw || '').toUpperCase();
  if (/^\d+$/.test(upper)) return `LEMBRI-${upper}`;
  return upper;
}

function generatePlano(targetKeyRaw, args) {
  const forceFlag = args.includes('--force');
  const issueKey = normalizeKey(targetKeyRaw);

  const cachedJsonPath = path.join(REPO_ROOT, '.tmp', `task-${issueKey}`, 'issue.json');
  let cached = {};
  if (fs.existsSync(cachedJsonPath)) {
    try {
      cached = JSON.parse(fs.readFileSync(cachedJsonPath, 'utf-8'));
    } catch {
      cached = {};
    }
  }

  const summary = getArgValue(args, '--titulo') || cached.summary || 'Descrição da Funcionalidade Mobile';
  const modulo = getArgValue(args, '--modulo') || cached.modulo || 'LEMBRETES';
  const branch =
    getArgValue(args, '--branch') ||
    cached.suggestedBranch ||
    `feat/${slugify(summary) || issueKey.toLowerCase()}`;
  const today = new Date().toISOString().slice(0, 10);

  const slug = slugify(summary) || 'plano';
  const fileName =
    getArgValue(args, '--output') ||
    cached.planFileName ||
    `${issueKey.toLowerCase()}-${slug}.html`;
  const outPath = path.join(REPO_ROOT, 'docs', 'plans', fileName);

  if (fs.existsSync(outPath) && !forceFlag) {
    console.error(
      `⚠️ O arquivo docs/plans/${fileName} já existe. Use --force se desejar sobrescrevê-lo.`
    );
    process.exit(1);
  }

  const templatePath = path.join(REPO_ROOT, 'docs', 'plans', 'EXEMPLO_PLANO.html');
  const styleBlock = extractStyleBlock(templatePath);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>SDD Front-end — ${escapeHtml(issueKey)}: ${escapeHtml(summary)} (Projeto Lembri)</title>
  ${styleBlock}
</head>
<body>

<h1>SDD Front-end — ${escapeHtml(issueKey)}: ${escapeHtml(summary)}</h1>

<div class="meta-block">
  <p><strong>Tarefa / Funcionalidade:</strong> <code>${escapeHtml(issueKey)}</code> — ${escapeHtml(summary)}</p>
  <p><strong>Branch (Gitflow):</strong> <code>${escapeHtml(branch)}</code> (criada a partir de <code>develop</code> → PR para <code>develop</code>)</p>
  <p><strong>Escopo Tecnológico:</strong> React Native (Expo SDK 58), React 19, Zustand e Wear OS Data Layer</p>
  <p><strong>Módulo:</strong> <code>${escapeHtml(modulo)}</code></p>
  <p><strong>Camada de Dados:</strong> Majoritariamente Mockada (Fixtures em <code>src/mocks/</code> e Stores em <code>src/stores/</code>)</p>
  <p><strong>Data:</strong> ${today}</p>
</div>

<ol class="toc">
  <li><a href="#s1">Contexto, Objetivo e Escopo Front-end</a></li>
  <li><a href="#s2">Requisitos e Regras de Negócio (Casos de Borda)</a></li>
  <li><a href="#s3">Estrutura de Arquivos e Componentes</a></li>
  <li><a href="#s4">Modelagem de Dados e Tipos TypeScript (src/types/)</a></li>
  <li><a href="#s5">Gerenciamento de Estado no Zustand e Mocks</a></li>
  <li><a href="#s6">Front-end — Telas Expo Router e 5 Estados Visuais</a></li>
  <li><a href="#s7">Acessibilidade Mobile (WCAG 2.2 Nível AAA — TouchTarget = 56)</a></li>
  <li><a href="#s8">Integração com Wearable (se aplicável)</a></li>
  <li><a href="#s9">Casos de Teste e Verificação no Emulador</a></li>
  <li><a href="#s10">Checklist Pré-PR</a></li>
  <li><a href="#s11">Atualização da Documentação do Módulo</a></li>
  <li><a href="#s12">Princípios de Desenvolvimento e Restrições</a></li>
</ol>

<hr>

<h2 id="s1">1. Contexto, Objetivo e Escopo Front-end</h2>
<!-- PREENCHER_SECAO_1: O que a pessoa usuária faz no app mobile, o que entra e o que fica fora (YAGNI) -->
<p>[Descrever objetivo da funcionalidade mobile]</p>

<hr>

<h2 id="s2">2. Requisitos e Regras de Negócio (Casos de Borda)</h2>
<!-- PREENCHER_SECAO_2: Cenários Dado / Quando / Então e regras de itens -->
<p>[Especificar requisitos funcionais e não-funcionais]</p>

<hr>

<h2 id="s3">3. Estrutura de Arquivos e Componentes</h2>
<!-- PREENCHER_SECAO_3: Arquivos criados ou modificados em MobileAPP/src/ -->
<ul>
  <li><strong>Rotas / Telas:</strong> <code>MobileAPP/src/app/</code></li>
  <li><strong>Componentes Base:</strong> <code>MobileAPP/src/components/</code></li>
  <li><strong>Stores Zustand:</strong> <code>MobileAPP/src/stores/</code></li>
  <li><strong>Mocks e Fixtures:</strong> <code>MobileAPP/src/mocks/</code></li>
  <li><strong>Serviços / Wear:</strong> <code>MobileAPP/src/services/</code></li>
</ul>

<hr>

<h2 id="s4">4. Modelagem de Dados e Tipos TypeScript (src/types/)</h2>
<!-- PREENCHER_SECAO_4: Interfaces TypeScript estritas (zero any) -->
<pre><code class="language-typescript">// Interfaces de domínio
export interface Item {
  id: string;
  titulo: string;
  concluido: boolean;
  horario: string;
}
</code></pre>

<hr>

<h2 id="s5">5. Gerenciamento de Estado no Zustand e Mocks</h2>
<!-- PREENCHER_SECAO_5: Estado, ações imutáveis e seletores otimizados -->
<p>[Descrever store Zustand e dados mockados iniciais]</p>

<hr>

<h2 id="s6">6. Front-end — Telas Expo Router e 5 Estados Visuais</h2>
<!-- PREENCHER_SECAO_6: Rotas e tratamento dos estados Ideal, Carregando, Vazio, Erro e Parcial -->
<p>[Descrever telas e tratamento dos 5 estados visuais]</p>

<hr>

<h2 id="s7">7. Acessibilidade Mobile (WCAG 2.2 Nível AAA)</h2>
<ul class="check">
  <li><input type="checkbox"> <strong>Contraste Aprimorado (1.4.6):</strong> Mínimo de 7:1 para texto normal e 4.5:1 para texto grande. Proibido usar textMuted para texto legível.</li>
  <li><input type="checkbox"> <strong>Alvo de Toque Aprimorado (2.5.5):</strong> Mínimo 44x44dp com recomendação de <strong>56dp</strong> (<code>TouchTarget</code>) para todos os botões e áreas clicáveis.</li>
  <li><input type="checkbox"> <strong>Rótulos Acessíveis Autônomos (2.4.9):</strong> Botões com ícone possuem <code>accessibilityRole="button"</code> e <code>accessibilityLabel</code> autônomo e contextual.</li>
  <li><input type="checkbox"> <strong>Prevenção de Erros Aprimorada (3.3.6):</strong> Mutações e exclusões possuem mecanismo de desfazer (*Undo*) de 5 a 10s ou confirmação explícita.</li>
  <li><input type="checkbox"> <strong>Sem Limite de Tempo Inflexível (2.2.3):</strong> Sem contadores regressivos ou timeouts automáticos que descartem dados.</li>
  <li><input type="checkbox"> <strong>Apresentação Visual (1.4.8):</strong> Texto alinhado à esquerda (sem justificar) e entrelinha >= 1.5.</li>
  <li><input type="checkbox"> <strong>Status Sem Depender de Cor (1.4.1):</strong> Conclusão indicada por texto e ícone de checkmark (✓).</li>
</ul>

<hr>

<h2 id="s8">8. Integração com Wearable (se aplicável)</h2>
<!-- PREENCHER_SECAO_8: Contrato de mensagem, envio e confirmação do relógio -->
<p>[Detalhar comunicação via Wearable Data Layer ou declarar não aplicável]</p>

<hr>

<h2 id="s9">9. Casos de Teste e Verificação no Emulador</h2>
<!-- PREENCHER_SECAO_9: Testes de store Zustand e roteiro de teste manual no emulador -->
<p>[Listar cenários de teste]</p>

<hr>

<h2 id="s10">10. Checklist Pré-PR</h2>
<ul class="check">
  <li><input type="checkbox"> Branch da tarefa criada a partir de <code>develop</code> atualizada (<code>feat/&lt;nome&gt;</code> ou <code>fix/&lt;nome&gt;</code>)</li>
  <li><input type="checkbox"> Commits no formato Conventional Commits (<code>tipo(escopo): descrição curta</code>)</li>
  <li><input type="checkbox"> Tipagem estrita TypeScript (zero <code>any</code>) e sem <code>console.log</code> de debug</li>
  <li><input type="checkbox"> Ações da store Zustand são estritamente imutáveis</li>
  <li><input type="checkbox"> Design tokens de <code>src/constants/theme.ts</code> respeitados (sem cores mágicas)</li>
  <li><input type="checkbox"> <code>npx tsc --noEmit</code> e <code>node docs/scripts/lembri-check.mjs</code> executando sem erros</li>
  <li><input type="checkbox"> Critérios de acessibilidade mobile (WCAG 2.2 AAA / TouchTarget 56dp / Contraste 7:1) atendidos</li>
</ul>

<hr>

<h2 id="s11">11. Atualização da Documentação do Módulo</h2>
<p><strong>Módulo de referência:</strong> <code>docs/modulos/${escapeHtml(modulo)}.html</code></p>
<blockquote>Esta tarefa <strong>[impacta / não impacta]</strong> a documentação técnica do módulo.</blockquote>

<hr>

<h2 id="s12">12. Princípios de Desenvolvimento e Restrições</h2>
<p>A implementação deste plano segue rigorosamente a skill canônica <code>principios</code> do Projeto Lembri:</p>
<ol>
  <li><strong>Padrões do Projeto:</strong> Telas em <code>src/app/</code>, UI em <code>src/components/</code>, Estado em <code>src/stores/</code>, Mocks em <code>src/mocks/</code> e tokens em <code>src/constants/theme.ts</code>.</li>
  <li><strong>Escopo de Impacto:</strong> Estado local vs global Zustand vs eventos Wear OS.</li>
  <li><strong>Idempotência e Imutabilidade:</strong> Stores imutáveis no Zustand e seletores otimizados.</li>
  <li><strong>YAGNI:</strong> Foco em front-end sem over-engineering.</li>
  <li><strong>Acessibilidade Inegociável:</strong> WCAG 2.2 nível AAA no mobile com TouchTarget = 56dp e contraste 7:1.</li>
</ol>

</body>
</html>
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`✅ Esqueleto SDD gerado com sucesso em: docs/plans/${fileName}`);
}

function generateModulo(moduloKeyRaw, args) {
  const forceFlag = args.includes('--force');
  const moduloKey = moduloKeyRaw.toUpperCase().trim();
  const titulo = getArgValue(args, '--titulo') || moduloKey;
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `${moduloKey}.html`;
  const outPath = path.join(REPO_ROOT, 'docs', 'modulos', fileName);

  if (fs.existsSync(outPath) && !forceFlag) {
    console.error(
      `⚠️ O arquivo docs/modulos/${fileName} já existe. Use --force se desejar sobrescrevê-lo.`
    );
    process.exit(1);
  }

  const templatePath = path.join(REPO_ROOT, 'docs', 'modulos', 'EXEMPLO_MODULO.html');
  const styleBlock = extractStyleBlock(templatePath);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(moduloKey)} — ${escapeHtml(titulo)} (Projeto Lembri)</title>
  ${styleBlock}
</head>
<body>

<h1>${escapeHtml(moduloKey)} — ${escapeHtml(titulo)}</h1>

<div class="meta-block">
  <p><strong>Módulo:</strong> <code>${escapeHtml(moduloKey)}</code></p>
  <p><strong>Índice de referência:</strong> <code>docs/manuais/modulos.md</code></p>
  <p><strong>Telas Expo Router:</strong> <code>MobileAPP/src/app/</code></p>
  <p><strong>Componentes UI:</strong> <code>MobileAPP/src/components/</code></p>
  <p><strong>Stores Zustand:</strong> <code>MobileAPP/src/stores/</code></p>
  <p><strong>Mocks & Fixtures:</strong> <code>MobileAPP/src/mocks/</code></p>
  <p><strong>Data da Documentação:</strong> ${today}</p>
</div>

<hr>

<h2>1. Visão Geral do Módulo</h2>
<p>[Descrever propósito funcional do módulo no app mobile]</p>

<hr>

<h2>2. Telas e Fluxos no Expo Router</h2>
<p>[Mapear as telas, abas e navegação]</p>

<hr>

<h2>3. Gerenciamento de Estado no Zustand</h2>
<p>[Descrever a store, estado, ações e seletores]</p>

<hr>

<h2>4. Catálogo de Componentes e Tokens Visuais</h2>
<p>[Listar componentes reutilizados e tokens de theme.ts]</p>

<hr>

<h2>5. Massa de Dados Mockados e Fixtures</h2>
<p>[Descrever os dados de teste em src/mocks/]</p>

<hr>

<h2>6. Acessibilidade Mobile (WCAG 2.2 AAA)</h2>
<p>[Descrever alvos de toque 56dp, contraste 7:1, reversibilidade de exclusão e suporte a leitores de tela]</p>

<hr>

<h2>7. Integração com Relógio Wear OS (se aplicável)</h2>
<p>[Descrever contratos e fluxo de sincronização]</p>

</body>
</html>
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`✅ Esqueleto de Módulo gerado com sucesso em: docs/modulos/${fileName}`);
}

function generateRevisao(targetKeyRaw, args) {
  const forceFlag = args.includes('--force');
  const issueKey = normalizeKey(targetKeyRaw);

  const summary = getArgValue(args, '--titulo') || 'Revisão de Código Mobile';
  const modulo = getArgValue(args, '--modulo') || 'LEMBRETES';
  const branch = getArgValue(args, '--branch') || `feat/${issueKey.toLowerCase()}`;
  const today = new Date().toISOString().slice(0, 10);

  const slug = slugify(summary) || 'revisao';
  const fileName = getArgValue(args, '--output') || `${issueKey.toLowerCase()}-${slug}.html`;
  const outPath = path.join(REPO_ROOT, 'docs', 'reviews', fileName);

  if (fs.existsSync(outPath) && !forceFlag) {
    console.error(
      `⚠️ O arquivo docs/reviews/${fileName} já existe. Use --force se desejar sobrescrevê-lo.`
    );
    process.exit(1);
  }

  const templatePath = path.join(REPO_ROOT, 'docs', 'reviews', 'EXEMPLO_REVISAO.html');
  const styleBlock = extractStyleBlock(templatePath);

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Revisão de Código — ${escapeHtml(issueKey)}: ${escapeHtml(summary)} (Projeto Lembri)</title>
  ${styleBlock}
</head>
<body>

<h1>Relatório de Revisão de Código — ${escapeHtml(issueKey)}: ${escapeHtml(summary)}</h1>

<div class="meta-block">
  <p><strong>Tarefa:</strong> <code>${escapeHtml(issueKey)}</code> — ${escapeHtml(summary)}</p>
  <p><strong>Branch Revisada:</strong> <code>${escapeHtml(branch)}</code> (comparada contra <code>develop</code>)</p>
  <p><strong>Módulo Afetado:</strong> <code>${escapeHtml(modulo)}</code></p>
  <p><strong>Data da Revisão:</strong> ${today}</p>
</div>

<div class="verdict-approved">
  Veredito da Revisão: APROVADO_PARA_REVISAO_HUMANA
</div>

<div class="summary-grid">
  <div class="summary-card">
    <span class="count" style="color: #dc2626;">0</span>
    <span class="label">🔴 Bloqueantes</span>
  </div>
  <div class="summary-card">
    <span class="count" style="color: #d97706;">0</span>
    <span class="label">🟡 Atenção</span>
  </div>
  <div class="summary-card">
    <span class="count" style="color: #16a34a;">12</span>
    <span class="label">🟢 OK</span>
  </div>
  <div class="summary-card">
    <span class="count" style="color: #64748b;">0</span>
    <span class="label">⚪ N/A</span>
  </div>
</div>

<ol class="toc">
  <li><a href="#r1">Resumo do Diff e Escopo Front-end</a></li>
  <li><a href="#r2">Matriz de Conformidade Arquitetural</a></li>
  <li><a href="#r3">Auditoria de Estado Zustand e Mocks</a></li>
  <li><a href="#r4">Auditoria de Acessibilidade Mobile (WCAG 2.2 AAA)</a></li>
  <li><a href="#r5">Resultado da Pré-Auditoria Automatizada (lembri-check.mjs)</a></li>
</ol>

<hr>

<h2 id="r1">1. Resumo do Diff e Escopo Front-end</h2>
<p>[Detalhar arquivos alterados e novas funcionalidades]</p>

<hr>

<h2 id="r2">2. Matriz de Conformidade Arquitetural</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Eixo Auditado</th>
      <th scope="col">Status</th>
      <th scope="col">Evidência / Observação</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Gitflow (base <code>develop</code>) e Conventional Commits</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
    <tr><td>Camadas Mobile (Expo Router, Components, Stores, Mocks)</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
    <tr><td>Tipagem TypeScript Estrita (zero <code>any</code>)</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
    <tr><td>Imutabilidade no Zustand e Seletores Otimizados</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
    <tr><td>Design Tokens (theme.ts / TouchTarget = 56)</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
    <tr><td>Acessibilidade Mobile WCAG 2.2 AAA (contraste 7:1 e alvos)</td><td><span class="badge-ok">🟢 OK</span></td><td>[Evidência]</td></tr>
  </tbody>
</table>

<hr>

<h2 id="r3">3. Auditoria de Estado Zustand e Mocks</h2>
<p>[Verificação de imutabilidade das ações e consistência dos dados mockados]</p>

<hr>

<h2 id="r4">4. Auditoria de Acessibilidade Mobile (WCAG 2.2 AAA)</h2>
<p>[Verificação de alvos de toque 56dp, contraste 7:1, reversibilidade de exclusões e labels autônomos para leitores de tela]</p>

<hr>

<h2 id="r5">5. Resultado da Pré-Auditoria Automatizada (<code>lembri-check.mjs</code>)</h2>
<p>Executado com zero bloqueantes.</p>

</body>
</html>
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf-8');
  console.log(`✅ Esqueleto de Revisão gerado com sucesso em: docs/reviews/${fileName}`);
}

function main() {
  const args = process.argv.slice(2);
  const tipo = (args[0] || '').toLowerCase();
  const alvo = args[1];

  if (!tipo || !alvo || !['plano', 'modulo', 'revisao'].includes(tipo)) {
    console.error(
      [
        'Uso:',
        '  node docs/scripts/gerar-esqueleto.mjs plano <CHAVE_TAREFA> [--titulo "..."] [--modulo "..."] [--force]',
        '  node docs/scripts/gerar-esqueleto.mjs modulo <CHAVE_MODULO> [--titulo "..."] [--force]',
        '  node docs/scripts/gerar-esqueleto.mjs revisao <CHAVE_TAREFA> [--titulo "..."] [--modulo "..."] [--force]',
      ].join('\n')
    );
    process.exit(1);
  }

  if (tipo === 'plano') {
    generatePlano(alvo, args.slice(2));
  } else if (tipo === 'modulo') {
    generateModulo(alvo, args.slice(2));
  } else {
    generateRevisao(alvo, args.slice(2));
  }
}

main();
