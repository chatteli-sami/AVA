import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const jestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePathIgnorePatterns: ["<rootDir>/.kilo/", "<rootDir>/.next/"],
  testPathIgnorePatterns: ["<rootDir>/.kilo/", "<rootDir>/.next/", "<rootDir>/node_modules/"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!app/api/**",
    "!**/*.d.ts",
  ],
};

export default createJestConfig(jestConfig);