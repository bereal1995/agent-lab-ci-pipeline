import { describe, expect, it } from "vitest";
import { MAX_TITLE_LENGTH } from "../../todos";
import { makeTitlePatch } from "./title";

describe("makeTitlePatch", () => {
  it("앞뒤와 연속 공백을 정리한 제목 패치를 만든다", () => {
    expect(makeTitlePatch("  우유   사기  ")).toEqual({ title: "우유 사기" });
  });

  it("빈 제목과 최대 길이를 넘는 제목을 거부한다", () => {
    expect(makeTitlePatch("   ")).toBeNull();
    expect(makeTitlePatch("가".repeat(MAX_TITLE_LENGTH + 1))).toBeNull();
  });
});
