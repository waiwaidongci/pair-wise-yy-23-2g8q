export const mockData = {
  "brailleSymbol": [
    { "id": 1, "cell_pattern": "1", "letter": "a", "pinyin": "ā", "category": "LETTER", "difficulty": "1", "audio_hint_key": "hint_a" },
    { "id": 2, "cell_pattern": "1-2", "letter": "b", "pinyin": "bō", "category": "LETTER", "difficulty": "1", "audio_hint_key": "hint_b" },
    { "id": 3, "cell_pattern": "1-4", "letter": "c", "pinyin": "cī", "category": "LETTER", "difficulty": "1", "audio_hint_key": "hint_c" },
    { "id": 4, "cell_pattern": "1-4-5", "letter": "d", "pinyin": "dē", "category": "LETTER", "difficulty": "1", "audio_hint_key": "hint_d" },
    { "id": 5, "cell_pattern": "1-5", "letter": "e", "pinyin": "é", "category": "LETTER", "difficulty": "1", "audio_hint_key": "hint_e" },
    { "id": 6, "cell_pattern": "1-2-4", "letter": "f", "pinyin": "fó", "category": "LETTER", "difficulty": "2", "audio_hint_key": "hint_f" },
    { "id": 7, "cell_pattern": "1-2-4-5", "letter": "g", "pinyin": "gē", "category": "LETTER", "difficulty": "2", "audio_hint_key": "hint_g" },
    { "id": 8, "cell_pattern": "1-2-5", "letter": "h", "pinyin": "hē", "category": "LETTER", "difficulty": "2", "audio_hint_key": "hint_h" },
    { "id": 9, "cell_pattern": "2-4", "letter": "i", "pinyin": "yī", "category": "LETTER", "difficulty": "2", "audio_hint_key": "hint_i" },
    { "id": 10, "cell_pattern": "2-4-5", "letter": "j", "pinyin": "jī", "category": "LETTER", "difficulty": "2", "audio_hint_key": "hint_j" },
    { "id": 11, "cell_pattern": "1-3", "letter": "k", "pinyin": "kē", "category": "LETTER", "difficulty": "3", "audio_hint_key": "hint_k" },
    { "id": 12, "cell_pattern": "1-2-3", "letter": "l", "pinyin": "le", "category": "LETTER", "difficulty": "3", "audio_hint_key": "hint_l" }
  ],
  "lesson": [
    {
      "id": 1,
      "title": "基础字母 a-e",
      "symbol_ids": [1, 2, 3, 4, 5],
      "stage": "入门",
      "estimated_minutes": 10,
      "unlock_rule": "默认解锁"
    },
    {
      "id": 2,
      "title": "基础字母 f-j",
      "symbol_ids": [6, 7, 8, 9, 10],
      "stage": "进阶",
      "estimated_minutes": 15,
      "unlock_rule": "完成入门课程"
    },
    {
      "id": 3,
      "title": "基础字母 k-l",
      "symbol_ids": [11, 12],
      "stage": "巩固",
      "estimated_minutes": 8,
      "unlock_rule": "完成进阶课程"
    }
  ],
  "practiceSession": [
    {
      "id": 1,
      "lesson_id": 1,
      "mode": "TEXT_TO_CELL",
      "started_at": "2026-09-20T09:00:00Z",
      "finished_at": "2026-09-20T09:10:00Z",
      "score": 50,
      "mistake_count": 1
    },
    {
      "id": 2,
      "lesson_id": 1,
      "mode": "TEXT_TO_CELL",
      "started_at": "2026-09-21T09:00:00Z",
      "finished_at": "2026-09-21T09:08:00Z",
      "score": 100,
      "mistake_count": 0
    },
    {
      "id": 3,
      "lesson_id": 2,
      "mode": "TEXT_TO_CELL",
      "started_at": "2026-09-22T09:00:00Z",
      "finished_at": "2026-09-22T09:12:00Z",
      "score": 75,
      "mistake_count": 1
    }
  ],
  "answerRecord": [
    {
      "id": 1,
      "session_id": 1,
      "symbol_id": 1,
      "user_answer": "1",
      "correct": true,
      "latency_ms": 3200,
      "mistake_reason": "NONE"
    },
    {
      "id": 2,
      "session_id": 1,
      "symbol_id": 2,
      "user_answer": "1|1-3",
      "correct": false,
      "latency_ms": 9600,
      "mistake_reason": "MIXED_DOTS"
    },
    {
      "id": 3,
      "session_id": 2,
      "symbol_id": 5,
      "user_answer": "1-2-5|1-5",
      "correct": true,
      "latency_ms": 7400,
      "mistake_reason": "NONE"
    }
  ]
} as const;
