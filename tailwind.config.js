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
      },
      // --- NEW ANIMATION SETTINGS ---
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}