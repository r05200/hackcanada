/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0F1115',
          800: '#1A1D23',
          700: '#22252C',
          600: '#2A2D35',
          500: '#2F333D',
        },
        accent: {
          DEFAULT: '#6C5CE7',
          hover: '#7F70F0',
          glow: 'rgba(108, 92, 231, 0.3)',
        },
      },
    },
  },
  plugins: [],
}
