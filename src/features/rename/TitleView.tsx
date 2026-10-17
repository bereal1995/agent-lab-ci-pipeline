import type { FeatureFieldProps } from "../types";

// 계약 자리: 제목 수정 기능(feat/rename)이 채운다.
export function TitleView({ todo }: FeatureFieldProps) {
  return <span className="todo-title">{todo.title}</span>;
}
