import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  // AGENTS.md Code Review Rules 2번: 브라우저 저장소는 src/storage.ts에서만 접근한다.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/storage.ts", "src/**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "localStorage", message: "localStorage는 src/storage.ts의 함수로만 접근하세요." },
        { name: "sessionStorage", message: "sessionStorage는 src/storage.ts의 함수로만 접근하세요." },
      ],
      "no-restricted-properties": [
        "error",
        ...["window", "globalThis", "self"].flatMap((object) =>
          ["localStorage", "sessionStorage"].map((property) => ({
            object,
            property,
            message: `${property}는 src/storage.ts의 함수로만 접근하세요.`,
          })),
        ),
      ],
    },
  },
);
