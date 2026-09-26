import type { AnswerRecord } from "../types/AnswerRecord";

export const createDefaultAnswerRecord = (overrides: Partial<AnswerRecord> = {}): AnswerRecord => ({
  id: 0,
  session_id: 0,
  symbol_id: 0,
  user_answer: "",
  first_answer: "",
  correct: "1",
  latency_ms: "0",
  mistake_reason: "",
  ...overrides
});

export const createAnswerRecordForm = createDefaultAnswerRecord;
export const createAnswerRecordResponse = createDefaultAnswerRecord;

/** 构造一次最终提交要落库的答题记录（第二遍结果，含第一遍答案供错题本使用） */
export const createSubmittedAnswerRecord = (params: {
  id: number;
  sessionId: number;
  symbolId: number;
  answer: string;
  firstAnswer: string;
  correct: boolean;
  latencyMs: number;
  mistakeReason: string;
}): AnswerRecord =>
  createDefaultAnswerRecord({
    id: params.id,
    session_id: params.sessionId,
    symbol_id: params.symbolId,
    user_answer: params.answer,
    first_answer: params.firstAnswer,
    correct: params.correct ? "1" : "0",
    latency_ms: String(params.latencyMs),
    mistake_reason: params.correct ? "" : params.mistakeReason
  });
