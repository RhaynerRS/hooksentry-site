import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
  server: { port: 3000 },
  optimizeDeps: {
    exclude: ["next-intl", "use-intl"],
  },
});
