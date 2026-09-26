import { mockData } from "../mocks/seedData";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { idbGetAll, idbNextId, idbPut, IDB_STORES } from "../utils/idb";
import type { PracticeSession } from "../types/PracticeSession";

export async function listFinishedPracticeSessions(): Promise<PracticeSession[]> {
  const persisted = await idbGetAll<PracticeSession>(IDB_STORES.practiceSession);
  return [...(mockData.practiceSession as unknown as PracticeSession[]), ...persisted];
}

export async function savePracticeSession(payload: Omit<PracticeSession, "id">): Promise<PracticeSession> {
  const id = await idbNextId(IDB_STORES.practiceSession, mockData.practiceSession.map((row) => row.id));
  const session: PracticeSession = { ...payload, id };
  await idbPut(IDB_STORES.practiceSession, session);
  console.info(LOG_TEMPLATES.PracticeSession[0], session);
  return session;
}

export async function updatePracticeSession(session: PracticeSession): Promise<PracticeSession> {
  await idbPut(IDB_STORES.practiceSession, session);
  console.info(LOG_TEMPLATES.PracticeSession[1], session);
  return session;
}
