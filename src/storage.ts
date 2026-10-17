import type { Filter, Todo } from "./todos";

const STORAGE_KEY = "agent-lab.todos.v1";
const FILTER_KEY = "agent-lab.filter.v1";
const FILTERS: readonly Filter[] = ["all", "active", "done"];

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.title === "string" && typeof record.done === "boolean";
}

export function loadTodos(storage: Storage = window.localStorage): Todo[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
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
