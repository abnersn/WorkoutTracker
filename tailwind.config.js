const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan
      }
    }
  }
};
