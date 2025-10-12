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
  },
  
  // i18n configuration (optional but recommended)
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    }
  },

  // Output mode
  output: 'static',

  // Vite configuration for development
  vite: {
    server: {
      port: 4321,
    }
  }
});