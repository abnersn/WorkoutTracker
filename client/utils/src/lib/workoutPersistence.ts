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

    this.db = await openDB<WorkoutTrackerDB>("workoutTracker", 1, {
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
  async saveLogEntry(logEntry: Workout): Promise<number> {
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
      .filter((entry) => entry.id === workoutId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return lastLogEntry[0];
  }

  private async loadNewWorkout(
    id: string | number,
    fromLogs: boolean,
  ): Promise<Workout> {
    const workout = fromLogs
      ? await this.getLogEntry(Number(id))
      : await this.getWorkout(String(id));
    if (!workout) {
      throw new Error(`Workout not found: ${id}`);
    }

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

  /**
   * Rewrites every stored weight by `factor` (kg↔lb), rounded to 0.1, so a unit
   * switch converts 80 kg to 176.4 lb instead of relabelling it "80 lb".
   */
  async convertWeights(factor: number): Promise<void> {
    const convert = (workout: Workout): Workout => ({
      ...workout,
      exercises: workout.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set) =>
          set.defaultWeight === undefined
            ? set
            : {
                ...set,
                defaultWeight: Math.round(set.defaultWeight * factor * 10) / 10,
              },
        ),
      })),
    });
    const tx = this.database.transaction(["workouts", "logs"], "readwrite");
    let workouts = await tx.objectStore("workouts").openCursor();
    while (workouts) {
      await workouts.update(convert(workouts.value));
      workouts = await workouts.continue();
    }
    let logs = await tx.objectStore("logs").openCursor();
    while (logs) {
      await logs.update(convert(logs.value));
      logs = await logs.continue();
    }
    await tx.done;
  }

  /** Replaces a history entry, e.g. to add an effort rating after finishing. */
  async updateLogEntry(key: number, log: Workout): Promise<void> {
    await this.runInLogs((store) => store.put(log, key));
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
