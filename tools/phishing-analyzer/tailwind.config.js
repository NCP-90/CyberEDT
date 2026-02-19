/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'primary': '#000000',
        'secondary': '#6b7280',
        'accent': '#3b82f6',
        'background': '#ffffff',
        'surface': '#f9fafb',
        'border': '#e5e7eb',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
        
        // Dark theme colors (keeping cyber theme for dark mode)
        'cyber-black': '#050510',
        'cyber-slate': '#0f0f23', 
        'cyber-blue': '#00f3ff',
        'cyber-green': '#00ff9d',
        'cyber-yellow': '#ffbd2e',
        'cyber-red': '#ff2a6d',
        'cyber-text': '#e2e8f0',
        'cyber-muted': '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 10px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 10px rgba(16, 185, 129, 0.5)',
        'glow-red': '0 0 10px rgba(239, 68, 68, 0.5)',
      }
    },
  },
  plugins: [],
}
