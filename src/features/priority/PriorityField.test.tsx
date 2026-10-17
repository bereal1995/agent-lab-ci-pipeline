import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "../../todos";
import { PriorityField } from "./PriorityField";

const todo: Todo = { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: null };

describe("PriorityField", () => {
  it("접근 이름이 '<제목> 우선순위'이고 현재 우선순위를 보여 준다", () => {
    render(<PriorityField todo={todo} onUpdate={vi.fn()} />);
    const select = screen.getByRole("combobox", { name: "우유 사기 우선순위" });
    expect(select).toHaveValue("normal");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["높음", "보통", "낮음"]);
  });

  it.each([
    ["높음", "high"],
    ["낮음", "low"],
  ] as const)("%s을 고르면 onUpdate({ priority: %s })를 부른다", async (label, value) => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<PriorityField todo={todo} onUpdate={onUpdate} />);

    await user.selectOptions(screen.getByRole("combobox", { name: "우유 사기 우선순위" }), label);

    expect(onUpdate).toHaveBeenCalledExactlyOnceWith({ priority: value });
  });
});
