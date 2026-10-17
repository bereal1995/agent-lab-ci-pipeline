import { useEffect, useState, type FormEvent } from "react";
import { loadFilter, loadTodos, saveFilter, saveTodos } from "./storage";
import { orderTodos } from "./features/priority/order";
import { TodoItem } from "./TodoItem";
import { addTodo, filterTodos, MAX_TITLE_LENGTH, removeTodo, toggleTodo, updateTodo, type Filter } from "./todos";

const FILTER_LABEL: Record<Filter, string> = {
  all: "전체",
  active: "진행",
  done: "완료",
};

export function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState<Filter>(loadFilter);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveFilter(filter);
  }, [filter]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTodos((current) => addTodo(current, draft, crypto.randomUUID()));
    setDraft("");
  };

  const visible = orderTodos(filterTodos(todos, filter));
  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <main className="app">
      <h1>할 일</h1>

      <form onSubmit={handleSubmit}>
        <input
          aria-label="새 할 일"
          value={draft}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button type="submit">추가</button>
      </form>

      <div className="filters" role="group" aria-label="필터">
        {(Object.keys(FILTER_LABEL) as Filter[]).map((key) => (
          <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>
            {FILTER_LABEL[key]}
          </button>
        ))}
      </div>

      <ul aria-label="할 일 목록">
        {visible.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => setTodos((current) => toggleTodo(current, todo.id))}
            onRemove={() => setTodos((current) => removeTodo(current, todo.id))}
            onUpdate={(patch) => setTodos((current) => updateTodo(current, todo.id, patch))}
          />
        ))}
      </ul>

      <p aria-live="polite">남은 할 일 {remaining}개</p>
    </main>
  );
}
