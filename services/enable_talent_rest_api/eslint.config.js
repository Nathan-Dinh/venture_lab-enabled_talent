// apps/frontend/eslint.config.cjs
import { base } from '@venture_lab/eslint-config';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...base,
  {
    rules: { 'no-console': 'warn', '@typescript-eslint/no-unused-vars': 'off' },
  },
]);
