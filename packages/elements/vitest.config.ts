import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "elements",
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
    testTimeout: 20000,
  },
});
