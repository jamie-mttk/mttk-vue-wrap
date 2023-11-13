import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import DefineOptions from "unplugin-vue-define-options/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages/vueWrap', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  build: {
    outDir: "dist",
    lib: {
      entry: "./packages/index.ts",
      name: "mttk-vue-wrap",
      fileName: "mttk-vue-wrap",
    },
    rollupOptions: { external: ["vue"], output: { globals: { vue: "Vue" } } },
  },
});
