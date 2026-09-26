import { dbGetAll, dbNextId, dbPut, STORES } from "../db/indexeddb";
import { createDefaultAnswerRecord } from "../constructors/AnswerRecordConstructor";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { AnswerRecord } from "../types/AnswerRecord";

/** 记录保存层：答题记录统一从 IndexedDB 读取，未提交的草稿不会到达这里 */
export async function listAnswerRecord(): Promise<AnswerRecord[]> {
  const rows = await dbGetAll<AnswerRecord>(STORES.answerRecord);
  return rows.sort((a, b) => b.id - a.id);
}

/** 保存一条最终提交记录，返回带 id 的记录 */
export async function saveAnswerRecord(payload: AnswerRecord): Promise<AnswerRecord> {
  const record = createDefaultAnswerRecord({
    ...payload,
    id: payload.id > 0 ? payload.id : await dbNextId(STORES.answerRecord)
  });
  await dbPut(STORES.answerRecord, record);
  console.info(LOG_TEMPLATES.AnswerRecord[0], record);
  return record;
}

/** 离开页面时按会话汇总已提交记录（统计只认已提交记录） */
export async function listAnswerRecordBySession(sessionId: number): Promise<AnswerRecord[]> {
  const rows = await listAnswerRecord();
  return rows.filter((row) => row.session_id === sessionId);
}
