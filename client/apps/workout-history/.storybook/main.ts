import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import type { StorybookConfig } from "@storybook/react-vite";

import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },

  viteFinal: async (config) =>
    mergeConfig(config, {
      resolve: {},
      plugins: [
        react(),
        tailwindcss(),
        tsconfigPaths({
          loose: true,
          projects: [
            resolve(
              dirname(fileURLToPath(import.meta.url)),
              "../../../../tsconfig.base.json",
            ),
          ],
        }),
      ],
    }),
};

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;
