# agent-lab-ci-pipeline

CI 검증 파이프라인 실습용 할 일 앱. React 19 + TypeScript + Vite, pnpm, Node 24(package.json `volta.node`).

## 검증 명령
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`
- PR은 CI의 `ci-pass` 체크가 통과해야 main에 merge된다. main 직접 push는 막혀 있다.

## 구조
- `src/todos.ts`: 할 일 순수 로직. UI와 저장소를 모른다.
- `src/storage.ts`: localStorage 접근은 이 파일에서만 한다.
- `src/date.ts`: 로컬 날짜(`YYYY-MM-DD`) 검증과 오늘 날짜.
- `src/App.tsx`: 화면. 상태 변경은 `todos.ts` 함수로만 한다.
- `src/TodoItem.tsx`: 할 일 한 줄. 기능 영역은 `src/features/<기능>/` 컴포넌트가 채운다.

## Code Review Rules

이 저장소에서 아래 규칙 위반은 테스트가 통과하더라도 merge를 막아야 하는 결함(P1)으로 보고한다.

1. `src/todos.ts`의 함수는 인자로 받은 배열과 객체를 변경하지 않는다. `push`, `splice`, `sort`, 속성 대입으로 입력을 바꾸면 React 상태가 갱신되지 않거나 이전 상태가 오염된다. 항상 새 배열·새 객체를 반환한다.
2. 프로덕션 코드(`*.test.ts(x)`와 `e2e/` 제외)에서 `localStorage`/`sessionStorage`는 `src/storage.ts`에서만 접근한다. 테스트의 픽스처 준비·정리는 예외다. ESLint(`no-restricted-globals`, `no-restricted-syntax`)가 이 규칙을 CI에서 강제한다. 읽기는 파싱 실패나 형식 불일치 시 예외 없이 빈 목록 또는 유효한 항목만 반환해야 한다. 다른 파일에서 직접 접근하면 이 복구 경로를 우회한다.
3. 사용자가 입력한 제목은 `dangerouslySetInnerHTML`이나 `innerHTML`로 렌더링하지 않는다(XSS).
4. 동작을 바꾸는 변경에는 해당 테스트를 함께 추가하거나 고친다. 테스트 삭제·`skip`·`only`로 CI를 통과시키는 변경은 결함으로 본다.

## 병렬 작업 경계

여러 세션이 기능을 동시에 만들 때의 계약이다. 이 계약 자체를 바꾸는 변경은 별도 PR로만 한다.

### 소유 경로
| 기능 | 브랜치 | 수정 가능한 경로 |
| --- | --- | --- |
| 우선순위 | `feat/priority` | `src/features/priority/**`, `e2e/priority.spec.ts` |
| 마감일 | `feat/due` | `src/features/due/**`, `e2e/due.spec.ts` |
| 제목 수정 | `feat/rename` | `src/features/rename/**`, `e2e/rename.spec.ts` |
| 통합 검증 | `chore/integration` | `src/integration.test.tsx`, `e2e/integration.spec.ts` (기능 PR 3개가 모두 merge된 뒤에만) |

- 소유 경로 밖 파일(`src/todos.ts`, `src/storage.ts`, `src/date.ts`, `src/App.tsx`, `src/TodoItem.tsx`, `src/features/types.ts`, 설정 파일 등)은 고치지 않는다. 꼭 필요하면 멈추고 PR 설명에 "계약 변경 요청"으로 이유를 적는다.
- 기존 export 이름과 시그니처(`TitleView`, `PriorityField`, `orderTodos`, `DueField`)는 유지한다. 새 파일·새 export 추가는 자유.
- 상태 변경은 props의 `onUpdate(patch)`로만 한다(`TodoPatch` = `title`/`priority`/`dueDate`). 날짜는 `src/date.ts`의 `isValidLocalDate`, `todayLocal`을 쓴다.
- 테스트: 순수 로직 테스트와 컴포넌트 테스트(`src/features/<기능>/*.test.tsx`)를 함께 추가한다. 화면 흐름은 `e2e/<기능>.spec.ts`.
- e2e는 worktree마다 다른 포트로 돌린다: `E2E_PORT=<4174~> pnpm test:e2e`. 기본 4173을 같이 쓰면 다른 worktree의 서버를 테스트하게 된다.

### 기능 명세
- **우선순위**: 항목마다 select(접근 이름 `<제목> 우선순위`, 선택지 높음/보통/낮음 → `high`/`normal`/`low`). `orderTodos`는 필터 적용 후 목록을 high > normal > low로 정렬하고, 같은 우선순위는 원래 순서를 유지한다(stable). 입력 배열을 바꾸지 않는다.
- **마감일**: 항목마다 date input(접근 이름 `<제목> 마감일`). 비우면 `dueDate: null`. `isOverdue(todo, today)` = `dueDate !== null && !done && dueDate < today`(오늘 마감은 지남 아님). 지난 항목에 "기한 지남" 텍스트를 보인다.
- **제목 수정**: 버튼(접근 이름 `<제목> 수정`)을 누르면 input(접근 이름 `<제목> 제목 편집`, 현재 제목으로 채움)으로 바뀐다. Enter·blur는 저장, Escape는 취소. 저장할 값이 무효(`normalizeTitle`이 `null`)면 저장하지 않고 원래 제목으로 편집을 끝낸다. 편집 중이 아닐 때 제목 텍스트를 보인다.
