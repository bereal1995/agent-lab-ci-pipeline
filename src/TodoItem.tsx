import { DueField } from "./features/due/DueField";
import { PriorityField } from "./features/priority/PriorityField";
import { TitleView } from "./features/rename/TitleView";
import type { Todo, TodoPatch } from "./todos";

type Props = {
  todo: Todo;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (patch: TodoPatch) => void;
};

/**
 * 할 일 한 줄. 기능별 영역은 `src/features/<기능>/` 컴포넌트가 채운다(AGENTS.md "병렬 작업 경계").
 * 체크박스를 label로 감싸지 않는다: 제목 영역의 버튼·입력 클릭이 완료 토글로 번지지 않게.
 */
export function TodoItem({ todo, onToggle, onRemove, onUpdate }: Props) {
  return (
    <li className={todo.done ? "is-done" : undefined}>
      <div className="todo-main">
        <input type="checkbox" aria-label={todo.title} checked={todo.done} onChange={onToggle} />
        <TitleView todo={todo} onUpdate={onUpdate} />
      </div>
      <div className="todo-meta">
        <PriorityField todo={todo} onUpdate={onUpdate} />
        <DueField todo={todo} onUpdate={onUpdate} />
      </div>
      <button type="button" aria-label={`${todo.title} 삭제`} onClick={onRemove}>
        삭제
      </button>
    </li>
  );
}
