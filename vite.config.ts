import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // === SERVER (dev only) ===
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
  },

  // === PREVIEW (Render) ===
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    strictPort: true,
    allowedHosts: ["localhost", ".onrender.com"],
  },

  // === BUILD ===
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // VENDOR: pacotes grandes e estáveis
          vendor: ["react", "react-dom", "react-router-dom"],
          // UI: pacotes reais que existem
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-toast",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-accordion",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-switch",
            "@radix-ui/react-label",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-menubar",
            "@radix-ui/react-progress",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-aspect-ratio"
          ],
          utils: [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "lucide-react",
            "date-fns",
            "zod",
            "react-hook-form",
            "@hookform/resolvers"
          ],
          charts: ["recharts"],
          carousel: ["embla-carousel-react"],
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"]
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
