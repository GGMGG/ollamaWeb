import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 配置按需导入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// 配置@别名
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 按需导入
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 按需导入
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // 路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  base: "./", // 设置基础路径为根目录
});
