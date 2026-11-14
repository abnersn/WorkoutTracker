import { type ReactNode } from "react";
export interface ExerciseCardProps {
    name: string;
    type?: "weight" | "cardio";
    isActive?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    /** Hides every editing control: finished workouts and history. */
    readOnly?: boolean;
    /** Show "Remove set" next to "Add set", for when a set is selected. */
    canRemoveSet?: boolean;
    onToggleType?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    onAddSet?: () => void;
    onRemoveSet?: () => void;
    onRemoveExercise?: () => void;
    /** SetRows, then the RpeScale once the exercise is complete. */
    children?: ReactNode;
}
/** An exercise: its name, its sets, and the controls to reorder, add and remove. */
export declare function ExerciseCard({ name, type, isActive, isFirst, isLast, readOnly, canRemoveSet, onToggleType, onMoveUp, onMoveDown, onAddSet, onRemoveSet, onRemoveExercise, children, }: ExerciseCardProps): import("react").JSX.Element;
