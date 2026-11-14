module.exports = {
  displayName: "ui",
  preset: "../../jest.preset.js",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/client/ui",
};
