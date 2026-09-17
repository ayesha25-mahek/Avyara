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
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        saas: {
          bg: '#0A0F0D',
          dark: '#0E1712',
          surface: '#131F19',
          border: '#1E2F26',
          'border-subtle': '#16231C',
          green: '#2E7D56',
          'green-hover': '#256847',
          'green-dark': '#143324',
          'green-subtle': '#1C382B',
          'green-light': '#52B788',
          'green-muted': '#74C69D',
          text: '#F0F5F2',
          'text-secondary': '#9EB3A8',
          'text-muted': '#6B8276',
        },
      },
    },
  },
  plugins: [],
}
