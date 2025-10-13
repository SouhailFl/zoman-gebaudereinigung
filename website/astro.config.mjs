import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  
  // Site configuration
  site: 'https://zoman-gebaudereinigung.de',
  
  // Build configuration
  build: {
    format: 'directory', // Creates /page/ instead of /page.html
    inlineStylesheets: 'auto', // ✨ Inline critical CSS automatically for better LCP
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
  
  // ✨ Enable HTML compression (safe optimization)
  compressHTML: true,

  // Vite configuration
  vite: {
    server: {
      port: 4321,
    },
    build: {
      // ✨ Split CSS per page for better caching
      cssCodeSplit: true,
      
      // ✨ Better file naming for cache busting
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