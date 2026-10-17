import { normalizeTitle, type TodoPatch } from "../../todos";

/** 편집 문자열을 상태 변경 계약에 맞는 패치로 바꾼다. */
export function makeTitlePatch(raw: string): TodoPatch | null {
  const title = normalizeTitle(raw);
  return title === null ? null : { title };
}
