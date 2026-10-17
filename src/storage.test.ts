import { beforeEach, describe, expect, it } from "vitest";
import { loadFilter, loadTodos, saveFilter, saveTodos } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("저장한 목록을 다시 읽는다", () => {
    saveTodos([{ id: "1", title: "a", done: false }]);
    expect(loadTodos()).toEqual([{ id: "1", title: "a", done: false }]);
  });

  it("깨진 값은 빈 목록으로 복구한다", () => {
    window.localStorage.setItem("agent-lab.todos.v1", "{not json");
    expect(loadTodos()).toEqual([]);
  });

  it("형식이 맞지 않는 항목은 버린다", () => {
    window.localStorage.setItem("agent-lab.todos.v1", JSON.stringify([{ id: 1 }, { id: "2", title: "b", done: true }]));
    expect(loadTodos()).toEqual([{ id: "2", title: "b", done: true }]);
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
