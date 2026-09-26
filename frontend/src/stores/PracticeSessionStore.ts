import { create } from "zustand";
import { listPracticeSession, savePracticeSession } from "../api/PracticeSession";
import type { PracticeSession } from "../types/PracticeSession";

type State = {
  rows: PracticeSession[];
  loading: boolean;
  load: () => Promise<void>;
  /** 离开练习页时保存会话汇总 */
  saveSession: (payload: PracticeSession) => Promise<PracticeSession>;
};

export const usePracticeSessionStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listPracticeSession(), loading: false });
  },
  async saveSession(payload) {
    const saved = await savePracticeSession(payload);
    set((state) => ({ rows: [saved, ...state.rows] }));
    return saved;
  }
}));
