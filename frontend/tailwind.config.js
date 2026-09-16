/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: {
          DEFAULT: '#040806',
          secondary: '#08100C',
          tertiary: '#0C1813',
        },
        surface: {
          DEFAULT: '#0E1B15',
          secondary: '#13251E',
          tertiary: '#193128',
          glass: 'rgba(14, 27, 21, 0.75)',
        },
        border: {
          DEFAULT: '#1B362C',
          subtle: '#13261F',
          glow: 'rgba(0, 229, 153, 0.4)',
          green: 'rgba(0, 229, 153, 0.4)',
        },
        cortex: {
          green: '#00E599',
          'green-light': '#34D399',
          'green-hover': '#10B981',
          'green-dark': '#059669',
          military: '#1E4336',
          'military-hover': '#285847',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          emerald: '#10B981',
        },
        primary: {
          DEFAULT: '#00E599',
          hover: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          green: '#00E599',
          cyan: '#06B6D4',
          emerald: '#10B981',
          teal: '#14B8A6',
          lime: '#84CC16',
        },
      },
      backgroundImage: {
        'gradient-cortex': 'linear-gradient(135deg, #00E599 0%, #059669 100%)',
        'gradient-cortex-cyan': 'linear-gradient(135deg, #00E599 0%, #06B6D4 100%)',
        'gradient-cortex-dark': 'linear-gradient(180deg, #0E1B15 0%, #08100C 100%)',
        'gradient-surface': 'linear-gradient(135deg, rgba(19,37,30,0.85) 0%, rgba(11,22,17,0.85) 100%)',
        'gradient-laser': 'linear-gradient(90deg, transparent 0%, rgba(0,229,153,0.8) 50%, transparent 100%)',
        'gradient-laser-cyan': 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.8) 50%, transparent 100%)',
      },
      boxShadow: {
        'figma-sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'figma': '0 4px 12px rgba(0, 0, 0, 0.5)',
        'figma-lg': '0 8px 24px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
        'laser-sweep': 'laserSweep 4s ease-in-out infinite',
        'radar-spin': 'radarSpin 8s linear infinite',
        'shimmer-cortex': 'shimmerCortex 2.5s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(0, 229, 153, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(0, 229, 153, 0.55), 0 0 60px rgba(0, 229, 153, 0.2)' },
        },
        laserSweep: {
          '0%, 100%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { transform: 'translateX(100%)', opacity: '1' },
        },
        radarSpin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        shimmerCortex: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
