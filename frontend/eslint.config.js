// ESLint v9 flat config shim for legacy .eslintrc.cjs usage.
// This keeps existing lint rules working in this repo.

import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist", "build", "coverage", "node_modules"],
  },
  js.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-refresh/only-export-components": "warn",
    },
  },
];

