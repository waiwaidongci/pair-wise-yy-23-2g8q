export interface DotJudgement {
  /** 点位完全一致 */
  correct: boolean;
  /** 该点但未点（少点） */
  missing: number[];
  /** 不该点却点了（多点） */
  extra: number[];
}
