import { type ComponentPropsWithoutRef, type ElementType } from "react";

/**
 * Helper type to make components that have an "as" prop typesafe
 */
export type PolymorphicProps<T extends ElementType, Own> = Own & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Own | "as">;
