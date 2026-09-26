import { useEffect, useState } from "react";
import { listAnswerRecord } from "../api/AnswerRecord";

/**
 * 记录层 hook：读取 IndexedDB 中已提交的答题记录（错题本/统计共用）。
 * 未提交点阵不会进入 IndexedDB，因此这里天然只含已提交记录。
 */
export function useIndexedDbStore() {
  const [records, setRecords] = useState<Awaited<ReturnType<typeof listAnswerRecord>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void listAnswerRecord().then((rows) => {
      if (!cancelled) {
        setRecords(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { records, loading };
}
