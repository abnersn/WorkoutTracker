// Module Federation `shared` config, reused by the shell and every remote so
// they all agree on which packages are singletons.
export const sharedDependencies = {
  react: { singleton: true, requiredVersion: "^19" },
  "react-dom": { singleton: true, requiredVersion: "^19" },
  "react-router": { singleton: true },
};
