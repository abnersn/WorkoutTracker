// Module Federation `shared` config, reused by the shell and every remote so
// they all agree on which packages are singletons.
const singleton = (requiredVersion) => ({ singleton: true, requiredVersion });

export const sharedDependencies = {
  react: { singleton: true, requiredVersion: "^19" },
  "react-dom": { singleton: true, requiredVersion: "^19" },
  "react-router": { singleton: true },
  "@apollo/client": singleton("^4.0.0"),
  "@apollo/client/react": singleton("^4.0.0"),
  "@workout-tracker/auth-state": {
    singleton: true,
    requiredVersion: false,
    version: "0.0.0",
  },
};
