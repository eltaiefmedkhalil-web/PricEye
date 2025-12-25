/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#020618',
          900: '#020618',
          800: '#162456',
          700: '#1e3a6e',
        },
        electric: {
          DEFAULT: '#155DFC',
          light: '#12A1D5',
          dark: '#0d4abf',
        },
        cyan: {
          DEFAULT: '#00D3F2',
          light: '#5ee8ff',
          dark: '#12A1D5',
        },
        brand: {
          darkest: '#020618',
          dark: '#162456',
          primary: '#155DFC',
          secondary: '#12A1D5',
          accent: '#00D3F2',
        },
      },
      fontFamily: {
        sans: ['Average Sans', 'system-ui', 'sans-serif'],
        heading: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgb(21 93 252 / 0.5), 0 0 20px rgb(0 211 242 / 0.3)' },
          '100%': { boxShadow: '0 0 10px rgb(21 93 252 / 0.8), 0 0 40px rgb(0 211 242 / 0.5)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #155DFC 0%, #12A1D5 50%, #00D3F2 100%)',
        'brand-gradient-vertical': 'linear-gradient(180deg, #155DFC 0%, #00D3F2 100%)',
      },
    },
  },
  plugins: [],
};
