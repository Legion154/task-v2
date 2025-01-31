/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        input: "var(--input)",
        hovered: "var(--hovered)",
        selected: "var(--selected)",
      },
    },
  },
  plugins: [],
};
