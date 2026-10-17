import { describe, expect, it } from "vitest";
import { isValidLocalDate, todayLocal } from "./date";

describe("date", () => {
  it("달력에 있는 YYYY-MM-DD만 받는다", () => {
    expect(isValidLocalDate("2026-10-17")).toBe(true);
    expect(isValidLocalDate("2028-02-29")).toBe(true);
    expect(isValidLocalDate("2026-02-29")).toBe(false);
    expect(isValidLocalDate("2026-13-01")).toBe(false);
    expect(isValidLocalDate("2026-1-01")).toBe(false);
    expect(isValidLocalDate("2026-10-17T00:00")).toBe(false);
  });

  it("오늘 날짜를 로컬 시간 기준으로 만든다", () => {
    expect(todayLocal(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});
