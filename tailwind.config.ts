import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  '#0d2a5c',
        blue:  '#1a4fa0',
        gold:  '#f5a623',
        'gold-dark': '#e8920a',
      },
      fontFamily: {
        mont:  ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)',       'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
