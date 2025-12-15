// apps/frontend/eslint.config.js
import { base } from '@venture_lab/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...base,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
    },
  },
]);
