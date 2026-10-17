import { beforeEach, describe, expect, it } from "vitest";
import { loadTodos, saveTodos } from "./storage";

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
});
