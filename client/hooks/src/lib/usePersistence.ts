import { useEffect, useState } from "react";
import { Database } from "@workout-tracker/utils";

/**
 * Opens the IndexedDB workout database once on mount.
 * Returns `null` until the database has finished initializing.
 *
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export function usePersistence(): Database | null {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    let cancelled = false;
    const database = new Database();
    database.init().then(() => {
      if (!cancelled) {
        setDb(database);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return db;
}
