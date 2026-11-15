import type { CodegenConfig } from "@graphql-codegen/cli";

// Paths are relative to the workspace root, where codegen runs.
const config: CodegenConfig = {
  schema: "server/gateway/src/schema.gql",
  documents: ["client/*/src/**/*.{ts,tsx}", "!client/api/src/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    "client/api/src/gql/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: { nonOptionalTypename: true, skipTypeNameForRoot: true },
    },
  },
};

export default config;
