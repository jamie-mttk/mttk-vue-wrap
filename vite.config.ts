import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from 'vite-plugin-dts';
// import DefineOptions from "unplugin-vue-define-options/vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./packages/vueWrap', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },

  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      include: ['packages/**/*'],
      outDir: 'dist/types'
    })
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: "./packages/index.ts",
      name: "mttk-vue-wrap",
      fileName: "mttk-vue-wrap",
      formats: ["es","umd"]
    },
    rollupOptions: { 
      external: ["vue"], 
      output: { 
        globals: { vue: "Vue" },
        exports: "named"
      } 
    },
    sourcemap: false,
  },
});
