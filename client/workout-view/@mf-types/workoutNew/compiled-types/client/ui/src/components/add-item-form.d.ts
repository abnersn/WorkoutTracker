export interface AddItemFormProps {
    /** Button text, e.g. "Add workout". Also names the field's action. */
    label: string;
    placeholder: string;
    onSubmit: (value: string) => void;
    className?: string;
}
/** One name field and one button; clears itself after a submit. */
export declare function AddItemForm({ label, placeholder, onSubmit, className, }: AddItemFormProps): import("react").JSX.Element;
