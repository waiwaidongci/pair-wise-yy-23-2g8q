import type { PracticeSession } from "../types/PracticeSession";

export const createDefaultPracticeSession = (overrides: Partial<PracticeSession> = {}): PracticeSession => ({
  id: 0,
  lesson_id: 1,
  mode: "TEXT_TO_CELL",
  started_at: "",
  finished_at: "",
  submitted_count: 0,
  score: 0,
  mistake_count: 0,
  ...overrides
});

export const createPracticeSessionForm = createDefaultPracticeSession;
export const createPracticeSessionResponse = createDefaultPracticeSession;

/** 离开练习页时，仅根据已提交的答题记录汇总会话（未提交草稿不计入） */
export const createFinishedPracticeSession = (params: {
  id: number;
  lessonId: number;
  mode: string;
  startedAt: string;
  finishedAt: string;
  submittedCount: number;
  mistakeCount: number;
}): PracticeSession =>
  createDefaultPracticeSession({
    id: params.id,
    lesson_id: params.lessonId,
    mode: params.mode,
    started_at: params.startedAt,
    finished_at: params.finishedAt,
    submitted_count: params.submittedCount,
    score: params.submittedCount === 0 ? 0 : Math.round(((params.submittedCount - params.mistakeCount) / params.submittedCount) * 100),
    mistake_count: params.mistakeCount
  });
