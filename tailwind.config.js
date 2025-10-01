/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'labco': ['LABco', 'sans-serif'],
      },
      colors: {
        'bg': '#0B0F12',
        'fg': '#E5E7EB',
        'card': '#111827',
        'muted': '#9CA3AF',
        'accent': '#00BFA6',
      }
    },
  },
  plugins: [],
}
