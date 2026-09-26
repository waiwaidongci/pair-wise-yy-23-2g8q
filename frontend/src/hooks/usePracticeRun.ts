import { useCallback, useEffect, useRef, useState } from "react";
import { FINAL_ATTEMPT, FIRST_ATTEMPT } from "../constants/MistakeReason";
import { PracticeMode } from "../constants/PracticeMode";
import { createFinishedPracticeSession } from "../constructors/PracticeSessionConstructor";
import { createSubmittedAnswerRecord } from "../constructors/AnswerRecordConstructor";
import { classifyMistake, judgePattern, type PatternJudgement } from "../utils/braillePattern";
import { useAnswerRecordStore } from "../stores/AnswerRecordStore";
import { usePracticeSessionStore } from "../stores/PracticeSessionStore";
import { usePracticeSession } from "./usePracticeSession";
import type { AnswerRecord } from "../types/AnswerRecord";
import type { BrailleSymbol } from "../types/BrailleSymbol";

export interface RunFeedback {
  answer: string;
  firstAnswer: string;
  attempt: number;
  judgement: PatternJudgement;
  mistakeReason: string;
}

/**
 * answering     输入中（第一遍或第二遍），可点击六点并提交
 * first_review  第一遍答错的标注页：不落库、锁住输入，点“再试一次”清空重答
 * done          第二遍已提交（对错都已保存）：锁住输入，点“换一题”
 */
type RunPhase = "answering" | "first_review" | "done";

/**
 * 练习编排层：题目队列、两遍作答状态机、离开时会话汇总。
 * 输入状态归 useSixDotInput，判定归 utils/useBraillePattern，落库归 store/api；
 * 本 hook 只按“第一遍答错可再试、第二遍无论对错都保存、仍错进错题本”的规则串联。
 */
export function usePracticeRun(symbols: BrailleSymbol[]) {
  const addRecord = useAnswerRecordStore((state) => state.addRecord);
  const saveSession = usePracticeSessionStore((state) => state.saveSession);

  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState<number>(FIRST_ATTEMPT);
  const [phase, setPhase] = useState<RunPhase>("answering");
  const [feedback, setFeedback] = useState<RunFeedback | null>(null);
  const [submitted, setSubmitted] = useState<AnswerRecord[]>([]);
  const questionStartedAtRef = useRef<number>(Date.now());

  // 会话 id 在进入练习时确定；未提交任何题目则不产生会话记录
  const sessionIdRef = useRef(Date.now());
  const startedAtRef = useRef(new Date().toISOString());
  const submittedRef = useRef<AnswerRecord[]>([]);
  submittedRef.current = submitted;

  const current = symbols[index];
  const finished = symbols.length > 0 && index >= symbols.length;
  const locked = phase !== "answering";
  const firstWrongReview = phase === "first_review";
  const finalReviewed = phase === "done";

  // 统计只认已经提交的记录（输入/判定/记录三层分离中的记录消费侧）
  const stats = usePracticeSession(submitted);

  /** 提交当前点阵；返回判定结果供输入层展示漏点/多点 */
  const submit = useCallback(
    async (answer: string): Promise<void> => {
      if (!current || phase !== "answering") return;
      const target = current.cell_pattern;
      const judgement = judgePattern(answer, target);
      const mistakeReason = classifyMistake(judgement);

      // 第一遍答错：不保存，进入标注页，学员可再试一次
      if (attempt === FIRST_ATTEMPT && !judgement.correct) {
        setFeedback({ answer, firstAnswer: answer, attempt: FIRST_ATTEMPT, judgement, mistakeReason });
        setPhase("first_review");
        return;
      }

      // 第二遍（或第一遍即对）：无论对错都保存
      const firstAnswer = attempt === FINAL_ATTEMPT ? feedback?.answer ?? "" : "";
      const saved = await addRecord(
        createSubmittedAnswerRecord({
          id: 0,
          sessionId: sessionIdRef.current,
          symbolId: current.id,
          answer,
          firstAnswer,
          correct: judgement.correct,
          latencyMs: Date.now() - questionStartedAtRef.current,
          mistakeReason
        })
      );
      setSubmitted((rows) => [...rows, saved]);
      setFeedback({ answer, firstAnswer, attempt: FINAL_ATTEMPT, judgement, mistakeReason });
      setPhase("done");
    },
    [addRecord, current, attempt, feedback, phase]
  );

  /** 第一遍答错后“再试一次”：解锁当前题，点阵草稿由输入层清空 */
  const retryReset = useCallback(() => {
    setFeedback(null);
    setAttempt(FINAL_ATTEMPT);
    setPhase("answering");
    questionStartedAtRef.current = Date.now();
  }, []);

  /** 换题：未提交的判定反馈与点阵草稿一并作废（草稿由输入层 clear） */
  const goNext = useCallback(() => {
    setFeedback(null);
    setAttempt(FIRST_ATTEMPT);
    setPhase("answering");
    questionStartedAtRef.current = Date.now();
    setIndex((value) => value + 1);
  }, []);

  // 离开练习页：统计只认已经提交的记录，未提交点阵不会产生任何数据
  useEffect(() => {
    return () => {
      const rows = submittedRef.current;
      if (rows.length === 0) return;
      const mistakeCount = rows.filter((record) => record.correct === "0").length;
      void saveSession(
        createFinishedPracticeSession({
          id: sessionIdRef.current,
          lessonId: 1,
          mode: PracticeMode[1], // TEXT_TO_CELL：看字母/拼音拼六点
          startedAt: startedAtRef.current,
          finishedAt: new Date().toISOString(),
          submittedCount: rows.length,
          mistakeCount
        })
      );
    };
  }, [saveSession]);

  return {
    current,
    index,
    total: symbols.length,
    attempt,
    phase,
    feedback,
    locked,
    firstWrongReview,
    finalReviewed,
    finished,
    stats,
    submit,
    goNext,
    retryReset
  };
}
