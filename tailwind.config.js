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
        app: {
          bg: "#F9FAFB",
          surface: "#F3F4F6",
          card: "#FFFFFF",
          text: "#111827",
          muted: "#6B7280",
          border: "#E5E7EB",
          accent: "#4F8A8B",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
