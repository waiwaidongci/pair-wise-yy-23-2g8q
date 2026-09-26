/**
 * IndexedDB 底层封装：练习产生的答题记录与会话记录持久化在这里。
 * 业务 API（api/AnswerRecord、api/PracticeSession）负责表级读写，本文件只管数据库与事务。
 */
const DB_NAME = "braille-trainer";
const DB_VERSION = 1;

export const STORES = {
  answerRecord: "answerRecord",
  practiceSession: "practiceSession"
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.answerRecord)) {
        db.createObjectStore(STORES.answerRecord, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.practiceSession)) {
        db.createObjectStore(STORES.practiceSession, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

function runTransaction<T>(storeName: string, mode: IDBTransactionMode, handle: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDatabase().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const request = handle(transaction.objectStore(storeName));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      })
  );
}

export async function dbGetAll<T>(storeName: string): Promise<T[]> {
  return runTransaction<T[]>(storeName, "readonly", (store) => store.getAll() as IDBRequest<T[]>);
}

export async function dbPut<T>(storeName: string, value: T): Promise<T> {
  return runTransaction<T>(storeName, "readwrite", (store) => store.put(value) as unknown as IDBRequest<T>).then(() => value);
}

export async function dbNextId(storeName: string): Promise<number> {
  const rows = await runTransaction<{ id: number }[]>(storeName, "readonly", (store) => store.getAll() as IDBRequest<{ id: number }[]>);
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}
