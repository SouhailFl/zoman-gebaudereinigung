/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'zoman-cyan': '#00B5FF',
        'zoman-navy': '#0B2545',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'sans-serif',
        ],
      },
      container: {
        center: true,
        padding: '1rem',
      },
      animation: {
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-opacity-40',
    'text-5xl',
    'md:text-6xl',
    'focus:ring-2',
  ],
};