import nx from "@nx/eslint-plugin";
import baseConfig from "../../../eslint.config.mjs";

export default [
  ...nx.configs["flat/react"],
  ...baseConfig,
  // Written by `nx run api:codegen`; checked for drift in CI, not linted.
  { ignores: ["src/gql/**"] },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    // Override or add rules here
    rules: {},
  },
];
