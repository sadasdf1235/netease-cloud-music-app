import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      }
    }),
  ],
  shortcuts: {
    'center': 'flex items-center justify-center',
    'btn': 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    'icon-btn': 'inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors',
  },
  theme: {
    colors: {
      primary: '#C20C0C', // 网易云音乐红色
      secondary: '#242424', // 深灰色背景
      light: '#F5F5F5', // 浅色背景
    },
  },
})