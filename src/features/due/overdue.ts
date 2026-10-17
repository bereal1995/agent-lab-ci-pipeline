import type { Todo } from "../../todos";

/**
 * 마감일이 지났는지 본다. 완료한 항목과 마감일 없는 항목은 지나지 않은 것으로 본다.
 * 오늘이 마감이면 아직 지나지 않았다. `YYYY-MM-DD`는 문자열 비교가 날짜 순서와 같다.
 */
export function isOverdue(todo: Pick<Todo, "dueDate" | "done">, today: string): boolean {
  return todo.dueDate !== null && !todo.done && todo.dueDate < today;
}
