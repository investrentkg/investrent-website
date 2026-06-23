/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  safelist: [
    'bg-navy', 'text-navy', 'border-navy',
    'bg-blue', 'text-blue', 'border-blue',
    'bg-gold', 'text-gold', 'border-gold',
    'bg-navy/97', 'bg-blue/8', 'bg-gold/20',
  ],
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
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
