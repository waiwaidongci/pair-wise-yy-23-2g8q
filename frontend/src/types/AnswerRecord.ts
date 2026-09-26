export interface AnswerRecord {
  id: number;
  session_id: number;
  symbol_id: number;
  /** 最终一遍（第二遍）提交的点阵，如 "1-3-5"，空阵为 "" */
  user_answer: string;
  /** 第一遍答错时的点阵；第一遍即答对或尚未答第二遍时为 "" */
  first_answer: string;
  /** "1" 正确 / "0" 错误（以第二遍结果为准） */
  correct: string;
  latency_ms: string;
  /** 错题归类：missing_dot / extra_dot / mixed_dot，答对为 "" */
  mistake_reason: string;
}
