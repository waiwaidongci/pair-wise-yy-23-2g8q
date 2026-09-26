import { StatusBadge } from "./StatusBadge";

interface ResultBadgeProps {
  /** 本次提交判定结果；未提供时兼容旧的字符串 value */
  correct?: boolean | null;
  value?: string;
}

/** 提交结果徽标：CORRECT / WRONG */
export function ResultBadge({ correct = null, value }: ResultBadgeProps) {
  const status = value ?? (correct === null ? "READY" : correct ? "CORRECT" : "WRONG");
  const label = correct === null ? undefined : correct ? "答对" : "答错";
  return (
    <span className="result-badge">
      <StatusBadge value={status} />
      {label ? <em>{label}</em> : null}
    </span>
  );
}
