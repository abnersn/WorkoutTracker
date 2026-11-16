module.exports = {
  displayName: "users-svc",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  // @nestjs/mongoose v12 ships ESM only; transpile it to CommonJS for Jest.
  transformIgnorePatterns: ["/node_modules/(?!@nestjs/mongoose/)"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/server/apps/users-svc",
};
