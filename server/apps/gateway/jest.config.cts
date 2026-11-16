module.exports = {
  displayName: "gateway",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  // @nestjs/jwt and @nestjs/config ship ESM only; transpile them to CommonJS
  // for Jest.
  transformIgnorePatterns: ["/node_modules/(?!@nestjs/(jwt|config)/)"],
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/server/apps/gateway",
};
