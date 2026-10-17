import { expect, test } from "@playwright/test";

test("세 기능의 값이 함께 저장되고 새로고침 뒤에도 정렬·표시가 유지된다", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 9, 17, 12, 0));
  await page.goto("/");

  for (const name of ["우유 사기", "운동"]) {
    await page.getByLabel("새 할 일").fill(name);
    await page.getByRole("button", { name: "추가" }).click();
  }

  await page.getByRole("button", { name: "운동 수정" }).click();
  await page.getByRole("textbox", { name: "운동 제목 편집" }).fill("아침 운동");
  await page.keyboard.press("Enter");
  await page.getByRole("combobox", { name: "아침 운동 우선순위" }).selectOption("high");
  await page.getByLabel("아침 운동 마감일").fill("2026-10-16");

  await page.reload();

  const list = page.getByRole("list", { name: "할 일 목록" });
  await expect(list.getByRole("checkbox")).toHaveCount(2);
  await expect(list.getByRole("checkbox").first()).toHaveAccessibleName("아침 운동");
  await expect(page.getByRole("combobox", { name: "아침 운동 우선순위" })).toHaveValue("high");
  await expect(page.getByLabel("아침 운동 마감일")).toHaveValue("2026-10-16");
  await expect(page.getByText("기한 지남")).toHaveCount(1);
});
