export declare const RPE_LEVELS: readonly {
    title: string;
    description: string;
}[];
export interface RpeScaleProps {
    /** 1 to 10. */
    value: number;
    onChange?: (value: number) => void;
    /** Shows the saved rating without letting it change. */
    readOnly?: boolean;
    /** Start with the level explanation open. */
    defaultExpanded?: boolean;
}
/** Rate of perceived exertion, asked once an exercise is done. */
export declare function RpeScale({ value, onChange, readOnly, defaultExpanded, }: RpeScaleProps): import("react").JSX.Element;
