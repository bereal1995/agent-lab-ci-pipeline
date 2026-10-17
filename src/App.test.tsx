import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("추가, 완료, 필터가 함께 동작한다", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText("새 할 일"), "우유 사기{Enter}");
    await user.type(screen.getByLabelText("새 할 일"), "운동{Enter}");
    expect(screen.getByText("남은 할 일 2개")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "우유 사기" }));
    expect(screen.getByText("남은 할 일 1개")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "완료" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("우유 사기")).toBeInTheDocument();
  });
});
