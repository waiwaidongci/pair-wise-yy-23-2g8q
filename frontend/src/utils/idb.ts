/** 极简 IndexedDB 封装：只有提交过的记录才会写入这里，统计只读这里。 */

const DB_NAME = "braille-trainer";
const DB_VERSION = 1;

export const IDB_STORES = {
  answerRecord: "answerRecord",
  practiceSession: "practiceSession"
} as const;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of Object.values(IDB_STORES)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: "id" });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx<T>(storeName: string, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const request = run(db.transaction(storeName, mode).objectStore(storeName));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
  );
}

export function idbPut<T extends { id: number }>(storeName: string, value: T): Promise<IDBValidKey> {
  return tx(storeName, "readwrite", (store) => store.put(value));
}

export function idbGetAll<T>(storeName: string): Promise<T[]> {
  return tx(storeName, "readonly", (store) => store.getAll() as IDBRequest<T[]>);
}

/** 取当前最大 id，新记录 id = max + 1，保证单调递增。 */
export async function idbNextId(storeName: string, seedIds: number[] = []): Promise<number> {
  const rows = await idbGetAll<{ id: number }>(storeName);
  const max = Math.max(0, ...seedIds, ...rows.map((row) => row.id));
  return max + 1;
}
