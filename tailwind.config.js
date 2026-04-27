/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← thêm dòng này
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",   // ← thêm
    "./store/**/*.{js,ts,jsx,tsx,mdx}",   // ← thêm
    "./types/**/*.{js,ts,jsx,tsx,mdx}",   // ← thêm
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}