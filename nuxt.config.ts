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
  meta: {
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: true,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Rowdies:wght@300;400;700&display=swap',
      },
    ],
  },
  buildModules: ['@nuxtjs/svg'],
  modules: ['bootstrap-vue/nuxt'],
  css: ['@/assets/reset.css'],
  vite: {
    plugins: [svgLoader()],
  },
})
