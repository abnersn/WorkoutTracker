// Adds a `typecheck` target to every project: `tsc --noEmit` on each of its
// tsconfig files. Rspack (SWC) and Jest (Babel) strip types without checking
// them, so without this target nothing type-checks the client code.
//
// Solution-style tsconfigs (the ones with "references") hold no files of their
// own and are skipped; the configs they reference are checked directly.
const { readdirSync, readFileSync } = require("node:fs");
const { dirname, join } = require("node:path");

const TSCONFIG = /^tsconfig(\..+)?\.json$/;

exports.createNodes = [
  "**/project.json",
  (projectFiles, _options, { workspaceRoot }) =>
    projectFiles.flatMap((projectFile) => {
      const root = dirname(projectFile);
      const configs = readdirSync(join(workspaceRoot, root))
        .filter((name) => TSCONFIG.test(name))
        .filter(
          (name) =>
            !readFileSync(join(workspaceRoot, root, name), "utf8").includes(
              '"references"',
            ),
        )
        .sort();
      if (configs.length === 0) {
        return [];
      }
      const typecheck = {
        command: configs.map((c) => `tsc -p ${c} --noEmit`).join(" && "),
        options: { cwd: root },
        cache: true,
        inputs: [
          "default",
          "^default",
          { externalDependencies: ["typescript"] },
        ],
        outputs: [],
      };
      return [
        [projectFile, { projects: { [root]: { targets: { typecheck } } } }],
      ];
    }),
];
