/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Civic Pulse dark theme — inspired by Stitch "Civic Pulse" design
        pulse: {
          bg: '#0F1115',
          card: '#1A1D23',
          surface: '#242830',
          border: '#2E3340',
          accent: '#6C63FF',
          'accent-light': '#8B83FF',
          green: '#34D399',
          orange: '#FB923C',
          red: '#EF4444',
          yellow: '#FBBF24',
          blue: '#60A5FA',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
}
