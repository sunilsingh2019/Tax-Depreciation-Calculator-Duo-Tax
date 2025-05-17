/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf5fc',
          100: '#d1e6f8',
          200: '#a8cef1',
          300: '#74b0e7',
          400: '#3d8dda',
          500: '#1a6cc3', // Primary blue from Duo Group logo
          600: '#1558a1', // Darker blue for hover
          700: '#124380',
          800: '#0f3361',
          900: '#0c2441',
        },
        accent: {
          50: '#fef8f3',
          100: '#fdeade',
          200: '#f9c9a1',
          300: '#f4a364',
          400: '#ef8d3e',
          500: '#e87722', // Orange accent from Duo Group logo
          600: '#d16616', // Darker orange for hover
          700: '#ad5113',
          800: '#8a400f',
          900: '#67300b',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 0.1 },
          '50%': { opacity: 0.2 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        md: '12px',
      },
    },
  },
  plugins: [],
} 