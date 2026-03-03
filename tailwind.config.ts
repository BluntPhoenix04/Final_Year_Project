import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        foreground: '#1a1a1a',
        primary: '#2563eb',
        'primary-dark': '#1e40af',
        accent: '#0ea5e9',
        border: '#e5e7eb',
        'card-bg': '#ffffff',
        'text-secondary': '#6b7280',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
