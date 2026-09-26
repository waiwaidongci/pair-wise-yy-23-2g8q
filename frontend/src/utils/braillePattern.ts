/** 盲文一方固定 6 个点位，编号 1-6（左列 1/2/3，右列 4/5/6）。 */
export const BRAILLE_DOT_IDS = [1, 2, 3, 4, 5, 6] as const;

export type BrailleDotId = (typeof BRAILLE_DOT_IDS)[number];

/** "1-2-5" -> [1, 2, 5]，空串 -> [] */
export function parseCellPattern(pattern: string): number[] {
  return pattern
    .split("-")
    .map((part) => Number(part.trim()))
    .filter((dot) => BRAILLE_DOT_IDS.includes(dot as BrailleDotId));
}

/** [1, 2, 5] -> "1-2-5" */
export function formatCellPattern(dots: number[]): string {
  return [...dots].sort((a, b) => a - b).join("-");
}

export function sameDotSet(a: number[], b: number[]): boolean {
  return formatCellPattern(a) === formatCellPattern(b);
}

/** 在 expected 里但不在 actual 里：少点 */
export function missingDots(expected: number[], actual: number[]): number[] {
  return expected.filter((dot) => !actual.includes(dot));
}

/** 在 actual 里但不在 expected 里：多点 */
export function extraDots(expected: number[], actual: number[]): number[] {
  return actual.filter((dot) => !expected.includes(dot));
}
