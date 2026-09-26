export type ResultTone = "CORRECT" | "WRONG" | "RETRY";

const RESULT_TEXT: Record<ResultTone, string> = {
  CORRECT: "回答正确",
  WRONG: "回答错误",
  RETRY: "再试一次"
};

export function ResultBadge({ tone }: { tone: ResultTone }) {
  return <span className={`badge result-badge ${tone.toLowerCase()}`}>{RESULT_TEXT[tone]}</span>;
}
