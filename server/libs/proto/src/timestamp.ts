import type { Timestamp } from "./generated/google/protobuf/timestamp";

export function fromDate(date: Date): Timestamp {
  const ms = date.getTime();
  const seconds = Math.floor(ms / 1_000);
  return { seconds, nanos: (ms - seconds * 1_000) * 1_000_000 };
}

// With defaults: true, a missing Timestamp arrives as null.
export function toDate(ts: Timestamp | null | undefined): Date {
  if (ts == null) {
    throw new TypeError("Expected a Timestamp");
  }
  return new Date(ts.seconds * 1_000 + Math.floor(ts.nanos / 1_000_000));
}
