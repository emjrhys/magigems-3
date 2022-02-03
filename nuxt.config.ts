import { defineNuxtConfig } from 'nuxt3'

import svgLoader from 'vite-svg-loader'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  dev: true,
  ssr: false,
  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
  css: ['@/assets/reset.css'],
  buildModules: ['@nuxtjs/svg'],
  modules: ['bootstrap-vue/nuxt'],
  vite: {
    plugins: [svgLoader()],
  },
})
