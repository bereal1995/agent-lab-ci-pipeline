# agent-lab-ci-pipeline

AI에게 맡긴 PR을 사람이 전부 읽지 않아도 1차로 걸러지게 하는 구조를 연습하는 저장소입니다.

- **강제 차단**: GitHub Actions CI(`ci-pass`)가 실패하면 main에 merge할 수 없습니다(ruleset).
- **자문**: Codex 클라우드 코드 리뷰가 PR에 의견을 남깁니다. merge를 막지는 않습니다. 기준은 `AGENTS.md`의 `Code Review Rules`입니다.

## 실행

```bash
pnpm install
pnpm dev
```

Node 24.15 이상 24.x가 필요합니다(`engines`, `volta.node`). `.npmrc`의 `engine-strict`로 다른 버전에서는 설치가 바로 실패합니다. Volta shim이 PATH에 없으면 `volta run pnpm <script>`로 실행합니다.

## 검증

| 명령 | 내용 |
| --- | --- |
| `pnpm lint` | ESLint. `src/storage.ts` 밖에서 localStorage·sessionStorage를 쓰면 실패 |
| `pnpm typecheck` | `tsc -b` |
| `pnpm test` | Vitest 단위·컴포넌트 테스트 |
| `pnpm test:e2e` | Playwright E2E(chromium). 처음 한 번 `pnpm exec playwright install chromium`. 포트는 기본 4173, 여러 worktree에서 동시에 돌릴 땐 `E2E_PORT=4174 pnpm test:e2e`처럼 바꾼다. |

## CI 구조

`.github/workflows/ci.yml`

- `quality`: lint → typecheck → unit
- `e2e`: 빌드 후 preview 서버에 Playwright 실행, 실패 시 리포트 artifact 업로드(7일 보관)
- `ci-pass`: 위 두 job이 모두 성공했는지 확인하는 집계 job. ruleset의 필수 체크는 이것 하나입니다.

## main 보호 규칙(ruleset)

- PR을 거쳐야 merge 가능(승인 0명)
- `ci-pass` 통과 필수, 최신 main 기준(strict)
- force push·브랜치 삭제 금지, 우회 권한 없음
- merge 방식은 squash만 허용
