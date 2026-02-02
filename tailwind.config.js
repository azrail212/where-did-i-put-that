/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "app-bg": "#F7F7F5",
        "app-card": "#FFFFFF",
        "app-surface": "#F1F3F2",
        "app-border": "#E2E6E4",
        "app-text": "#0F172A",
        "app-muted": "#64748B",
        "app-accent": "#4F8A8B",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
