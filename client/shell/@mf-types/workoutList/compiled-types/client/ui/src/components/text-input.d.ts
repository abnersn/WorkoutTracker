import { type InputHTMLAttributes } from "react";
export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Visible label. Omit it only when `aria-label` names the field. */
    label?: string;
    /** Names the problem and the way out. */
    error?: string;
}
export declare function TextInput({ label, error, id, className, ...props }: TextInputProps): import("react").JSX.Element;
