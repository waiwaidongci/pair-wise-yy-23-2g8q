import { create } from "zustand";
import { ERROR_CODES } from "../constants/errorCodes";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { judgeBrailleAnswer, mistakeReasonOf } from "../services/judgeBrailleAnswer";
import { encodeUserAnswer } from "../utils/answerEncoding";
import { parseCellPattern } from "../utils/braillePattern";
import { useAnswerRecordStore } from "./AnswerRecordStore";
import type { BrailleSymbol } from "../types/BrailleSymbol";
import type { DotJudgement } from "../types/DotJudgement";

/** ANSWERING：第一遍作答中；RETRY：第一遍错，第二遍作答中；RESOLVED：本题已保存，等待换题 */
export type RunStatus = "ANSWERING" | "RETRY" | "RESOLVED";

type State = {
  sessionId: number | null;
  symbolId: number | null;
  status: RunStatus;
  attempt: 1 | 2;
  firstDots: number[];
  firstJudgement: DotJudgement | null;
  lastJudgement: DotJudgement | null;
  answered: number;
  correctCount: number;
  mistakeCount: number;
  questionShownAt: number;
  startSession: (sessionId: number) => void;
  beginSymbol: (symbolId: number) => void;
  submit: (symbol: BrailleSymbol, dots: number[]) => Promise<DotJudgement>;
  resetRun: () => void;
};

const freshQuestion = {
  status: "ANSWERING" as RunStatus,
  attempt: 1 as const,
  firstDots: [] as number[],
  firstJudgement: null,
  lastJudgement: null,
  questionShownAt: Date.now()
};

export const usePracticeRunStore = create<State>((set, get) => ({
  sessionId: null,
  symbolId: null,
  answered: 0,
  correctCount: 0,
  mistakeCount: 0,
  ...freshQuestion,

  startSession(sessionId) {
    set({ sessionId, answered: 0, correctCount: 0, mistakeCount: 0 });
  },

  /** 换题：重置流程状态，未提交的点阵由输入层随 resetKey 一并清掉 */
  beginSymbol(symbolId) {
    console.info(LOG_TEMPLATES.PracticeRun[3], symbolId);
    set({ symbolId, ...freshQuestion, questionShownAt: Date.now() });
  },

  async submit(symbol, dots) {
    if (dots.length === 0) throw new Error(ERROR_CODES.EMPTY_ANSWER);
    const { attempt, firstDots, sessionId, questionShownAt } = get();
    const judgement = judgeBrailleAnswer(parseCellPattern(symbol.cell_pattern), dots);
    console.info(LOG_TEMPLATES.PracticeRun[0], { symbolId: symbol.id, attempt, ...judgement });

    // 第一遍答错：不保存，给一次再试机会
    if (attempt === 1 && !judgement.correct) {
      set({ firstJudgement: judgement, lastJudgement: judgement, firstDots: [...dots], attempt: 2, status: "RETRY" });
      return judgement;
    }

    // 第一遍即对，或第二遍无论对错：保存答题记录（统计只认这批已提交记录）
    const attempts = attempt === 1 ? [dots] : [firstDots, dots];
    await useAnswerRecordStore.getState().save({
      session_id: sessionId ?? 0,
      symbol_id: symbol.id,
      user_answer: encodeUserAnswer(attempts),
      correct: judgement.correct,
      latency_ms: Date.now() - questionShownAt,
      mistake_reason: mistakeReasonOf(judgement)
    });
    if (!judgement.correct) console.info(LOG_TEMPLATES.PracticeRun[1], { symbolId: symbol.id, attempts });

    set((state) => ({
      lastJudgement: judgement,
      status: "RESOLVED",
      answered: state.answered + 1,
      correctCount: state.correctCount + (judgement.correct ? 1 : 0),
      mistakeCount: state.mistakeCount + (judgement.correct ? 0 : 1)
    }));
    return judgement;
  },

  resetRun() {
    set({ sessionId: null, symbolId: null, answered: 0, correctCount: 0, mistakeCount: 0, ...freshQuestion });
  }
}));
