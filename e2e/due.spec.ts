import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // 오늘을 2026-10-17 정오(브라우저 로컬 시간)로 고정한다.
  await page.clock.setFixedTime(new Date(2026, 9, 17, 12, 0));
});

test("마감일을 정하면 지난 항목에 '기한 지남'이 보이고, 새로고침해도 유지되며, 비우면 사라진다", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("새 할 일").fill("우유 사기");
  await page.getByRole("button", { name: "추가" }).click();

  const due = page.getByLabel("우유 사기 마감일");
  const item = page.getByRole("listitem").filter({ has: due });

  await due.fill("2026-10-17");
  await expect(item.getByText("기한 지남")).toHaveCount(0);

  await due.fill("2026-10-16");
  await expect(item.getByText("기한 지남")).toBeVisible();

  await page.reload();
  await expect(due).toHaveValue("2026-10-16");
  await expect(item.getByText("기한 지남")).toBeVisible();

  await page.getByRole("checkbox", { name: "우유 사기" }).check();
  await expect(item.getByText("기한 지남")).toHaveCount(0);
  await page.getByRole("checkbox", { name: "우유 사기" }).uncheck();
  await expect(item.getByText("기한 지남")).toBeVisible();

  await due.fill("");
  await expect(due).toHaveValue("");
  await expect(item.getByText("기한 지남")).toHaveCount(0);

  await page.reload();
  await expect(due).toHaveValue("");
});
