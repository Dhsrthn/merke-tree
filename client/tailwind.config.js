/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        clashDisplay: ["clash-display", "sans-serif"],
      },
    },
  },
  plugins: [],
}

