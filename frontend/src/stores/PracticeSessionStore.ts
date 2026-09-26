import { create } from "zustand";
import { listFinishedPracticeSessions, savePracticeSession, updatePracticeSession } from "../api/practiceSessionDb";
import type { PracticeSession } from "../types/PracticeSession";

type State = {
  rows: PracticeSession[];
  loading: boolean;
  load: () => Promise<void>;
  save: (payload: Omit<PracticeSession, "id">) => Promise<PracticeSession>;
  update: (session: PracticeSession) => Promise<PracticeSession>;
};

export const usePracticeSessionStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listFinishedPracticeSessions(), loading: false });
  },
  async save(payload) {
    const session = await savePracticeSession(payload);
    set((state) => ({ rows: [...state.rows, session] }));
    return session;
  },
  async update(session) {
    const saved = await updatePracticeSession(session);
    set((state) => ({ rows: state.rows.map((row) => (row.id === saved.id ? saved : row)) }));
    return saved;
  }
}));
