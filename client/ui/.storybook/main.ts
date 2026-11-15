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

  // The published site is composed: this Storybook is the host and the
  // remotes' Storybooks load inside it, each in a sibling folder (see
  // .github/workflows/storybook.yml). Storybook needs absolute URLs here, so
  // the workflow passes the site's address as STORYBOOK_SITE_URL. Without it
  // (local runs and plain builds) the host stands alone.
  refs: (_config, { configType }) => {
    const site = process.env.STORYBOOK_SITE_URL?.replace(/\/$/, "");
    if (configType !== "PRODUCTION" || !site) return {};
    return Object.fromEntries(
      ["workout-new", "workout-view", "workout-list", "workout-history"].map(
        (name) => [name, { title: name, url: `${site}/${name}/` }],
      ),
    );
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
              "../../../tsconfig.base.json",
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

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
