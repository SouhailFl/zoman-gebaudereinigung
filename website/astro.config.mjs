import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  
  // Environment variables (Astro v5 uses PUBLIC_ prefix for client-side vars)
  // Server-side: HCAPTCHA_SECRET_KEY
  // Client-side: PUBLIC_HCAPTCHA_SITE_KEY, PUBLIC_EMAIL_SERVICE_URL
  
  // Site configuration
  site: 'https://zoman-gebaudereinigung.de',
  
  // Build configuration
  build: {
    format: 'directory',
    inlineStylesheets: 'always', // Inline critical CSS to reduce request chains
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
      cssCodeSplit: false, // Bundle all CSS together to reduce requests
      modulePreload: { polyfill: false }, // Modern browsers only, reduce overhead
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks: undefined, // Reduce chunk splitting for fewer requests
        }
      },
    },
  }
});