import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores([
    "**/node_modules/",
    "**/out/",
    "**/dist/",
    "**/.vscode-test/",
    "**/.github/",
    "**/.vscode/",
    "**/docs/",
    "**/*.vsix",
    "**/*.md",
    "**/*.css",
    "**/*.json",
    "eslint.config.mjs",
  ]),

  // -------------------------
  // JS / MJS / CJS (no TS project)
  // -------------------------
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
    },
  },

  // -------------------------
  // TypeScript (type-aware)
  // -------------------------
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...typescriptEslint.configs["flat/recommended-type-checked"],
      prettierRecommended,
    ],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": "off",
      "prettier/prettier": "error",
    },
  },

  // -------------------------
  // Tests (relaxed rules)
  // -------------------------
  {
    files: ["tests/**/*.{ts,tsx}", "test/**/*.{ts,tsx}", "vitest.config.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
]);
