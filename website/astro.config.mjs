import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  
  // Environment variables
  env: {
    server: ['HCAPTCHA_SECRET_KEY'],
    client: ['PUBLIC_HCAPTCHA_SITE_KEY', 'PUBLIC_EMAIL_SERVICE_URL'],
  },
  
  // Site configuration
  site: 'https://zoman-gebaudereinigung.de',
  
  // Build configuration
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  
  // i18n configuration
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    }
  },

  // Output mode
  output: 'static',
  
  // Enable optimizations
  compressHTML: true,
  prefetch: true,

  // Vite configuration
  vite: {
    server: {
      port: 4321,
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
        }
      },
    },
  }
});