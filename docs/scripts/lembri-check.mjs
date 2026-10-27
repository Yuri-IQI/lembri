#!/usr/bin/env node
/**
 * Auditor Automatizado de Qualidade, Front-end React Native e WCAG AAA — Projeto Lembri
 *
 * Valida diff Gitflow, Conventional Commits, conformidade front-end (React Native / Expo,
 * Zustand, tokens de theme.ts, TypeScript estrito sem any, WCAG 2.2 AAA / TouchTarget = 56dp)
 * e compilação do compilador TypeScript no MobileAPP.
 *
 * Uso:
 *   node docs/scripts/lembri-check.mjs
 *   node docs/scripts/lembri-check.mjs --base develop
 *   node docs/scripts/lembri-check.mjs --all        (audita todos os arquivos de MobileAPP/src/)
 *   node docs/scripts/lembri-check.mjs --skip-tsc   (pula checagem do tsc)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');

function runCmd(cmd, cwd = REPO_ROOT) {
  try {
    const stdout = execSync(cmd, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return { ok: true, output: stdout.trim() };
  } catch (err) {
    const out = [err.stdout, err.stderr].filter(Boolean).join('\n').trim();
    return { ok: false, output: out };
  }
}

function walkCodeFiles(dirPath, results = []) {
  if (!fs.existsSync(dirPath)) return results;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist', 'build', '.tmp', '.expo', 'android', 'ios'].includes(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) walkCodeFiles(full, results);
    else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      results.push(path.relative(REPO_ROOT, full).replace(/\\/g, '/'));
    }
  }
  return results;
}

function auditFile(relPath) {
  const absPath = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(absPath) || fs.statSync(absPath).isDirectory()) return [];

  const content = fs.readFileSync(absPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const findings = [];

  const isMobileSrc = relPath.startsWith('MobileAPP/src/');
  const isTs = /\.(ts|tsx)$/.test(relPath);
  const isTsx = relPath.endsWith('.tsx');

  // 1. Proibição de elementos HTML web no React Native
  if (isMobileSrc && isTsx) {
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      if (/<(div|span|button|input|select|textarea|table|tr|td|th)\b/i.test(line)) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'RN1 (Elementos HTML Web no React Native)',
          file: `${relPath}:${i + 1}`,
          msg: `Elemento HTML web detectado: \`${trimmed.slice(0, 60)}\`. Use componentes nativos do React Native (<View>, <Text>, <Pressable>, <TextInput>).`,
        });
      }

      if (/from\s+['"]@mui\//.test(line) || /from\s+['"]react-dom['"]/.test(line)) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'RN2 (Biblioteca Web Incompatível)',
          file: `${relPath}:${i + 1}`,
          msg: 'Importação de biblioteca web detectada no app mobile. Proibido Material UI ou react-dom.',
        });
      }
    });
  }

  // 2. TypeScript Estrito e Clean Code
  if (isMobileSrc && isTs) {
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      if (/(:\s*any\b|\bas\s+any\b|<any>|@ts-ignore|@ts-nocheck)/.test(line)) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'TS1 (Proibido any / @ts-ignore)',
          file: `${relPath}:${i + 1}`,
          msg: `Tipagem insegura encontrada: \`${trimmed.slice(0, 70)}\``,
        });
      }

      if (/\bconsole\.log\s*\(/.test(line)) {
        findings.push({
          severity: '🟡 Atenção',
          rule: 'CC1 (console.log de depuração)',
          file: `${relPath}:${i + 1}`,
          msg: 'Remova `console.log` de depuração antes de abrir o Pull Request.',
        });
      }
    });
  }

  // 3. Regras de Estado no Zustand
  if (relPath.includes('MobileAPP/src/stores/')) {
    lines.forEach((line, i) => {
      // Alerta para mutações diretas comuns em arrays
      if (/\bstate\.[a-zA-Z0-9_]+\.(push|splice|shift|unshift|pop)\(/.test(line)) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'ZS1 (Mutação Direta no Zustand)',
          file: `${relPath}:${i + 1}`,
          msg: 'Mutação direta de estado detectada. Mantenha as ações estritamente imutáveis utilizando spread ou métodos não mutantes.',
        });
      }
    });
  }

  // 4. Acessibilidade Mobile WCAG 2.2 AAA
  if (isMobileSrc && (isTsx || isTs)) {
    lines.forEach((line, i) => {
      // Proibição de texto justificado (WCAG AAA 1.4.8)
      if (/textAlign:\s*['"]justify['"]/.test(line)) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'WCAG 1.4.8 (Texto Justificado Proibido no Nível AAA)',
          file: `${relPath}:${i + 1}`,
          msg: 'Texto justificado detectado. A WCAG AAA proíbe justificação em blocos de texto; utilize alinhamento à esquerda (`left`).',
        });
      }

      // Botões apenas com ícone precisam de accessibilityLabel autônomo (WCAG AAA 2.4.9)
      if (/<Pressable\b/.test(line) && !content.includes('accessibilityLabel') && !content.includes('ThemedText')) {
        findings.push({
          severity: '🟡 Atenção',
          rule: 'WCAG 2.4.9 (Rótulo Acessível Autônomo AAA)',
          file: `${relPath}:${i + 1}`,
          msg: 'Elemento interativo detectado sem rótulo acessível explícito (`accessibilityLabel`).',
        });
      }
    });
  }

  return findings;
}

function main() {
  const args = process.argv.slice(2);
  const allFlag = args.includes('--all');
  const skipTsc = args.includes('--skip-tsc');
  const baseIdx = args.indexOf('--base');
  const baseBranch = baseIdx !== -1 && args[baseIdx + 1] ? args[baseIdx + 1] : 'develop';

  const branchRes = runCmd('git branch --show-current');
  const currentBranch = branchRes.ok && branchRes.output ? branchRes.output : 'desconhecida';

  // Validação de branch Gitflow
  const validBranchPattern = /^(main|develop|(feat|feature|fix|hotfix|release|docs|chore|refactor|test)\/[a-z0-9._-]+)$/i;
  const isBranchValid = validBranchPattern.test(currentBranch);

  const diffFilesSet = new Set();
  if (allFlag) {
    walkCodeFiles(path.join(REPO_ROOT, 'MobileAPP', 'src'), []).forEach((f) => diffFilesSet.add(f));
  } else {
    const branchDiff = runCmd(`git diff --name-only ${baseBranch}...HEAD`);
    if (branchDiff.ok && branchDiff.output) {
      branchDiff.output.split(/\r?\n/).filter(Boolean).forEach((f) => diffFilesSet.add(f.trim()));
    }
    const localDiff = runCmd('git status --porcelain');
    if (localDiff.ok && localDiff.output) {
      localDiff.output
        .split(/\r?\n/)
        .filter(Boolean)
        .forEach((line) => {
          const filePart = line.slice(3).trim().split(' -> ').pop();
          if (filePart) diffFilesSet.add(filePart.replace(/\\/g, '/'));
        });
    }
  }

  const targetFiles = [...diffFilesSet].filter((f) => /\.(ts|tsx|js|mjs)$/.test(f));

  const shortStat = runCmd(`git diff --shortstat ${baseBranch}...HEAD`);
  const statText = shortStat.ok && shortStat.output ? shortStat.output : 'Sem commits divergentes da base';

  const logRes = runCmd(`git log ${baseBranch}..HEAD --oneline`);
  const commits = logRes.ok && logRes.output ? logRes.output.split(/\r?\n/).filter(Boolean) : [];
  const commitRegex = /^[0-9a-f]+\s+(Merge\b|(feat|fix|docs|test|refactor|chore|style)(\([a-z0-9_-]+\))?!?:\s+.+)/i;
  const invalidCommits = commits.filter((c) => !commitRegex.test(c));

  const findings = [];
  if (!isBranchValid) {
    findings.push({
      severity: '🟡 Atenção',
      rule: 'Gitflow (Nomenclatura de Branch)',
      file: `branch: ${currentBranch}`,
      msg: 'A branch atual não segue o padrão `feat/<nome-da-tarefa>`, `fix/<nome-da-tarefa>` a partir de develop.',
    });
  }
  for (const ic of invalidCommits) {
    findings.push({
      severity: '🟡 Atenção',
      rule: 'Commits (Conventional Commits)',
      file: `commit: ${ic}`,
      msg: 'Mensagem fora do padrão `tipo(escopo): descrição curta`.',
    });
  }

  for (const file of targetFiles) {
    findings.push(...auditFile(file));
  }

  const qaResults = [];
  if (!skipTsc) {
    const mobileAppDir = path.join(REPO_ROOT, 'MobileAPP');
    if (fs.existsSync(path.join(mobileAppDir, 'node_modules'))) {
      const tscRes = runCmd('npx tsc --noEmit', mobileAppDir);
      qaResults.push({
        target: 'MobileAPP TypeScript (`npx tsc --noEmit`)',
        ok: tscRes.ok,
        details: tscRes.ok ? '🟢 Zero erros de tipagem' : `🔴 Falhou:\n${tscRes.output.split('\n').slice(0, 15).join('\n')}`,
      });
      if (!tscRes.ok) {
        findings.push({
          severity: '🔴 Bloqueante',
          rule: 'TS (Compilação TypeScript)',
          file: 'MobileAPP/',
          msg: 'Erros de compilação estrita detectados pelo TypeScript compiler.',
        });
      }
    } else {
      qaResults.push({
        target: 'MobileAPP TypeScript (`npx tsc --noEmit`)',
        ok: true,
        details: '⚪ `MobileAPP/node_modules` não instalado no host (rode `npm install` em MobileAPP)',
      });
    }
  }

  const blockers = findings.filter((f) => f.severity.startsWith('🔴'));
  const warnings = findings.filter((f) => f.severity.startsWith('🟡'));

  const out = [
    '## Pré-Auditoria Automatizada Front-end — Projeto Lembri',
    '',
    `- **Branch atual:** \`${currentBranch}\` (${isBranchValid ? '🟢 Gitflow válido' : '🟡 Verificar prefixo Gitflow'})`,
    `- **Branch base comparada:** \`${baseBranch}\``,
    `- **Estatística do Diff:** ${statText}`,
    `- **Commits na branch (${commits.length}):** ${invalidCommits.length === 0 ? '🟢 Todos em Conventional Commits' : `🟡 ${invalidCommits.length} fora do padrão`}`,
    `- **Arquivos de código auditados (${targetFiles.length}):** ${targetFiles.map((f) => `\`${f}\``).join(', ') || '*(nenhum arquivo de código alterado no diff)*'}`,
    '',
    `### Resumo de Achados Estáticos: 🔴 ${blockers.length} Bloqueante(s) · 🟡 ${warnings.length} Atenção`,
  ];

  if (findings.length === 0) {
    out.push('- 🟢 Nenhuma violação estática detectada nos critérios front-end, Zustand, TypeScript ou WCAG.');
  } else {
    for (const f of findings) {
      out.push(`- **${f.severity}** [${f.rule}] \`${f.file}\` — ${f.msg}`);
    }
  }

  if (qaResults.length > 0) {
    out.push('', '### Compilação TypeScript');
    for (const q of qaResults) {
      out.push(`- **${q.target}:** ${q.details}`);
    }
  }

  console.log(out.join('\n'));
  process.exit(blockers.length > 0 ? 1 : 0);
}

main();
