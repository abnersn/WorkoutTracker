import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  // Output of `nx codegen proto` (buf generate); edits there are overwritten.
  { ignores: ["src/generated/**"] },
];
