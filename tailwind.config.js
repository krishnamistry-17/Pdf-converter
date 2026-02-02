/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },

      colors: {
        /*new color platte */
        redprimary: "#E74C3C",
        greenprimary: "#27AE60",
        blueprimary: "#095586",

        /*Color palette*/
        blue: "#09637E",
        teal: "#088395",
        gradient: "#7AB2B2",
        sea: "#EBF4F6",

        /* Borders & UI */
        border: "#E2E8F0", // slate-200
        input: "#CBD5E1", // slate-300

        /* Status */
        success: "#16A34A", // green-600
        warning: "#F59E0B", // amber-500
        error: "#DC2626", // red-600
        info: "#2563EB", // blue-600
      },

      backgroundImage: {
        "site-bg": "linear-gradient(to bottom, #EBF4F6, #7AB2B2, #088395/20)",
      },

      borderRadius: {
        lg: "12px",
        xl: "16px",
      },

      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
        hover: "0 8px 24px rgba(0,0,0,0.08)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },

      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
