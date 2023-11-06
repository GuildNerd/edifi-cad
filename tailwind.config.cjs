/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          'pink': '#cc0c39',
          'orange': '#e6781e',
          'yellow': '#c8cf02',
          'beige': '#f8fcc1',
          'blue': '#1693a7',
        },
        baby: {
          'pink': '#f04155',
          'orange': '#ff823a',
          'yellow': '#f2f26f',
          'beige': '#fff7bd',
          'blue': '#95cfb7',
        }
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
