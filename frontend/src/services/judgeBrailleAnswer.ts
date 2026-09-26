import { MISTAKE_REASONS, type MistakeReason } from "../constants/mistakeReasons";
import type { DotJudgement } from "../types/DotJudgement";
import { extraDots, missingDots, sameDotSet } from "../utils/braillePattern";

/**
 * 判定职责：只比较点位，不碰输入状态，也不碰记录保存。
 * expected / selected 均为点位编号数组（1-6）。
 */
export function judgeBrailleAnswer(expected: number[], selected: number[]): DotJudgement {
  return {
    correct: sameDotSet(expected, selected),
    missing: missingDots(expected, selected),
    extra: extraDots(expected, selected)
  };
}

/** 由判定结果推导错题原因，供错题本归类。 */
export function mistakeReasonOf(judgement: DotJudgement): MistakeReason {
  if (judgement.correct) return MISTAKE_REASONS.NONE;
  if (judgement.missing.length > 0 && judgement.extra.length > 0) return MISTAKE_REASONS.MIXED_DOTS;
  if (judgement.missing.length > 0) return MISTAKE_REASONS.MISSING_DOTS;
  return MISTAKE_REASONS.EXTRA_DOTS;
}
