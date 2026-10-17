import type { Todo, TodoPatch } from "../todos";

/** 모든 기능 컴포넌트가 받는 props. 바꾸려면 계약 변경 PR이 필요하다. */
export type FeatureFieldProps = {
  todo: Todo;
  onUpdate: (patch: TodoPatch) => void;
};
