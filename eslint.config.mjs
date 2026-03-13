import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import jestPlugin from 'eslint-plugin-jest' // <-- Added Jest plugin

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, jest: jestPlugin },
    extends: ['js/recommended', jestPlugin.configs['flat/recommended']],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },

  {
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^next$' }],
      // 'arrow-body-style': ['error', 'always'],
    },
  },
])

// import js from "@eslint/js";
// import globals from "globals";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
//   { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
// ]);
