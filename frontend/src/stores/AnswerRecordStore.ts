import { create } from "zustand";
import { listSubmittedAnswerRecords, saveAnswerRecord } from "../api/answerRecordDb";
import type { AnswerRecord } from "../types/AnswerRecord";

type State = {
  rows: AnswerRecord[];
  loading: boolean;
  load: () => Promise<void>;
  save: (payload: Omit<AnswerRecord, "id">) => Promise<AnswerRecord>;
};

export const useAnswerRecordStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listSubmittedAnswerRecords(), loading: false });
  },
  async save(payload) {
    const record = await saveAnswerRecord(payload);
    set((state) => ({ rows: [...state.rows, record] }));
    return record;
  }
}));
