import { describe, expect, it } from "vitest";
import { isOverdue } from "./overdue";

const TODAY = "2026-10-17";

describe("isOverdue", () => {
  it("마감일이 오늘보다 앞서고 완료하지 않았으면 지났다", () => {
    expect(isOverdue({ dueDate: "2026-10-16", done: false }, TODAY)).toBe(true);
    expect(isOverdue({ dueDate: "2025-12-31", done: false }, TODAY)).toBe(true);
  });

  it("오늘 마감과 미래 마감은 지나지 않았다", () => {
    expect(isOverdue({ dueDate: "2026-10-17", done: false }, TODAY)).toBe(false);
    expect(isOverdue({ dueDate: "2026-10-18", done: false }, TODAY)).toBe(false);
  });

  it("완료했거나 마감일이 없으면 지나지 않았다", () => {
    expect(isOverdue({ dueDate: "2026-10-16", done: true }, TODAY)).toBe(false);
    expect(isOverdue({ dueDate: null, done: false }, TODAY)).toBe(false);
  });

  it("입력 객체를 바꾸지 않는다", () => {
    const todo = Object.freeze({ dueDate: "2026-10-16", done: false });
    expect(isOverdue(todo, TODAY)).toBe(true);
    expect(todo).toEqual({ dueDate: "2026-10-16", done: false });
  });
});
