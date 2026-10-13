import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'coverage']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            // Turns off formatting rules that conflict with Prettier (including `curly`),
            // so project rules below must come after it.
            prettier,
        ],
        languageOptions: {
            ecmaVersion: 2023,
            globals: globals.browser,
        },
        rules: {
            curly: ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
                // PascalCase for React components, UPPER_CASE for constants.
                { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'] },
                { selector: 'function', format: ['camelCase', 'PascalCase'] },
                { selector: 'objectLiteralMethod', format: ['camelCase', 'PascalCase'] },
                { selector: 'import', format: ['camelCase', 'PascalCase'] },
                { selector: 'typeLike', format: ['PascalCase'] },
                // Object keys often mirror external APIs (CSS, Pixi options).
                { selector: 'objectLiteralProperty', format: null },
            ],
        },
    },
]);
