/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 2024, sourceType: "module" },
  plugins: ["react-hooks", "react-refresh"],
  extends: ["eslint:recommended"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-refresh/only-export-components": "warn"
  },
  settings: { react: { version: "detect" } }
};
