import { defineConfig, devices } from "@playwright/test";

// worktree를 여러 개 동시에 돌릴 때 서로 다른 포트를 준다(E2E_PORT=4174 pnpm test:e2e).
// 같은 포트면 reuseExistingServer가 다른 worktree의 서버를 테스트한다.
const PORT = Number(process.env.E2E_PORT ?? 4173);
if (!Number.isInteger(PORT) || PORT < 1024 || PORT > 65535) {
  throw new Error(`E2E_PORT가 올바르지 않습니다: ${process.env.E2E_PORT}`);
}

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
