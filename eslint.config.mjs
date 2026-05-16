import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  js.configs.recommended,
  unicorn.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'none',
          arrowParens: 'avoid',
          embeddedLanguageFormatting: 'off'
        }
      ],
      'require-atomic-updates': 0,
      'no-extra-semi': 0,
      'no-mixed-spaces-and-tabs': 0,
      'unicorn/filename-case': 0,
      'unicorn/prevent-abbreviations': 0,
      'unicorn/no-array-reduce': 0,
      'unicorn/prefer-spread': 0
    }
  }
];
