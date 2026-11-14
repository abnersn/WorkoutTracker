import { Database } from "@workout-tracker/utils";
/**
 * Opens the IndexedDB workout database once on mount.
 * Returns `null` until the database has finished initializing.
 *
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export declare function usePersistence(): Database | null;
