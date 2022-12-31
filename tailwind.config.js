/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-green-default': '#29ccc4',
        'brand-green-secondary': '#a2d729',
        'brand-blue-light': '#3c91e6',
        'brand-blue-dark': '#12334f',
        'brand-orange-default': '#ffa252',
        'brand-yellow-default': '#ffc224',

        'brand-bg': '#1a191a',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
