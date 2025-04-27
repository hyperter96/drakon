/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#DAA520',
        'primary-dark': '#B8860B',
        'secondary': '#07C160',
      },
    },
  },
  plugins: [],
} 