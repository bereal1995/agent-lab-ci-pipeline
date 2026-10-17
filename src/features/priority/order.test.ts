import { describe, expect, it } from "vitest";
import type { Priority, Todo } from "../../todos";
import { orderTodos } from "./order";

const make = (id: string, priority: Priority): Todo => ({ id, title: id, done: false, priority, dueDate: null });

describe("orderTodos", () => {
  it("high > normal > low 순으로 정렬한다", () => {
    const todos = [make("a", "low"), make("b", "high"), make("c", "normal")];
    expect(orderTodos(todos).map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("같은 우선순위는 원래 순서를 유지한다", () => {
    const todos = [
      make("n1", "normal"),
      make("l1", "low"),
      make("h1", "high"),
      make("n2", "normal"),
      make("h2", "high"),
      make("l2", "low"),
      make("n3", "normal"),
    ];
    expect(orderTodos(todos).map((t) => t.id)).toEqual(["h1", "h2", "n1", "n2", "n3", "l1", "l2"]);
  });

  it("입력 배열과 항목을 바꾸지 않고 새 배열을 돌려준다", () => {
    const todos = Object.freeze([make("a", "low"), make("b", "high")].map((t) => Object.freeze(t)));
    const snapshot = structuredClone(todos);
    const result = orderTodos(todos);
    expect(result).not.toBe(todos);
    expect(todos).toEqual(snapshot);
    expect(result[0]).toBe(todos[1]);
  });

  it("빈 목록은 빈 배열을 돌려준다", () => {
    expect(orderTodos([])).toEqual([]);
  });
});
