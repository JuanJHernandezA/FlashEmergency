import type { IEmergencyContact, IHistoryEntry } from '../types';
import type { IPhotoReport } from '../types/photoReport';
import type { IConversation } from '../types/conversation';

const DB_NAME = 'safeaid-db';
const DB_VERSION = 3;

const STORES = {
  CONTACTS: 'contacts',
  HISTORY: 'history',
  REPORTS: 'reports',
  CONVERSATIONS: 'conversations',
} as const;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.CONTACTS)) {
        db.createObjectStore(STORES.CONTACTS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        const historyStore = db.createObjectStore(STORES.HISTORY, { keyPath: 'id' });
        historyStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.REPORTS)) {
        const reportsStore = db.createObjectStore(STORES.REPORTS, { keyPath: 'id' });
        reportsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) {
        const convStore = db.createObjectStore(STORES.CONVERSATIONS, { keyPath: 'id' });
        convStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function performTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const request = operation(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      tx.oncomplete = () => db.close();
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

function getAll<T>(storeName: string): Promise<T[]> {
  return performTransaction(storeName, 'readonly', (store) => store.getAll());
}

function getById<T>(storeName: string, id: string): Promise<T | undefined> {
  return performTransaction(storeName, 'readonly', (store) => store.get(id));
}

function put<T>(storeName: string, item: T): Promise<IDBValidKey> {
  return performTransaction(storeName, 'readwrite', (store) => store.put(item));
}

function remove(storeName: string, id: string): Promise<undefined> {
  return performTransaction(storeName, 'readwrite', (store) => store.delete(id));
}

function clear(storeName: string): Promise<undefined> {
  return performTransaction(storeName, 'readwrite', (store) => store.clear());
}

// Contacts
export async function getAllContacts(): Promise<IEmergencyContact[]> {
  return getAll<IEmergencyContact>(STORES.CONTACTS);
}

export async function saveContact(contact: IEmergencyContact): Promise<void> {
  await put(STORES.CONTACTS, contact);
}

export async function deleteContact(id: string): Promise<void> {
  await remove(STORES.CONTACTS, id);
}

// History
export async function getAllHistory(): Promise<IHistoryEntry[]> {
  const entries = await getAll<IHistoryEntry>(STORES.HISTORY);
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function saveHistoryEntry(entry: IHistoryEntry): Promise<void> {
  await put(STORES.HISTORY, entry);
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  await remove(STORES.HISTORY, id);
}

export async function clearHistory(): Promise<void> {
  await clear(STORES.HISTORY);
}

// Reports
export async function getAllReports(): Promise<IPhotoReport[]> {
  const entries = await getAll<IPhotoReport>(STORES.REPORTS);
  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function saveReport(report: IPhotoReport): Promise<void> {
  await put(STORES.REPORTS, report);
}

export async function deleteReport(id: string): Promise<void> {
  await remove(STORES.REPORTS, id);
}

// Conversations
export async function getAllConversations(): Promise<IConversation[]> {
  const entries = await getAll<IConversation>(STORES.CONVERSATIONS);
  return entries.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getConversation(id: string): Promise<IConversation | undefined> {
  return getById<IConversation>(STORES.CONVERSATIONS, id);
}

export async function saveConversation(conversation: IConversation): Promise<void> {
  await put(STORES.CONVERSATIONS, conversation);
}

export async function deleteConversation(id: string): Promise<void> {
  await remove(STORES.CONVERSATIONS, id);
}

export async function clearConversations(): Promise<void> {
  await clear(STORES.CONVERSATIONS);
}
