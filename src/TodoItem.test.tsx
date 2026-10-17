import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoItem } from "./TodoItem";
import type { Todo } from "./todos";

const todo: Todo = { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: null };

describe("TodoItem", () => {
  it("체크박스 이름은 제목이고, 제목 영역을 눌러도 완료가 토글되지 않는다", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ul>
        <TodoItem todo={todo} onToggle={onToggle} onRemove={vi.fn()} onUpdate={vi.fn()} />
      </ul>,
    );

    await user.click(screen.getByText("우유 사기"));
    expect(onToggle).not.toHaveBeenCalled();

    await user.click(screen.getByRole("checkbox", { name: "우유 사기" }));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
