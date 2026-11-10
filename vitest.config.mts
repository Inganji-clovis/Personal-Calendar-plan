import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  cacheDir: "node_modules/.vitest-cache",
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url))
    }
  }
});
