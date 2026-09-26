import { mockData } from "../mocks/seedData";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { idbGetAll, idbNextId, idbPut, IDB_STORES } from "../utils/idb";
import type { AnswerRecord } from "../types/AnswerRecord";

/**
 * 答题记录持久化：只在“提交成立”时被调用。
 * 读取 = IndexedDB 已提交记录 + 本地 mock 种子。
 */
export async function listSubmittedAnswerRecords(): Promise<AnswerRecord[]> {
  const persisted = await idbGetAll<AnswerRecord>(IDB_STORES.answerRecord);
  return [...(mockData.answerRecord as unknown as AnswerRecord[]), ...persisted];
}

export async function saveAnswerRecord(payload: Omit<AnswerRecord, "id">): Promise<AnswerRecord> {
  const id = await idbNextId(IDB_STORES.answerRecord, mockData.answerRecord.map((row) => row.id));
  const record: AnswerRecord = { ...payload, id };
  await idbPut(IDB_STORES.answerRecord, record);
  console.info(LOG_TEMPLATES.AnswerRecord[0], record);
  return record;
}
