import {
  openDB,
  type DBSchema,
  type IDBPDatabase,
  type IDBPObjectStore,
} from "idb";
import type { Exercise, LogEntry, Workout } from "@workout-tracker/types";
import { SetStage } from "@workout-tracker/types";

/** @deprecated IndexedDB schema; being replaced. Do not use in new code. */
interface WorkoutTrackerDB extends DBSchema {
  workouts: { key: string; value: Workout };
  logs: { key: number; value: LogEntry };
}

/**
 * Bump when the stored shape changes. There are no migrations yet: while the app
 * is in development, clear site data after a bump.
 */
const SCHEMA_VERSION = 3;

/** @deprecated IndexedDB store type; being replaced. */
type WorkoutsStore = IDBPObjectStore<
  WorkoutTrackerDB,
  ["workouts"],
  "workouts",
  "readwrite"
>;
/** @deprecated IndexedDB store type; being replaced. */
type LogsStore = IDBPObjectStore<
  WorkoutTrackerDB,
  ["logs"],
  "logs",
  "readwrite"
>;

/**
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export class Database {
  private db: IDBPDatabase<WorkoutTrackerDB> | null = null;

  async init(): Promise<void> {
    if (!("indexedDB" in window)) {
      throw new Error(
        "This browser can't store workouts. Turn off private browsing, or try another browser.",
      );
    }

    this.db = await openDB<WorkoutTrackerDB>("workoutTracker", SCHEMA_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("workouts")) {
          db.createObjectStore("workouts", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("logs")) {
          db.createObjectStore("logs", { autoIncrement: true });
        }
      },
    });
  }

  private get database(): IDBPDatabase<WorkoutTrackerDB> {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return this.db;
  }

  async getAllWorkouts(): Promise<(Workout & { persistenceKey: string })[]> {
    const store = this.database
      .transaction("workouts", "readonly")
      .objectStore("workouts");
    const data: (Workout & { persistenceKey: string })[] = [];

    let cursor = await store.openCursor();
    while (cursor) {
      data.push({ ...cursor.value, persistenceKey: cursor.key });
      cursor = await cursor.continue();
    }

    return data;
  }

  async getAllLogs(): Promise<(LogEntry & { persistenceKey: number })[]> {
    const store = this.database
      .transaction("logs", "readonly")
      .objectStore("logs");
    const data: (LogEntry & { persistenceKey: number })[] = [];

    let cursor = await store.openCursor();
    while (cursor) {
      data.push({ ...cursor.value, persistenceKey: cursor.key });
      cursor = await cursor.continue();
    }

    return data;
  }

  getWorkout(id: string): Promise<Workout | undefined> {
    return this.database
      .transaction("workouts", "readonly")
      .objectStore("workouts")
      .get(id);
  }

  getLogEntry(key: number): Promise<LogEntry | undefined> {
    return this.database
      .transaction("logs", "readonly")
      .objectStore("logs")
      .get(key);
  }

  private async runInWorkouts(
    operation: (store: WorkoutsStore) => unknown,
  ): Promise<void> {
    const tx = this.database.transaction("workouts", "readwrite");
    operation(tx.objectStore("workouts"));
    await tx.done;
  }

  private async runInLogs(
    operation: (store: LogsStore) => unknown,
  ): Promise<void> {
    const tx = this.database.transaction("logs", "readwrite");
    operation(tx.objectStore("logs"));
    await tx.done;
  }

  /** Adds a finished workout to the history and returns its key. */
  async saveLogEntry(logEntry: LogEntry): Promise<number> {
    const tx = this.database.transaction("logs", "readwrite");
    const key = await tx.objectStore("logs").add(logEntry);
    await tx.done;
    return key;
  }

  eraseLogEntry(key: number): Promise<void> {
    return this.runInLogs((store) => store.delete(key));
  }

  saveWorkout(workout: Workout): Promise<void> {
    return this.runInWorkouts((store) => store.add(workout));
  }

  eraseWorkout(id: string): Promise<void> {
    return this.runInWorkouts((store) => store.delete(id));
  }

  async getLastLogEntry(workoutId: string): Promise<LogEntry | undefined> {
    const data = await this.getAllLogs();

    const lastLogEntry = data
      .filter((entry) => entry.workoutId === workoutId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return lastLogEntry[0];
  }

  private async loadNewWorkout(
    id: string | number,
    fromLogs: boolean,
  ): Promise<Workout> {
    const source = fromLogs
      ? await this.getLogEntry(Number(id))
      : await this.getWorkout(String(id));
    if (!source) {
      throw new Error(`Workout not found: ${id}`);
    }
    // A repeated log is a new run of its workout, not of the log itself.
    const workout: Workout = fromLogs
      ? withoutLogFields(source as LogEntry)
      : source;

    workout.date = new Date();
    workout.isComplete = false;
    workout.duration = 0;

    for (const exercise of workout.exercises) {
      // Effort belongs to a session: a repeated run starts unrated.
      delete exercise.rpe;
      for (const set of exercise.sets) {
        set.stage = SetStage.Idle;
        delete set.restStartedAt;
      }
    }

    return workout;
  }

  private async loadWorkoutFromLogs(id: string | number): Promise<Workout> {
    const workout = await this.getLogEntry(Number(id));
    if (!workout) {
      throw new Error(`Log entry not found: ${id}`);
    }

    workout.date = new Date(workout.date);

    for (const exercise of workout.exercises as Exercise[]) {
      for (const set of exercise.sets) {
        set.stage = SetStage.Complete;
      }
    }

    return workout;
  }

  async saveWorkoutTemplate(id: string, exercises: Exercise[]): Promise<void> {
    const workout = await this.getWorkout(id);
    if (!workout) {
      throw new Error(`Workout not found: ${id}`);
    }
    workout.exercises = exercises;
    await this.runInWorkouts((store) => store.put(workout));
  }

  /** Replaces a history entry, e.g. to add an effort rating after finishing. */
  async updateLogEntry(key: number, log: Workout): Promise<void> {
    const tx = this.database.transaction("logs", "readwrite");
    const store = tx.objectStore("logs");
    const existing = await store.get(key);
    if (!existing) {
      throw new Error(`Log entry not found: ${key}`);
    }
    // The log keeps its own id and the link to its workout.
    await store.put(
      { ...log, id: existing.id, workoutId: existing.workoutId },
      key,
    );
    await tx.done;
  }

  loadWorkoutLogById(
    id: string | number,
    createNew = true,
    fromLogs = false,
  ): Promise<Workout> {
    if (createNew) {
      return this.loadNewWorkout(id, fromLogs);
    }
    return this.loadWorkoutFromLogs(id);
  }
}

/** The workout a log was run from, without the fields only logs carry. */
function withoutLogFields(log: LogEntry): Workout {
  const { workoutId, persistenceKey: _key, ...workout } = log;
  return { ...workout, id: workoutId };
}
