import { PRIORITIES, type Priority, type Todo } from "../../todos";

const RANK: Record<Priority, number> = Object.fromEntries(PRIORITIES.map((p, i) => [p, i])) as Record<
  Priority,
  number
>;

/**
 * 필터 적용 후 목록을 high > normal > low로 정렬한다.
 * 같은 우선순위는 원래 순서를 유지한다(stable). 입력 배열은 바꾸지 않는다.
 */
export function orderTodos(todos: readonly Todo[]): Todo[] {
  return todos
    .map((todo, index) => ({ todo, index }))
    .sort((a, b) => RANK[a.todo.priority] - RANK[b.todo.priority] || a.index - b.index)
    .map(({ todo }) => todo);
}
