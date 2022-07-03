module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      Pangolin: ['Pangolin', 'sans-serif', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
