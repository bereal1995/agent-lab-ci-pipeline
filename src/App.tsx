import { useEffect, useState, type FormEvent } from "react";
import { loadTodos, saveTodos } from "./storage";
import { addTodo, filterTodos, MAX_TITLE_LENGTH, removeTodo, toggleTodo, type Filter } from "./todos";

const FILTER_LABEL: Record<Filter, string> = {
  all: "전체",
  active: "진행",
  done: "완료",
};

export function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [filter, setFilter] = useState<Filter>(() => (localStorage.getItem("agent-lab.filter") as Filter) ?? "all");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("agent-lab.filter", filter);
  }, [filter]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTodos((current) => addTodo(current, draft, crypto.randomUUID()));
    setDraft("");
  };

  const visible = filterTodos(todos, filter);
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
          <li key={todo.id} className={todo.done ? "is-done" : undefined}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => setTodos((current) => toggleTodo(current, todo.id))}
              />
              {todo.title}
            </label>
            <button
              type="button"
              aria-label={`${todo.title} 삭제`}
              onClick={() => setTodos((current) => removeTodo(current, todo.id))}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      <p aria-live="polite">남은 할 일 {remaining}개</p>
    </main>
  );
}
