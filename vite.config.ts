import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // === SERVER (só em dev) ===
  server: {
    host: "::", // IPv6 + IPv4
    port: 8080,
    strictPort: true,
  },

  // === PREVIEW (pra vite preview ou Render) ===
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    // LIBERA O RENDER E LOCALHOST
    allowedHosts: ["localhost", ".onrender.com"],
  },

  // === BUILD (otimizações leves) ===
  build: {
    chunkSizeWarningLimit: 1000, // evita warning chato de 500kb
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react", "@radix-ui"],
        },
      },
    },
  },

  // === PLUGINS ===
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  // === ALIAS ===
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
