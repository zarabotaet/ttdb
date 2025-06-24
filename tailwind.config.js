/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blade-primary": "#2563eb",
        "blade-secondary": "#1e40af",
        "blade-tertiary": "#1d4ed8",
      },
    },
  },
  plugins: [],
};
