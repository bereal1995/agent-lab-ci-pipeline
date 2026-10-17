import { describe, expect, it } from "vitest";
import {
  addTodo,
  filterTodos,
  MAX_TITLE_LENGTH,
  normalizeTitle,
  removeTodo,
  toggleTodo,
  updateTodo,
  type Todo,
} from "./todos";

const sample: Todo[] = [
  { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: null },
  { id: "2", title: "운동", done: true, priority: "high", dueDate: "2026-10-20" },
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
    expect(addTodo(sample, "책 읽기", "3").at(-1)).toEqual({
      id: "3",
      title: "책 읽기",
      done: false,
      priority: "normal",
      dueDate: null,
    });
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

describe("updateTodo", () => {
  it("해당 항목의 허용된 필드만 새 객체로 바꾸고 입력은 그대로 둔다", () => {
    const before = structuredClone(sample);
    const next = updateTodo(sample, "1", { priority: "low", dueDate: "2026-11-01" });
    expect(next[0]).toEqual({ ...sample[0], priority: "low", dueDate: "2026-11-01" });
    expect(next[1]).toBe(sample[1]);
    expect(sample).toEqual(before);
  });

  it("제목은 정규화해서 저장한다", () => {
    expect(updateTodo(sample, "1", { title: "  두유   사기 " })[0]?.title).toBe("두유 사기");
  });

  it("마감일을 null로 지울 수 있다", () => {
    expect(updateTodo(sample, "2", { dueDate: null })[1]?.dueDate).toBeNull();
  });

  it("undefined인 필드는 바꾸지 않는다", () => {
    expect(updateTodo(sample, "1", { title: undefined, priority: undefined, dueDate: undefined })[0]).toEqual(sample[0]);
  });

  it("무효한 값이 하나라도 있으면 아무것도 바꾸지 않는다", () => {
    for (const patch of [
      { title: "   " },
      { title: "새 제목", dueDate: "2026-02-30" },
      { dueDate: "2026/10/20" },
      { priority: "urgent" as never },
    ]) {
      const next = updateTodo(sample, "1", patch);
      expect(next).toEqual(sample);
      expect(next).not.toBe(sample);
    }
  });
});
