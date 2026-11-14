import type { Exercise, LogEntry, Workout } from "@workout-tracker/types";
/**
 * @deprecated IndexedDB persistence is being replaced. Do not use in new code.
 */
export declare class Database {
    private db;
    init(): Promise<void>;
    private get database();
    getAllWorkouts(): Promise<(Workout & {
        persistenceKey: string;
    })[]>;
    getAllLogs(): Promise<(LogEntry & {
        persistenceKey: number;
    })[]>;
    getWorkout(id: string): Promise<Workout | undefined>;
    getLogEntry(key: number): Promise<LogEntry | undefined>;
    private runInWorkouts;
    private runInLogs;
    saveLogEntry(logEntry: Workout): Promise<void>;
    eraseLogEntry(key: number): Promise<void>;
    saveWorkout(workout: Workout): Promise<void>;
    eraseWorkout(id: string): Promise<void>;
    getLastLogEntry(workoutId: string): Promise<LogEntry | undefined>;
    private loadNewWorkout;
    private loadWorkoutFromLogs;
    saveWorkoutTemplate(id: string, exercises: Exercise[]): Promise<void>;
    loadWorkoutLogById(id: string | number, createNew?: boolean, fromLogs?: boolean): Promise<Workout>;
}
