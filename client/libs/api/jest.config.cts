module.exports = {
  displayName: "api",
  preset: "../../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nx/react/plugins/jest",
    "^.+\\.[tj]sx?$": ["babel-jest", { presets: ["@nx/react/babel"] }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/client/libs/api",
  // No specs yet; an empty run shouldn't fail `nx run-many -t test`.
  passWithNoTests: true,
};
