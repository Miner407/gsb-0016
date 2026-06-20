/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        volunteer: {
          50: "#FFF4EC",
          100: "#FFE4D0",
          200: "#FFC9A1",
          300: "#FFAE73",
          400: "#FF9344",
          500: "#FF6B35",
          600: "#E6511C",
          700: "#B33E14",
          800: "#802C0E",
          900: "#4D1A08",
        },
        teal: {
          50: "#E8F1F2",
          100: "#C5DDE0",
          200: "#92BCC2",
          300: "#5E9BA3",
          400: "#367A84",
          500: "#1A535C",
          600: "#15434B",
          700: "#10333A",
          800: "#0B2328",
          900: "#061316",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
