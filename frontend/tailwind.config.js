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
        primary: '#10b981', // emerald-500
        secondary: '#6366f1', // indigo-500
        background: '#f8fafc', // slate-50
      }
    },
  },
  plugins: [],
}
