import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("제목을 저장하거나 취소하고 새로고침 뒤에도 유지한다", async ({ page }) => {
  await page.getByLabel("새 할 일").fill("우유 사기");
  await page.getByRole("button", { name: "추가" }).click();

  await page.getByRole("button", { name: "우유 사기 수정" }).click();
  const firstInput = page.getByRole("textbox", { name: "우유 사기 제목 편집" });
  await expect(firstInput).toBeFocused();
  await expect(firstInput).toHaveValue("우유 사기");
  await firstInput.fill("  장보기   목록  ");
  await firstInput.press("Enter");
  await expect(page.getByText("장보기 목록", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "장보기 목록 수정" }).click();
  const cancelInput = page.getByRole("textbox", { name: "장보기 목록 제목 편집" });
  await cancelInput.fill("취소할 제목");
  await cancelInput.press("Escape");
  await expect(page.getByText("장보기 목록", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "장보기 목록 수정" }).click();
  const invalidInput = page.getByRole("textbox", { name: "장보기 목록 제목 편집" });
  await invalidInput.fill("   ");
  await page.getByRole("heading", { name: "할 일" }).click();
  await expect(page.getByText("장보기 목록", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "장보기 목록 수정" }).click();
  const blurInput = page.getByRole("textbox", { name: "장보기 목록 제목 편집" });
  await blurInput.fill("마트 가기");
  await page.getByRole("heading", { name: "할 일" }).click();
  await expect(page.getByText("마트 가기", { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText("마트 가기", { exact: true })).toBeVisible();
});
