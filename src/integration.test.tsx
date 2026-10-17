import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

// 병렬로 만든 세 기능(제목 수정·우선순위·마감일)을 합친 뒤에만 드러나는 교차 동작을 검증한다.

const titles = () => within(screen.getByRole("list", { name: "할 일 목록" })).getAllByRole("checkbox").map((box) => box.getAttribute("aria-label"));

async function addAll(user: ReturnType<typeof userEvent.setup>, names: string[]) {
  for (const name of names) {
    await user.type(screen.getByLabelText("새 할 일"), `${name}{Enter}`);
  }
}

describe("기능 통합", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 17, 12, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("제목을 고치면 우선순위·마감일·완료·삭제의 접근 이름도 새 제목을 따른다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addAll(user, ["우유 사기"]);

    await user.click(screen.getByRole("button", { name: "우유 사기 수정" }));
    const input = screen.getByRole("textbox", { name: "우유 사기 제목 편집" });
    await user.clear(input);
    await user.type(input, "두유 사기{Enter}");

    expect(screen.getByRole("combobox", { name: "두유 사기 우선순위" })).toBeInTheDocument();
    expect(screen.getByLabelText("두유 사기 마감일")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "두유 사기" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "두유 사기 삭제" })).toBeInTheDocument();
  });

  it("정렬된 목록에서도 완료·필터·기한 지남이 올바른 항목에 적용된다", async () => {
    const user = userEvent.setup();
    render(<App />);
    await addAll(user, ["A", "B", "C"]);

    await user.selectOptions(screen.getByRole("combobox", { name: "C 우선순위" }), "high");
    await user.selectOptions(screen.getByRole("combobox", { name: "A 우선순위" }), "low");
    expect(titles()).toEqual(["C", "B", "A"]);

    // 맨 위로 올라온 C를 완료해도 C만 바뀐다.
    await user.click(screen.getByRole("checkbox", { name: "C" }));
    expect(screen.getByRole("checkbox", { name: "C" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "B" })).not.toBeChecked();

    // 진행 필터에서도 우선순위 순서를 유지한다.
    await user.click(screen.getByRole("button", { name: "진행" }));
    expect(titles()).toEqual(["B", "A"]);

    // 지난 마감일은 미완료일 때만 표시된다.
    await user.click(screen.getByRole("button", { name: "전체" }));
    await user.type(screen.getByLabelText("B 마감일"), "2026-10-16");
    await user.type(screen.getByLabelText("C 마감일"), "2026-10-16");
    const row = (name: string) => screen.getByRole("checkbox", { name }).closest("li") as HTMLElement;
    expect(within(row("B")).getByText("기한 지남")).toBeInTheDocument();
    expect(within(row("C")).queryByText("기한 지남")).not.toBeInTheDocument();
  });
});
