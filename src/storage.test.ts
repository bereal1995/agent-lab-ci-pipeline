import { beforeEach, describe, expect, it } from "vitest";
import { loadFilter, loadTodos, saveFilter, saveTodos } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("저장한 목록을 다시 읽는다", () => {
    const todos = [{ id: "1", title: "a", done: false, priority: "high", dueDate: "2026-10-20" }] as const;
    saveTodos(todos);
    expect(loadTodos()).toEqual(todos);
  });

  it("깨진 값은 빈 목록으로 복구한다", () => {
    window.localStorage.setItem("agent-lab.todos.v1", "{not json");
    expect(loadTodos()).toEqual([]);
  });

  it("형식이 맞지 않는 항목은 버린다", () => {
    window.localStorage.setItem("agent-lab.todos.v1", JSON.stringify([{ id: 1 }, { id: "2", title: "b", done: true }]));
    expect(loadTodos()).toEqual([{ id: "2", title: "b", done: true, priority: "normal", dueDate: null }]);
  });

  it("예전 형식과 잘못된 새 필드는 기본값으로 보정한다", () => {
    window.localStorage.setItem(
      "agent-lab.todos.v1",
      JSON.stringify([
        { id: "1", title: "예전", done: false },
        { id: "2", title: "잘못된 값", done: false, priority: "urgent", dueDate: "2026-02-30" },
        { id: "3", title: "정상", done: true, priority: "low", dueDate: "2026-10-20" },
      ]),
    );
    expect(loadTodos()).toEqual([
      { id: "1", title: "예전", done: false, priority: "normal", dueDate: null },
      { id: "2", title: "잘못된 값", done: false, priority: "normal", dueDate: null },
      { id: "3", title: "정상", done: true, priority: "low", dueDate: "2026-10-20" },
    ]);
  });

  it("저장한 필터를 다시 읽고, 모르는 값은 전체로 되돌린다", () => {
    saveFilter("done");
    expect(loadFilter()).toBe("done");
    window.localStorage.setItem("agent-lab.filter.v1", "weird");
    expect(loadFilter()).toBe("all");
  });

  it("저장소 접근이 막혀도 예외 없이 기본값을 쓴다", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    } as unknown as Storage;
    expect(loadFilter(broken)).toBe("all");
    expect(() => saveFilter("done", broken)).not.toThrow();
  });
});
