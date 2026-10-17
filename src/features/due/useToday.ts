import { useEffect, useState } from "react";
import { todayLocal } from "../../date";

function msUntilNextLocalDay(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

/** 로컬 오늘 날짜. 페이지를 열어 둔 채 자정이 지나면 다시 그린다. */
export function useToday(): string {
  const [today, setToday] = useState(() => todayLocal());

  useEffect(() => {
    const timer = setTimeout(() => setToday(todayLocal()), msUntilNextLocalDay(new Date()) + 50);
    return () => clearTimeout(timer);
  }, [today]);

  return today;
}
