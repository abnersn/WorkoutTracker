import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { NxReadySignalPlugin } from "@nx/rspack/ready-signal";
import { withZephyr } from "zephyr-rspack-plugin";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import { sharedDependencies } from "../../../module-federation.shared.mjs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

// __dirname is undefined when @rspack/cli loads this config as ESM (it
// does, because the file uses `import` statements). Derive it from the
// module URL so the config works regardless of how the loader interprets it.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = 8100;
const NAME = "shell";

// Read mode from the rspack CLI arg (`--mode=development|production`) so the
// config works the same on Windows + POSIX without depending on a shell
// `NODE_ENV=...` prefix.
export default defineConfig((_env, argv) => {
  const isDev = argv.mode !== "production";
  // The `deploy` target is the only one that enables Zephyr. A deployed shell
  // that quietly called http://localhost:3000 would fail for every visitor.
  const deploying = process.env.ZE_DISABLED === "false";
  if (deploying && !process.env.GATEWAY_URL) {
    throw new Error("GATEWAY_URL must be set to deploy the shell");
  }
  return withZephyr()({
    context: __dirname,
    entry: { main: "./src/index.ts" },
    output: {
      path: path.resolve(__dirname, "dist"),
      // Absolute, so the entry script resolves on nested routes like /workouts/new
      // (historyApiFallback serves the same index.html at every path).
      publicPath: "/",
      uniqueName: NAME,
      clean: true,
    },
    devServer: { port: PORT, historyApiFallback: true, hot: true, open: true },
    resolve: {
      extensions: ["...", ".ts", ".tsx", ".jsx"],
      // Resolve the @workout-tracker/* workspace aliases from tsconfig.base.json.
      tsConfig: path.resolve(__dirname, "tsconfig.json"),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          type: "javascript/auto",
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: { plugins: ["@tailwindcss/postcss"] },
              },
            },
          ],
        },
        {
          test: /\.(j|t)sx?$/,
          exclude: [/node_modules/],
          use: {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: { syntax: "typescript", tsx: true },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets:
                  "Chrome >= 87, Firefox >= 78, Edge >= 88, Safari >= 14",
              },
            },
          },
        },
      ],
    },
    plugins: [
      isDev && new ReactRefreshRspackPlugin(),
      new rspack.HtmlRspackPlugin({ template: "./index.html" }),
      // The gateway's origin, baked in at build time. Defaults to the local
      // gateway (PORT in server/apps/gateway/.env.serve).
      new rspack.DefinePlugin({
        GATEWAY_URL: JSON.stringify(
          process.env.GATEWAY_URL ?? "http://localhost:3000",
        ),
      }),
      new ModuleFederationPlugin({
        name: NAME,
        // Declared at build time so Zephyr can rewrite these localhost URLs to
        // each remote's deployed URL (mapped in package.json `zephyr:dependencies`).
        // The keys are the aliases passed to lazyProvider() in src/App.tsx.
        remotes: {
          workoutView: "workoutView@http://localhost:8101/remoteEntry.js",
          workoutHistory: "workoutHistory@http://localhost:8102/remoteEntry.js",
          workoutNew: "workoutNew@http://localhost:8103/remoteEntry.js",
          workoutList: "workoutList@http://localhost:8104/remoteEntry.js",
          auth: "auth@http://localhost:8105/remoteEntry.js",
        },
        shared: sharedDependencies,
        // App.tsx types each remote's props itself, so the remotes' generated
        // types aren't used. Fetching them only raced the remotes' startup
        // under `npm run dev` ("Failed to download types archive").
        dts: { consumeTypes: false },
      }),
      new NxReadySignalPlugin(),
    ].filter(Boolean),
  });
});
