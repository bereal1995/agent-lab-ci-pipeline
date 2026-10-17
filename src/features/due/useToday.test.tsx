import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "../../todos";
import { DueField } from "./DueField";

const todo: Todo = { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: "2026-10-17" };

describe("자정이 지나면", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("다른 상호작용 없이도 '기한 지남'이 나타난다", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 17, 23, 59, 0));
    render(<DueField todo={todo} onUpdate={vi.fn()} />);
    expect(screen.queryByText("기한 지남")).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2 * 60 * 1000);
    });
    expect(screen.getByText("기한 지남")).toBeInTheDocument();
  });
});
