/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#7c5f54',
          900: '#5d4037',
        },
        wood: {
          light: '#d4a574',
          DEFAULT: '#a0652d',
          dark: '#3e171c',
          maroon: '#800020',
        },
        cream: {
          50: '#faf5f2',
          100: '#f5ebe5',
          200: '#e8d5c7',
          300: '#d9bca3',
          400: '#c9a17f',
          500: '#b88a5f',
          600: '#a67c4f',
          700: '#8b6b42',
          800: '#6d5333',
          900: '#4a3723',
        }
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}