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
        light: {
          background: '#f0f4f8',
          surface: '#ffffff',
          primary: '#3b82f6',  // blue-500
          secondary: '#a855f7', // purple-500
          text: {
            primary: '#1e293b', // slate-800
            secondary: '#475569', // slate-600
          },
          border: '#e2e8f0', // slate-200
        },
        dark: {
          background: '#0f172a', // slate-900
          surface: '#1e293b',  // slate-800
          primary: '#3b82f6',  // blue-500
          secondary: '#a855f7', // purple-500
          text: {
            primary: '#f8fafc', // slate-50
            secondary: '#cbd5e1', // slate-300
          },
          border: '#334155', // slate-700
        },
      },
    },
  },
  plugins: [],
}

