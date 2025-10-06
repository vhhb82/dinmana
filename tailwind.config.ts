import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#facc15',
          foreground: '#111111',
        },
        accent: '#111111',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(17,17,17,0.08)',
      },
    },
  },
  plugins: [],
}
export default config
