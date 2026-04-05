/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f0',
          100: '#ffe1df',
          200: '#ffc7c4',
          300: '#ffa19c',
          400: '#ff6b63',
          500: '#ff3d33',
          600: '#ed1c24',
          700: '#c81419',
          800: '#a51419',
          900: '#88171c',
        },
      },
    },
  },
  plugins: [],
}
