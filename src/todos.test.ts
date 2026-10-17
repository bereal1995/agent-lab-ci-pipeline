import { describe, expect, it } from "vitest";
import { addTodo, filterTodos, MAX_TITLE_LENGTH, normalizeTitle, removeTodo, toggleTodo, type Todo } from "./todos";

const sample: Todo[] = [
  { id: "1", title: "우유 사기", done: false },
  { id: "2", title: "운동", done: true },
];

describe("normalizeTitle", () => {
  it("앞뒤 공백을 지우고 연속 공백을 하나로 줄인다", () => {
    expect(normalizeTitle("  장 보기   목록  ")).toBe("장 보기 목록");
  });

  it("빈 값과 최대 길이 초과는 거부한다", () => {
    expect(normalizeTitle("   ")).toBeNull();
    expect(normalizeTitle("가".repeat(MAX_TITLE_LENGTH + 1))).toBeNull();
    expect(normalizeTitle("가".repeat(MAX_TITLE_LENGTH))).toHaveLength(MAX_TITLE_LENGTH);
  });
});

describe("todo 조작", () => {
  it("추가하면 끝에 미완료로 붙는다", () => {
    expect(addTodo(sample, "책 읽기", "3").at(-1)).toEqual({ id: "3", title: "책 읽기", done: false });
  });

  it("잘못된 제목은 추가하지 않는다", () => {
    expect(addTodo(sample, "  ", "3")).toEqual(sample);
  });

  it("토글은 해당 항목만 바꾼다", () => {
    expect(toggleTodo(sample, "1").map((todo) => todo.done)).toEqual([true, true]);
  });

  it("삭제는 해당 항목만 지운다", () => {
    expect(removeTodo(sample, "2").map((todo) => todo.id)).toEqual(["1"]);
  });

  it("필터는 상태별로 나눈다", () => {
    expect(filterTodos(sample, "active").map((todo) => todo.id)).toEqual(["1"]);
    expect(filterTodos(sample, "done").map((todo) => todo.id)).toEqual(["2"]);
    expect(filterTodos(sample, "all")).toHaveLength(2);
  });
});
