import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "../../todos";
import { DueField } from "./DueField";

const base: Todo = { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: null };

describe("DueField", () => {
  beforeEach(() => {
    // 오늘을 2026-10-17 정오(로컬)로 고정한다. Date만 가짜로 바꿔 타이머는 그대로 둔다.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 17, 12, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("접근 이름이 '<제목> 마감일'인 date input에 현재 마감일을 보인다", () => {
    render(<DueField todo={{ ...base, dueDate: "2026-10-20" }} onUpdate={vi.fn()} />);

    const input = screen.getByLabelText("우유 사기 마감일");
    expect(input).toHaveAttribute("type", "date");
    expect(input).toHaveValue("2026-10-20");
  });

  it("날짜를 고르면 dueDate 패치를, 비우면 null 패치를 보낸다", () => {
    const onUpdate = vi.fn();
    const { rerender } = render(<DueField todo={base} onUpdate={onUpdate} />);

    fireEvent.change(screen.getByLabelText("우유 사기 마감일"), { target: { value: "2026-10-20" } });
    expect(onUpdate).toHaveBeenLastCalledWith({ dueDate: "2026-10-20" });

    rerender(<DueField todo={{ ...base, dueDate: "2026-10-20" }} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText("우유 사기 마감일"), { target: { value: "" } });
    expect(onUpdate).toHaveBeenLastCalledWith({ dueDate: null });
    expect(onUpdate).toHaveBeenCalledTimes(2);
  });

  it("마감일이 지난 미완료 항목에만 '기한 지남'을 보인다", () => {
    const { rerender } = render(<DueField todo={{ ...base, dueDate: "2026-10-16" }} onUpdate={vi.fn()} />);
    expect(screen.getByText("기한 지남")).toBeInTheDocument();

    rerender(<DueField todo={{ ...base, dueDate: "2026-10-17" }} onUpdate={vi.fn()} />);
    expect(screen.queryByText("기한 지남")).not.toBeInTheDocument();

    rerender(<DueField todo={{ ...base, dueDate: "2026-10-16", done: true }} onUpdate={vi.fn()} />);
    expect(screen.queryByText("기한 지남")).not.toBeInTheDocument();

    rerender(<DueField todo={base} onUpdate={vi.fn()} />);
    expect(screen.queryByText("기한 지남")).not.toBeInTheDocument();
  });
});
