import type { Todo } from "../../todos";

// 계약 자리: 우선순위 기능(feat/priority)이 정렬을 채운다. 입력을 바꾸지 않는다.
export function orderTodos(todos: readonly Todo[]): Todo[] {
  return [...todos];
}
