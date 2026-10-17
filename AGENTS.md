# agent-lab-ci-pipeline

CI 검증 파이프라인 실습용 할 일 앱. React 19 + TypeScript + Vite, pnpm, Node 24(package.json `volta.node`).

## 검증 명령
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`
- PR은 CI의 `ci-pass` 체크가 통과해야 main에 merge된다. main 직접 push는 막혀 있다.

## 구조
- `src/todos.ts`: 할 일 순수 로직. UI와 저장소를 모른다.
- `src/storage.ts`: localStorage 접근은 이 파일에서만 한다.
- `src/App.tsx`: 화면. 상태 변경은 `todos.ts` 함수로만 한다.

## Code Review Rules

이 저장소에서 아래 규칙 위반은 테스트가 통과하더라도 merge를 막아야 하는 결함(P1)으로 보고한다.

1. `src/todos.ts`의 함수는 인자로 받은 배열과 객체를 변경하지 않는다. `push`, `splice`, `sort`, 속성 대입으로 입력을 바꾸면 React 상태가 갱신되지 않거나 이전 상태가 오염된다. 항상 새 배열·새 객체를 반환한다.
2. 프로덕션 코드(`*.test.ts(x)`와 `e2e/` 제외)에서 `localStorage`/`sessionStorage`는 `src/storage.ts`에서만 접근한다. 테스트의 픽스처 준비·정리는 예외다. ESLint(`no-restricted-globals`, `no-restricted-properties`)가 이 규칙을 CI에서 강제한다. 읽기는 파싱 실패나 형식 불일치 시 예외 없이 빈 목록 또는 유효한 항목만 반환해야 한다. 다른 파일에서 직접 접근하면 이 복구 경로를 우회한다.
3. 사용자가 입력한 제목은 `dangerouslySetInnerHTML`이나 `innerHTML`로 렌더링하지 않는다(XSS).
4. 동작을 바꾸는 변경에는 해당 테스트를 함께 추가하거나 고친다. 테스트 삭제·`skip`·`only`로 CI를 통과시키는 변경은 결함으로 본다.
