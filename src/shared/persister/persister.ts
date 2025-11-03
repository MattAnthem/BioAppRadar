import { get, set, del } from 'idb-keyval'
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

export function createIDBPersister(idbKey: IDBValidKey = 'reactQuery'): Persister{
    return {
        persistClient: async (client: PersistedClient) => {
            try {
                await set(idbKey, client);
              } catch (err) {
                console.error("Error persisting client:", err);
              }
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbKey);
        },
        removeClient: async () => {
            try {
                await del(idbKey);
              } catch (err) {
                console.error("Error removing persisted client:", err);
              }
        }
    }
}