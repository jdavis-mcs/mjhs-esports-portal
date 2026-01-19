/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#B00C1A',
          darkRed: '#A6464D',
          black: '#060606',
          white: '#FEFDFD',
          grey: '#757373',
          yellow: '#FFF500',
          purple: '#9600FF'
        }
      },
      fontFamily: {
        titles: ['Graduate', 'serif'],
        stats: ['Anton', 'sans-serif'],
        body: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}