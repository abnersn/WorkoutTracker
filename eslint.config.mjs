import nx from "@nx/eslint-plugin";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist", "**/out-tsc"],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
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
    rules: {},
  },
  {
    // Named exports only: default exports are forbidden across the repo.
    // Tool config files (ESLint, Jest) and Storybook stories require a default export and are exempt.
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
