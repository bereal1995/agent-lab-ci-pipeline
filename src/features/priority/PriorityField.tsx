import { PRIORITIES, type Priority } from "../../todos";
import type { FeatureFieldProps } from "../types";
import { PRIORITY_LABEL } from "./labels";

function isPriority(value: string): value is Priority {
  return (PRIORITIES as readonly string[]).includes(value);
}

export function PriorityField({ todo, onUpdate }: FeatureFieldProps) {
  return (
    <select
      aria-label={`${todo.title} 우선순위`}
      value={todo.priority}
      onChange={(event) => {
        const value = event.target.value;
        if (isPriority(value)) {
          onUpdate({ priority: value });
        }
      }}
    >
      {PRIORITIES.map((priority) => (
        <option key={priority} value={priority}>
          {PRIORITY_LABEL[priority]}
        </option>
      ))}
    </select>
  );
}
