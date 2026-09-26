import { useMemo } from "react";
import type { AnswerRecord } from "../types/AnswerRecord";

/**
 * 记录层 hook：基于一次会话的已提交答题记录汇总当前练习统计。
 * 统计只认已提交记录；未提交的点阵草稿不产生 AnswerRecord。
 */
export function usePracticeSession(records: AnswerRecord[] = []) {
  return useMemo(() => {
    const submittedCount = records.length;
    const mistakeCount = records.filter((record) => record.correct === "0").length;
    const correctCount = submittedCount - mistakeCount;
    const accuracy = submittedCount === 0 ? 0 : Math.round((correctCount / submittedCount) * 100);
    return { submittedCount, mistakeCount, correctCount, accuracy };
  }, [records]);
}
