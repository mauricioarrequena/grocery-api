const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset({
  tsconfig: "tsconfig.test.json",
}).transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  watchman: false,
  roots: ["<rootDir>/tests"],
  transform: {
    ...tsJestTransformCfg,
  },
  setupFiles: ["<rootDir>/tests/setup.ts"],
};