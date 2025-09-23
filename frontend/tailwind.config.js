/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        border: 'border 4s ease infinite',
      },
      keyframes: {
        border: {
          '0%, 100%': { '--border-angle': '0deg' },
          '50%': { '--border-angle': '180deg' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}