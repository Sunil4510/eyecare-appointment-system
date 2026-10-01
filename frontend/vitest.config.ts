import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["**/*.test.tsx", "**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      exclude: [
        "src/**/*.stories.{js,jsx,ts,tsx}",
        "src/**/*.d.{js,ts}",
        "src/**/*.types.{js,ts}",
      ],
    },
  },
});
