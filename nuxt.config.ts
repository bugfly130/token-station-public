import { head } from './nuxt-config'
import vite, { vitePlugins } from './nuxt-config/vite'

const isProduction = process.env.NODE_ENV === 'production'

export default defineNuxtConfig({
  vite,
  ssr: false,
  builder: 'vite',
  debug: !isProduction,
  css: ['@/assets/css/tailwind.css'],

  app: {
    head
  },

  nitro: {
    vercel: {
      functions: {
        maxDuration: 120,
        memory: 1024
      }
    },
    storage: {
      cache: undefined //isProduction ? { driver: 'vercelKV' } : undefined
    }
  },

  typescript: {
    typeCheck: true
  },

  imports: {
    dirs: ['composables/**', 'store/*.ts', 'store/**/index.ts']
  },

  sourcemap: {
    server: false,
    client: true
  },

  plugins: [...vitePlugins],

  pinia: {
    autoImports: ['defineStore']
  },

  modules: [
    '@injectivelabs/ui-shared',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@funken-studio/sitemap-nuxt-3',
    ...(process.env.VITE_BUGSNAG_KEY ? ['@injectivelabs/nuxt-bugsnag'] : [])
  ],

  // @ts-ignore
  sitemap: {
    hostname:
      process.env.VITE_BASE_URL &&
      !process.env.VITE_BASE_URL.includes('localhost')
        ? process.env.VITE_BASE_URL
        : 'https://helixapp.com',
    gzip: true
  },

  // @ts-ignore
  bugsnag: process.env.VITE_BUGSNAG_KEY
    ? {
        disabled: false,
        publishRelease: true,
        baseUrl: process.env.VITE_BASE_URL,
        config: {
          releaseStage: process.env.VITE_ENV,
          notifyReleaseStages: ['staging', 'mainnet'],
          appVersion: process.env.npm_package_version,
          apiKey: process.env.VITE_BUGSNAG_KEY
        }
      }
    : undefined
})
