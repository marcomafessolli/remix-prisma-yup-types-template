module.exports = {
  purge: ['./app/**/*.tsx', './app/**/*.jsx', './app/**/*.js', './app/**/*.ts'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
