import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".astro", "archive", "node_modules", "docs/redesign/specimen"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,mjs,js}"],
    languageOptions: { ecmaVersion: 2022, globals: { ...globals.browser, ...globals.node } },
    rules: { "@typescript-eslint/no-unused-vars": "off", "@typescript-eslint/no-non-null-assertion": "off" },
  },
);
