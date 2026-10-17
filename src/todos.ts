import { isValidLocalDate } from "./date";

export type Priority = "low" | "normal" | "high";

export const PRIORITIES: readonly Priority[] = ["high", "normal", "low"];

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  /** 로컬 날짜 `YYYY-MM-DD`. 없으면 `null`. */
  dueDate: string | null;
};

/** 기능들이 바꿀 수 있는 필드. 상태 변경은 `updateTodo`로만 한다. */
export type TodoPatch = Partial<Pick<Todo, "title" | "priority" | "dueDate">>;

export type Filter = "all" | "active" | "done";

export const MAX_TITLE_LENGTH = 80;

export function normalizeTitle(raw: string): string | null {
  const title = raw.trim().replace(/\s+/g, " ");
  if (title.length === 0 || title.length > MAX_TITLE_LENGTH) {
    return null;
  }
  return title;
}

export function addTodo(todos: readonly Todo[], raw: string, id: string): Todo[] {
  const title = normalizeTitle(raw);
  if (title === null) {
    return [...todos];
  }
  return [...todos, { id, title, done: false, priority: "normal", dueDate: null }];
}

/** 패치 중 하나라도 무효면 아무것도 바꾸지 않고 새 배열을 돌려준다. */
export function updateTodo(todos: readonly Todo[], id: string, patch: TodoPatch): Todo[] {
  // undefined인 키는 "바꾸지 않음"으로 본다. 펼쳐 넣으면 필드가 undefined가 된다.
  const next: Partial<Todo> = {};
  if (patch.title !== undefined) {
    const title = normalizeTitle(patch.title);
    if (title === null) {
      return [...todos];
    }
    next.title = title;
  }
  if (patch.priority !== undefined) {
    if (!PRIORITIES.includes(patch.priority)) {
      return [...todos];
    }
    next.priority = patch.priority;
  }
  if (patch.dueDate !== undefined) {
    if (patch.dueDate !== null && !isValidLocalDate(patch.dueDate)) {
      return [...todos];
    }
    next.dueDate = patch.dueDate;
  }
  return todos.map((todo) => (todo.id === id ? { ...todo, ...next } : todo));
}

export function toggleTodo(todos: readonly Todo[], id: string): Todo[] {
  return todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo));
}

export function removeTodo(todos: readonly Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

export function filterTodos(todos: readonly Todo[], filter: Filter): Todo[] {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.done);
    case "done":
      return todos.filter((todo) => todo.done);
    default:
      return [...todos];
  }
}
