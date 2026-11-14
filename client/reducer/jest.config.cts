module.exports = {
  displayName: "reducer",
  preset: "../../jest.preset.js",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  setupFiles: ["<rootDir>/jest.setup.cjs"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/client/reducer",
};
