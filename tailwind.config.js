/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.js",
  ],
  theme: {
    extend: {
      colors: {
        nx: {
          primary:  '#2D1B69',
          dark:     '#1E1147',
          cream:    '#F5F2EA',
          warm:     '#EDE9DC',
          border:   '#D8D3C8',
          muted:    '#5A5A7A',
          green:    '#3A7D44',
          greenpal: '#E8F2E9',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
      }
    }
  },
  plugins: [],
}

