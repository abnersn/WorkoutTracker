/**
 * Motion tokens live in theme.css. The Web Animations API cannot take `var()` in
 * its options, so components resolve them here from the document root.
 */
export declare const cssToken: (name: string) => string;
/** A duration or delay token ("180ms") as milliseconds; 0 if it is not defined. */
export declare function msToken(name: string): number;
/** An easing token, falling back to plain "ease-out" if it is not defined. */
export declare function easingToken(name: string): string;
export declare function prefersReducedMotion(): boolean;
