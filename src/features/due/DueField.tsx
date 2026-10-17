import { isValidLocalDate, todayLocal } from "../../date";
import type { FeatureFieldProps } from "../types";
import { isOverdue } from "./overdue";

/** 마감일 입력. 비우면 `dueDate: null`, 지난 항목에는 "기한 지남"을 보인다. */
export function DueField({ todo, onUpdate }: FeatureFieldProps) {
  const overdue = isOverdue(todo, todayLocal());

  return (
    <>
      <input
        type="date"
        aria-label={`${todo.title} 마감일`}
        value={todo.dueDate ?? ""}
        onChange={(event) => {
          const value = event.target.value;
          if (value === "") {
            onUpdate({ dueDate: null });
          } else if (isValidLocalDate(value)) {
            onUpdate({ dueDate: value });
          }
        }}
      />
      {overdue && <span className="due-overdue">기한 지남</span>}
    </>
  );
}
