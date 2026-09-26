/**
 * 六点盲文判定层：只负责点阵字符串与点位集合之间的转换、比较，
 * 不持有任何练习状态（输入状态见 useSixDotInput，记录保存见 api 层）。
 */
export type DotNumber = 1 | 2 | 3 | 4 | 5 | 6;
export const DOT_NUMBERS: DotNumber[] = [1, 2, 3, 4, 5, 6];

/** "1-3-5" -> [1,3,5]；空串 -> [] */
export function parsePattern(pattern: string): DotNumber[] {
  return pattern
    .split("-")
    .map((token) => Number(token.trim()))
    .filter((dot): dot is DotNumber => (DOT_NUMBERS as number[]).includes(dot))
    .sort((a, b) => a - b);
}

/** [1,3,5] -> "1-3-5"；[] -> "" */
export function formatPattern(dots: readonly number[]): string {
  return [...dots].filter((dot): dot is DotNumber => (DOT_NUMBERS as number[]).includes(dot)).sort((a, b) => a - b).join("-");
}

export interface PatternJudgement {
  correct: boolean;
  /** 该点但未点（目标有点位、学员没点） */
  missingDots: DotNumber[];
  /** 不该点却点了（目标无点位、学员点了） */
  extraDots: DotNumber[];
}

/** 比较学员点阵与目标点阵，标出漏点与多点 */
export function judgePattern(answer: string, target: string): PatternJudgement {
  const answered = new Set(parsePattern(answer));
  const expected = new Set(parsePattern(target));
  const missingDots = DOT_NUMBERS.filter((dot) => expected.has(dot) && !answered.has(dot));
  const extraDots = DOT_NUMBERS.filter((dot) => answered.has(dot) && !expected.has(dot));
  return {
    correct: missingDots.length === 0 && extraDots.length === 0,
    missingDots,
    extraDots
  };
}

/** 由判定结果归类错题原因 */
export function classifyMistake(judgement: Pick<PatternJudgement, "missingDots" | "extraDots">): string {
  if (judgement.missingDots.length > 0 && judgement.extraDots.length > 0) return "MIXED_DOT";
  if (judgement.missingDots.length > 0) return "MISSING_DOT";
  if (judgement.extraDots.length > 0) return "EXTRA_DOT";
  return "";
}
