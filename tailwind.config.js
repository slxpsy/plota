/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['Inter', 'sans-serif'], // Перевизначення для повного вилучення monospace
      },
      colors: {
        dark: {
          bg: '#0E1116',
          surface: '#181E26',
          border: '#27313F',
          accent: '#FFB800',
          imdb: '#F5C518',
          textPrimary: '#F3F4F6',
          textSecondary: '#9CA3AF',
        },
        light: {
          bg: '#ECE8E1',
          surface: '#F5F2EC',
          border: '#D8D2C7',
          accent: '#E5A100',
          textPrimary: '#1C1A17',
          textSecondary: '#666056',
        }
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      }
    },
  },
  plugins: [],
}