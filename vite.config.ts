import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from 'node:url';
// 导入UnoCSS的Vite插件
import UnoCSS from 'unocss/vite';
// 导入UnoCSS预设
import { presetUno, presetAttributify, presetIcons } from 'unocss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 配置UnoCSS
    UnoCSS({
      // 启用开发模式下的CSS生成
      mode: 'vue-scoped',
      // 添加预设
      presets: [
        presetUno(),
        presetIcons({
          scale: 1.2,
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          }
        }),
        presetAttributify()
      ],
      // 快捷方式
      shortcuts: {
        'icon-btn': 'inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors',
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `
          @import "@/styles/variables.less";
          @import "@/styles/mixins.less";
        `
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
