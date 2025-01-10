/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // looking for HTML and TypeScript files
  ],
  corePlugins: {
    preflight: false, // disables Tailwind baseline styles
  },
  theme: {
    extend: {}, 
  },
  plugins: [],
};
