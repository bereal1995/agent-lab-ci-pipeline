import { isValidLocalDate } from "./date";
import { PRIORITIES, type Filter, type Todo } from "./todos";

const STORAGE_KEY = "agent-lab.todos.v1";
const FILTER_KEY = "agent-lab.filter.v1";
const FILTERS: readonly Filter[] = ["all", "active", "done"];

/** 핵심 필드(id/title/done)가 틀리면 버리고, 나중에 생긴 필드는 기본값으로 보정한다. */
function toTodo(value: unknown): Todo | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.title !== "string" || typeof record.done !== "boolean") {
    return null;
  }
  const priority = PRIORITIES.find((p) => p === record.priority) ?? "normal";
  const dueDate = typeof record.dueDate === "string" && isValidLocalDate(record.dueDate) ? record.dueDate : null;
  return { id: record.id, title: record.title, done: record.done, priority, dueDate };
}

export function loadTodos(storage: Storage = window.localStorage): Todo[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.map(toTodo).filter((todo) => todo !== null) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: readonly Todo[], storage: Storage = window.localStorage): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 저장 실패(용량 초과, 사생활 보호 모드)는 화면 동작을 막지 않는다.
  }
}

export function loadFilter(storage: Storage = window.localStorage): Filter {
  try {
    const value = storage.getItem(FILTER_KEY);
    return FILTERS.find((filter) => filter === value) ?? "all";
  } catch {
    return "all";
  }
}

export function saveFilter(filter: Filter, storage: Storage = window.localStorage): void {
  try {
    storage.setItem(FILTER_KEY, filter);
  } catch {
    // 저장 실패는 화면 동작을 막지 않는다.
  }
}
