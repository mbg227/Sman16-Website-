/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        krem: {
          DEFAULT: "#F5EDE0",
          light: "#FBF7EF",
          dark: "#E8DCC6",
        },
        coklat: {
          muda: "#C9A876",
          DEFAULT: "#8A5A34",
          tua: "#5C3D26",
          gelap: "#3C2818",
        },
        tinta: "#1B140D",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "cube-grid":
          "linear-gradient(30deg, rgba(92,61,38,0.06) 12%, transparent 12.5%, transparent 87%, rgba(92,61,38,0.06) 87.5%, rgba(92,61,38,0.06)), linear-gradient(150deg, rgba(92,61,38,0.06) 12%, transparent 12.5%, transparent 87%, rgba(92,61,38,0.06) 87.5%, rgba(92,61,38,0.06)), linear-gradient(30deg, rgba(92,61,38,0.06) 12%, transparent 12.5%, transparent 87%, rgba(92,61,38,0.06) 87.5%, rgba(92,61,38,0.06)), linear-gradient(150deg, rgba(92,61,38,0.06) 12%, transparent 12.5%, transparent 87%, rgba(92,61,38,0.06) 87.5%, rgba(92,61,38,0.06))",
      },
      backgroundSize: {
        "cube-size": "48px 84px",
      },
      boxShadow: {
        block: "4px 4px 0 0 rgba(92,61,38,0.15)",
        "block-lg": "8px 8px 0 0 rgba(92,61,38,0.12)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
