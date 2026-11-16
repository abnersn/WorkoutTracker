// jest-environment-jsdom does not expose Node's global structuredClone.
// v8 serialization gives the same deep-copy semantics for the plain data the reducer clones.
const v8 = require("node:v8");

if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (value) => v8.deserialize(v8.serialize(value));
}
