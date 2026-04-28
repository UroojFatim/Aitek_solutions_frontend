const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF7A00",
        light: {
          background: "#f9f9f9",
          surface: "#ffffff",
          text: "#1a1a1a",
          muted: "#666666",
          border: "#dddddd",
        },
        dark: {
          background: "#333232",
          surface: "#1a1a1a",
          text: "#ffffff",
          muted: "#b8b6b6",
          border: "#403f3f",
        },
      },
    },
  },
  plugins: [],
});
