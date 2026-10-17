// @vitest-environment node
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

// AGENTS.md Code Review Rules 2번을 강제하는 ESLint 설정이 빠지거나 범위가 틀어지면 이 테스트가 실패한다.
const eslint = new ESLint();

async function storageErrors(code: string, filePath: string) {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? []).filter((m) =>
    ["no-restricted-globals", "no-restricted-syntax"].includes(m.ruleId ?? ""),
  );
}

describe("브라우저 저장소 접근 경계", () => {
  it.each([
    ["전역 직접 접근", `export const a = localStorage.getItem("k");`],
    ["window 경유", `export const a = window.sessionStorage.length;`],
    ["globalThis 경유", `export const a = globalThis.localStorage;`],
    ["document.defaultView 경유", `export const a = document.defaultView?.localStorage;`],
    ["별칭 변수 경유", `const w = window;\nexport const a = w.localStorage;`],
    ["대괄호 접근", `export const a = window["localStorage"];`],
    ["구조 분해", `const { localStorage: ls } = window;\nexport const a = ls;`],
    ["템플릿 문자열 키", "export const a = window[`localStorage`];"],
    ["계산된 키 구조 분해", `const { ["sessionStorage"]: ss } = window;\nexport const a = ss;`],
    ["템플릿 키 구조 분해", "const { [`localStorage`]: ls } = window;\nexport const a = ls;"],
  ])("src 코드에서 %s을 막는다", async (_, code) => {
    expect(await storageErrors(code, "src/Feature.tsx")).not.toHaveLength(0);
  });

  it("src/storage.ts와 테스트 파일은 허용한다", async () => {
    const code = `export const a = window.localStorage.getItem("k");`;
    expect(await storageErrors(code, "src/storage.ts")).toHaveLength(0);
    expect(await storageErrors(code, "src/App.test.tsx")).toHaveLength(0);
  });
});
