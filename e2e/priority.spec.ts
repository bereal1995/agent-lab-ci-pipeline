import { expect, test } from "@playwright/test";

test("우선순위를 바꾸면 높음 > 보통 > 낮음 순으로 정렬되고 새로고침 뒤에도 유지된다", async ({ page }) => {
  await page.goto("/");

  for (const title of ["우유 사기", "운동", "청소"]) {
    await page.getByLabel("새 할 일").fill(title);
    await page.getByRole("button", { name: "추가" }).click();
  }

  await page.getByRole("combobox", { name: "우유 사기 우선순위" }).selectOption({ label: "낮음" });
  await page.getByRole("combobox", { name: "청소 우선순위" }).selectOption({ label: "높음" });

  const priorities = page.getByRole("listitem").getByRole("combobox");
  const expectedNames = ["청소 우선순위", "운동 우선순위", "우유 사기 우선순위"];
  for (const [index, name] of expectedNames.entries()) {
    await expect(priorities.nth(index)).toHaveAccessibleName(name);
  }

  await page.reload();

  for (const [index, name] of expectedNames.entries()) {
    await expect(priorities.nth(index)).toHaveAccessibleName(name);
  }
  await expect(page.getByRole("combobox", { name: "청소 우선순위" })).toHaveValue("high");
  await expect(page.getByRole("combobox", { name: "우유 사기 우선순위" })).toHaveValue("low");
});
