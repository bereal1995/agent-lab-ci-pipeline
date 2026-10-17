import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Todo } from "../../todos";
import { TitleView } from "./TitleView";

const todo: Todo = { id: "1", title: "우유 사기", done: false, priority: "normal", dueDate: null };

describe("TitleView", () => {
  it("평소에는 제목과 수정 버튼을 보이고, 버튼을 누르면 현재 제목을 편집한다", async () => {
    const user = userEvent.setup();
    render(<TitleView todo={todo} onUpdate={vi.fn()} />);

    expect(screen.getByText("우유 사기")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));

    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    expect(input).toHaveValue("우유 사기");
    expect(input).toHaveFocus();
  });

  it("Enter로 정리한 제목을 저장하고 편집을 끝낸다", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TitleView todo={todo} onUpdate={onUpdate} />);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    await user.clear(input);
    await user.type(input, "  장보기   목록  {Enter}");

    expect(onUpdate).toHaveBeenCalledOnce();
    expect(onUpdate).toHaveBeenCalledWith({ title: "장보기 목록" });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("IME 조합 중 Enter는 저장하지 않는다", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TitleView todo={todo} onUpdate={onUpdate} />);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    fireEvent.change(input, { target: { value: "장보" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(onUpdate).not.toHaveBeenCalled();
    expect(input).toBeInTheDocument();
  });

  it("blur로 제목을 저장한다", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TitleView todo={todo} onUpdate={onUpdate} />);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    await user.clear(input);
    await user.type(input, "마트 가기");
    await user.tab();

    expect(onUpdate).toHaveBeenCalledOnce();
    expect(onUpdate).toHaveBeenCalledWith({ title: "마트 가기" });
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("Escape는 저장하지 않고 원래 제목으로 돌아간다", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TitleView todo={todo} onUpdate={onUpdate} />);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    await user.clear(input);
    await user.type(input, "바꾸지 않을 제목{Escape}");

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText("우유 사기")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("무효한 값은 저장하지 않고 원래 제목으로 편집을 끝낸다", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<TitleView todo={todo} onUpdate={onUpdate} />);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    await user.clear(input);
    await user.type(input, "   {Enter}");

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText("우유 사기")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
