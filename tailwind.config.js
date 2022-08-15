/** @typedef {import('tailwindcss').Config} Config */

/** @type {Config} */ const config = {
  content: ['./src/**/*.vue'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      spacing: {
        14: '3.5rem',
        72: '18rem',
        80: '20rem',
        88: '22rem',
        96: '24rem',
        104: '26rem',
        112: '28rem',
      },
      minHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      cursor: {
        help: 'help',
      },
    },
  },
}

module.exports = config
