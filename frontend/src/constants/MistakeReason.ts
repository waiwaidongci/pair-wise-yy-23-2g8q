/** 答题判定错误原因：仅在第二遍仍答错时写入错题本 */
export const MistakeReason = ["MISSING_DOT", "EXTRA_DOT", "MIXED_DOT"] as const;
export type MistakeReason = (typeof MistakeReason)[number];

export const MistakeReasonText: Record<MistakeReason, string> = {
  MISSING_DOT: "漏点",
  EXTRA_DOT: "多点",
  MIXED_DOT: "漏点且多点"
};

/** 第二遍无论对错都保存；第一遍错误仅触发“再试一次” */
export const FIRST_ATTEMPT = 1;
export const FINAL_ATTEMPT = 2;
