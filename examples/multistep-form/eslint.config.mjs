import vitest from "@vitest/eslint-plugin";
import react from 'eslint-plugin-react';
import * as globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  eslintPluginPrettierRecommended,
  {
    files: ['src/**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {},
  },
  {
    files: ["src/__tests__/**"], // or any other pattern
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
      "vitest/max-nested-describe": ["error", { max: 3 }], // you can also modify rules' behavior using option like this
    },
  },
];
