export interface PracticeSession {
  id: number;
  lesson_id: number;
  mode: string;
  started_at: string;
  finished_at: string;
  /** 已提交题数（未提交点阵不计入） */
  submitted_count: number;
  score: number;
  mistake_count: number;
}
