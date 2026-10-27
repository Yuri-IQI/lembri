// https://docs.expo.dev/guides/using-eslint/
const path = require('path');
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // Aponta o tsconfig do app explicitamente: sem isso, o ESLint rodando a partir da
    // raiz do monorepo (ex.: VS Code aberto em Lembri/) não resolve os aliases @/.
    settings: {
      'import/resolver': {
        typescript: { project: path.join(__dirname, 'tsconfig.json') },
      },
    },
  },
]);
