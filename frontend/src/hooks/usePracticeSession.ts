import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ERROR_CODES } from "../constants/errorCodes";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { PracticeMode } from "../constants/PracticeMode";
import { useDotInput } from "./useDotInput";
import { usePracticeRunStore } from "../stores/PracticeRunStore";
import { usePracticeSessionStore } from "../stores/PracticeSessionStore";
import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { DotJudgement } from "../types/DotJudgement";

/**
 * 练习编排 hook：
 * - 输入（useDotInput）、判定（services/judgeBrailleAnswer，经 PracticeRunStore 调用）、
 *   记录保存（AnswerRecordStore / PracticeSessionStore）三层分开，本 hook 只负责串联。
 * - 进入页面创建一条练习会话，离开页面结算；未提交的作答不进记录、不进统计。
 */
export function usePracticeSession(symbols: BrailleSymbol[], lessonId = 1) {
  const run = usePracticeRunStore();
  const sessionStore = usePracticeSessionStore();
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startedAtRef = useRef<string>(new Date().toISOString());

  const symbol: BrailleSymbol | null = symbols.length ? symbols[index % symbols.length] : null;

  // resetKey 换题 / 进入第二遍时变化，未提交点阵随之清空；
  // 提交后状态变为 RESOLVED 但 key 不变，点阵保留用于标出少点/多点
  const input = useDotInput(`${run.symbolId ?? "none"}:${run.attempt}`);

  // 当前题目变化 → 开启新题流程
  useEffect(() => {
    if (symbol && run.symbolId !== symbol.id) {
      run.beginSymbol(symbol.id);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol?.id]);

  // 会话生命周期：进入创建、离开结算
  useEffect(() => {
    let cancelled = false;
    startedAtRef.current = new Date().toISOString();
    sessionStore
      .save({
        lesson_id: lessonId,
        mode: PracticeMode[1],
        started_at: startedAtRef.current,
        finished_at: "",
        score: 0,
        mistake_count: 0
      })
      .then((session) => {
        if (!cancelled) usePracticeRunStore.getState().startSession(session.id);
      });
    return () => {
      cancelled = true;
      const state = usePracticeRunStore.getState();
      if (state.sessionId) {
        const score = state.answered > 0 ? Math.round((state.correctCount / state.answered) * 100) : 0;
        void sessionStore.update({
          id: state.sessionId,
          lesson_id: lessonId,
          mode: PracticeMode[1],
          started_at: startedAtRef.current,
          finished_at: new Date().toISOString(),
          score,
          mistake_count: state.mistakeCount
        });
        console.info(LOG_TEMPLATES.PracticeRun[2], { score, mistake_count: state.mistakeCount });
      }
      state.resetRun();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = useCallback(async () => {
    const current = usePracticeRunStore.getState();
    if (!symbol || current.status === "RESOLVED") return;
    setSubmitting(true);
    setError(null);
    try {
      await current.submit(symbol, input.selected);
    } catch (reason) {
      const code = reason instanceof Error ? reason.message : "";
      setError(code === ERROR_CODES.EMPTY_ANSWER ? ERROR_MESSAGES.EMPTY_ANSWER : ERROR_MESSAGES.VALIDATION_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [symbol, input.selected]);

  const next = useCallback(() => {
    setError(null);
    setIndex((value) => value + 1);
  }, []);

  const judgement: DotJudgement | null = run.status === "RETRY" ? run.firstJudgement : run.lastJudgement;

  const tally = useMemo(
    () => ({ answered: run.answered, correctCount: run.correctCount, mistakeCount: run.mistakeCount }),
    [run.answered, run.correctCount, run.mistakeCount]
  );

  return {
    symbol,
    attempt: run.attempt,
    status: run.status,
    selected: input.selected,
    judgement,
    finalJudgement: run.lastJudgement,
    error,
    submitting,
    tally,
    toggleDot: input.toggle,
    submit,
    next
  };
}
