const { theme } = require('./lib/theme');

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
        bg: theme.colors.background,
        'app-bg': theme.colors.appBackground,
        fg: theme.colors.foreground,
        card: theme.colors.card,
        'card-hover': theme.colors.cardHover,
        muted: theme.colors.muted,
        accent: theme.colors.accent,
        'accent-glow': theme.colors.accentGlow,
        border: theme.colors.border,
        shadow: theme.colors.shadow,
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
