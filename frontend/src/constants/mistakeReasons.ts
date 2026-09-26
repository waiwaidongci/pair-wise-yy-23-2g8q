export const MISTAKE_REASONS = {
  NONE: "NONE",
  MISSING_DOTS: "MISSING_DOTS",
  EXTRA_DOTS: "EXTRA_DOTS",
  MIXED_DOTS: "MIXED_DOTS"
} as const;

export type MistakeReason = (typeof MISTAKE_REASONS)[keyof typeof MISTAKE_REASONS];

export const MISTAKE_REASON_TEXT: Record<MistakeReason, string> = {
  NONE: "无错误",
  MISSING_DOTS: "少点：该点的点没点",
  EXTRA_DOTS: "多点：不该点的点被点了",
  MIXED_DOTS: "少点且多点"
};
