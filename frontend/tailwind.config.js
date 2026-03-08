/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#13ecc8",
          50: "#e8fdf9",
          100: "#a8f5e8",
          200: "#6aefd5",
          300: "#2ce9c2",
          400: "#13ecc8",
          500: "#0dbfa3",
          600: "#0a9a83",
          700: "#087563",
          800: "#055043",
          900: "#032b23",
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
