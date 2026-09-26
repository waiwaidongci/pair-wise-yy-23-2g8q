import { create } from "zustand";
import { listAnswerRecord, saveAnswerRecord } from "../api/AnswerRecord";
import type { AnswerRecord } from "../types/AnswerRecord";

type State = {
  rows: AnswerRecord[];
  loading: boolean;
  load: () => Promise<void>;
  /** 记录保存层入口：调用 API 落库并把已提交记录放进 store */
  addRecord: (payload: AnswerRecord) => Promise<AnswerRecord>;
};

export const useAnswerRecordStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listAnswerRecord(), loading: false });
  },
  async addRecord(payload) {
    const saved = await saveAnswerRecord(payload);
    set((state) => ({ rows: [saved, ...state.rows] }));
    return saved;
  }
}));
