import type { CodegenConfig } from "@graphql-codegen/cli";

// Paths are relative to the workspace root, where codegen runs.
const config: CodegenConfig = {
  schema: "server/apps/gateway/src/schema.gql",
  documents: ["client/*/*/src/**/*.{ts,tsx}", "!client/libs/api/src/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    "client/libs/api/src/gql/": {
      preset: "client",
      presetConfig: { fragmentMasking: false },
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        // DateTime arrives as an ISO string; the hooks turn it into a Date.
        scalars: { DateTime: "string" },
        // String unions, so they line up with the domain enums in
        // @workout-tracker/types without a runtime mapping table.
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
