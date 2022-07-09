module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      Pangolin: ['Pangolin', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      Roboto: ['Roboto', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      Montserrat: ['Montserrat', 'sans-serif', 'ui-sans-serif', 'system-ui'],
      Inter: ['Inter', 'sans-serif', 'ui-sans-serif', 'system-ui'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
