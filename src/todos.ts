export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

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
  return [...todos, { id, title, done: false }];
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
