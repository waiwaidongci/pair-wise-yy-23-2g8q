/**
 * AnswerRecord.user_answer 的编码规则：
 * - 单遍作答：点位串，如 "1-2-5"
 * - 两遍作答（第一遍错、第二遍无论对错都保存）："1-2-5|1-5"，竖线分隔第一遍与第二遍
 */

export function encodeAttempt(dots: number[]): string {
  return [...dots].sort((a, b) => a - b).join("-");
}

export function encodeUserAnswer(attempts: number[][]): string {
  return attempts.map(encodeAttempt).join("|");
}

export function decodeUserAnswer(answer: string): number[][] {
  if (!answer) return [];
  return answer.split("|").map((part) =>
    part === "" ? [] : part.split("-").map(Number).filter((dot) => dot >= 1 && dot <= 6)
  );
}
