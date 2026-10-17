import { expect, test } from "@playwright/test";

test("할 일을 추가하고 새로고침해도 유지된다", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("새 할 일").fill("우유 사기");
  await page.getByRole("button", { name: "추가" }).click();
  await page.getByRole("checkbox", { name: "우유 사기" }).check();

  await page.reload();

  await expect(page.getByRole("checkbox", { name: "우유 사기" })).toBeChecked();
  await expect(page.getByText("남은 할 일 0개")).toBeVisible();
});

test("고른 필터가 새로고침 뒤에도 유지된다", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("새 할 일").fill("우유 사기");
  await page.getByRole("button", { name: "추가" }).click();
  await page.getByLabel("새 할 일").fill("운동");
  await page.getByRole("button", { name: "추가" }).click();
  await page.getByRole("checkbox", { name: "운동" }).check();
  await page.getByRole("button", { name: "완료" }).click();

  await page.reload();

  await expect(page.getByRole("button", { name: "완료" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByRole("checkbox", { name: "운동" })).toBeVisible();
});
