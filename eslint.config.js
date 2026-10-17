import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const STORAGE_NAMES = "/^(localStorage|sessionStorage)$/";

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
      // 어떤 객체를 거치든(window, document.defaultView, 별칭 변수 등) 속성 이름으로 막는다.
      "no-restricted-syntax": [
        "error",
        {
          selector: `MemberExpression[property.name=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
        {
          selector: `MemberExpression[computed=true][property.value=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
        {
          selector: `ObjectPattern > Property[key.name=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
        {
          selector: `MemberExpression[computed=true][property.type="TemplateLiteral"][property.expressions.length=0][property.quasis.0.value.cooked=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
        {
          selector: `ObjectPattern > Property[computed=true][key.value=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
        {
          selector: `ObjectPattern > Property[computed=true][key.type="TemplateLiteral"][key.expressions.length=0][key.quasis.0.value.cooked=${STORAGE_NAMES}]`,
          message: "브라우저 저장소는 src/storage.ts의 함수로만 접근하세요.",
        },
      ],
    },
  },
);
