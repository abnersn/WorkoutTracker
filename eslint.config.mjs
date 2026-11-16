import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist", "**/out-tsc", "**/@mf-types", "**/storybook-static"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [
            "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$",
            // Shared module-federation deps, imported by each app's rspack config.
            "^.*/module-federation\\.shared\\.mjs$",
          ],
          // A project without tags matches none of these, so it can't import
          // anything: every project must carry a scope and a type.
          depConstraints: [
            // client/ and server/ never import each other.
            {
              sourceTag: "scope:client",
              onlyDependOnLibsWithTags: ["scope:client"],
            },
            {
              sourceTag: "scope:server",
              onlyDependOnLibsWithTags: ["scope:server"],
            },
            // Apps are never imported: the shell loads remotes through Module
            // Federation, and the servers talk over gRPC.
            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: ["type:lib"],
            },
            {
              sourceTag: "type:lib",
              onlyDependOnLibsWithTags: ["type:lib"],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    // Override or add rules here
    rules: {
      // A leading underscore marks a binding as intentionally unused,
      // e.g. dropping a key with `const { key: _key, ...rest } = obj`.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // Require explicit return types on functions and methods.
    files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
    },
  },
  {
    // Always use braces around if/else/for/while/do bodies.
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    rules: {
      curly: ["error", "all"],
    },
  },
  {
    // Storybook's main.ts config typing needs `any` in a few places.
    files: ["**/.storybook/main.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // Named exports only: default exports are forbidden across the repo.
    // Tool config files (ESLint, Jest, rspack), nx-generated App modules and Storybook stories require a default export and are exempt.
    files: [
      "**/*.ts",
      "**/*.tsx",
      "**/*.cts",
      "**/*.mts",
      "**/*.js",
      "**/*.jsx",
      "**/*.cjs",
      "**/*.mjs",
    ],
    ignores: [
      "**/eslint.config.mjs",
      "**/jest.config.ts",
      "**/rspack.config.ts",
      "**/codegen.ts",
      // Module-federation app modules: consumers load these via lazy(), which needs a default export.
      "client/*/src/App.tsx",
      "**/jest.config.cts",
      // Storybook's CSF format requires a default export (the meta object).
      "**/*.stories.ts",
      "**/*.stories.tsx",
      "**/.storybook/main.ts",
      "**/.storybook/preview.ts",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message:
            "Default exports are not allowed. Use a named export instead.",
        },
        {
          selector: 'ExportSpecifier[exported.name="default"]',
          message:
            "Default exports are not allowed. Use a named export instead.",
        },
      ],
    },
  },
];
