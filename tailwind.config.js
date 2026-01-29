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
        /* Brand */
        primary: "#DC2626", // red-600
        primaryHover: "#B91C1C", // red-700

        /* Backgrounds */
        background: "#F8FAFC", // slate-50
        card: "#FFFFFF",

        /* Text */
        textPrimary: "#0F172A", // slate-900
        textSecondary: "#475569", // slate-600
        textMuted: "#94A3B8", // slate-400

        /* Borders & UI */
        border: "#E2E8F0", // slate-200
        input: "#CBD5E1", // slate-300

        /* Status */
        success: "#16A34A", // green-600
        warning: "#F59E0B", // amber-500
        error: "#DC2626", // red-600
        info: "#2563EB", // blue-600

        /*Color palette*/
        blue: "#09637E",
        teal: "#088395",
        gradient: "#7AB2B2",
        sea: "#EBF4F6",
      },
      backgroundImage: {
        "main-gradient":
          "linear-gradient(135deg, #EBF4F6 0%, rgba(122,178,178,0.45) 50%, #EBF4F6 100%)",
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
