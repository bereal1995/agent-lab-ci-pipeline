import { useState } from "react";
import type { FeatureFieldProps } from "../types";
import { makeTitlePatch } from "./title";

export function TitleView({ todo, onUpdate }: FeatureFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  const startEditing = () => {
    setDraft(todo.title);
    setIsEditing(true);
  };

  const finishEditing = () => {
    const patch = makeTitlePatch(draft);
    if (patch !== null) {
      onUpdate(patch);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        aria-label={`${todo.title} 제목 편집`}
        value={draft}
        onBlur={finishEditing}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            finishEditing();
          } else if (event.key === "Escape") {
            event.preventDefault();
            setIsEditing(false);
          }
        }}
      />
    );
  }

  return (
    <>
      <span className="todo-title">{todo.title}</span>
      <button type="button" aria-label={`${todo.title} 수정`} onClick={startEditing}>
        수정
      </button>
    </>
  );
}
