export interface HistoryEntry {
    /** Key of the log in the database. */
    key: number;
    name: string;
    date: Date;
}
export interface HistoryListProps {
    entries: HistoryEntry[];
    onRemove?: (key: number) => void;
    navigate?: (to: string) => void;
}
/** Finished workouts, newest first. Renders nothing when there are none. */
export declare function HistoryList({ entries, onRemove, navigate }: HistoryListProps): import("react").JSX.Element | null;
