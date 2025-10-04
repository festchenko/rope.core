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
        labco: ['var(--font-labco)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        bg: '#0F0F23',
        fg: '#FFFFFF',
        card: 'rgba(255, 255, 255, 0.05)',
        'card-hover': 'rgba(255, 255, 255, 0.08)',
        muted: 'rgba(255, 255, 255, 0.6)',
        accent: '#00BFA6',
        'accent-glow': 'rgba(0, 191, 166, 0.3)',
        border: 'rgba(255, 255, 255, 0.1)',
        shadow: 'rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      height: {
        'dvh': '100dvh',
        'screen': '100vh',
      },
    },
  },
  plugins: [],
};
