/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./src/**/*.{js,jsx,ts,tsx}"],
 theme: {
  extend: {
   fontFamily: {
    sans: ["Poppins", "sans-serif"], // Define "Poppins" como a fonte principal
    serif: ["Georgia", "serif"], // Adicione outras fontes se necessário
   },
  },
 },
 plugins: [],
};
