import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'
import tseslint from 'typescript-eslint';
import globals from 'globals';
import js from '@eslint/js';
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ignorePath = path.resolve(__dirname, ".prettierignore");

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  includeIgnoreFile(ignorePath),
  {
    plugins: {
      react,
      prettier
    },
    files: ['src/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // 配置js全局变量，因为是taro，全局的uni是不需要引入的，还有5+的plus对象
      globals: {
        testRule: 'readonly',
        wx: 'readonly',
        qq: 'readonly',
        tt: 'readonly',
        swan: 'readonly',
        my: 'readonly',
        getCurrentPages: 'readonly',
        getApp: 'readonly',
        requirePlugin: 'readonly',
        jd: 'readonly',
        ks: 'readonly',
        LOCATION_APIKEY: 'readonly',
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react-hooks/exhaustive-deps': 0,
      'no-param-reassign': 0,
      'no-nested-ternary': 0,
      'prefer-template': 0,
      '@typescript-eslint/dot-notation': 0,
      '@typescript-eslint/consistent-type-imports': 2,
      '@typescript-eslint/no-invalid-this':0,
      'no-underscore-dangle': 0,
      '@next/next/no-img-element': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-empty-object-type': 0,
      '@typescript-eslint/no-unsafe-function-type': 0
    }
  }
);
