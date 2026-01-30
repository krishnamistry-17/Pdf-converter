import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "https://fc137f6830c9.ngrok-free.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 800, // reduces noisy warnings (optional)
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          pdf: ["pdfjs-dist"],
          canvas: ["html2canvas"],
          utils: ["dompurify"],
        },
      },
    },
  },
});
