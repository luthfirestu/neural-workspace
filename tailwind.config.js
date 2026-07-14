/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#07080f',
        surface: '#0c0e18',
        panel: '#10131f',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.07)',
          strong: 'rgba(255, 255, 255, 0.12)',
        },
        blue: {
          DEFAULT: '#4facfe',
          dim: 'rgba(79, 172, 254, 0.15)',
        },
        violet: {
          DEFAULT: '#7c5cfc',
          dim: 'rgba(124, 92, 252, 0.15)',
        },
        cyan: '#00f5d4',
        text: '#e2e4ed',
        muted: '#5a6175',
        label: '#8b92a8',
      }
    },
  },
  plugins: [],
}