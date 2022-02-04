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
  buildModules: ['@nuxtjs/svg'],
  modules: ['bootstrap-vue/nuxt'],
  css: ['@/assets/reset.css'],
  vite: {
    plugins: [svgLoader()],
  },
})
