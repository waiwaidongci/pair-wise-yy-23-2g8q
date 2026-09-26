import { dbGetAll, dbNextId, dbPut, STORES } from "../db/indexeddb";
import { createDefaultPracticeSession } from "../constructors/PracticeSessionConstructor";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { PracticeSession } from "../types/PracticeSession";

/** 记录保存层：练习会话离开时落到 IndexedDB */
export async function listPracticeSession(): Promise<PracticeSession[]> {
  const rows = await dbGetAll<PracticeSession>(STORES.practiceSession);
  return rows.sort((a, b) => b.id - a.id);
}

export async function savePracticeSession(payload: PracticeSession): Promise<PracticeSession> {
  const session = createDefaultPracticeSession({
    ...payload,
    id: payload.id > 0 ? payload.id : await dbNextId(STORES.practiceSession)
  });
  await dbPut(STORES.practiceSession, session);
  console.info(LOG_TEMPLATES.PracticeSession[0], session);
  return session;
}
