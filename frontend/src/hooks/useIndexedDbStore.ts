import { useEffect, useState } from "react";
import { idbGetAll } from "../utils/idb";

/**
 * 通用 IndexedDB 读取 hook：返回已持久化的记录（加上 mock 种子）。
 * 只有“提交成立”的数据才会被写入，所以这里读到的天然只含已提交记录。
 */
export function useIndexedDbStore<T extends { id: number }>(
  storeName: string,
  seed: T[] = []
): { rows: T[]; loading: boolean; reload: () => Promise<void> } {
  const [rows, setRows] = useState<T[]>(seed);
  const [loading, setLoading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const persisted = await idbGetAll<T>(storeName);
      setRows([...seed, ...persisted]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeName]);

  return { rows, loading, reload };
}
