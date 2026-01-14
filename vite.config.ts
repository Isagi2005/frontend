import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimisation React
      jsxImportSource: 'react',
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les bibliothèques principales
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['framer-motion', 'recharts'],
          utils: ['axios', 'dompurify'],
        },
      },
    },
    // Optimisation du chunk size
    chunkSizeWarningLimit: 1000,
    // Activer le code splitting
    target: 'esnext',
  },
  server: {
    port: 5173,
    // Activer HMR
    hmr: {
      overlay: false,
    },
  },
  preview: {
    port: 5173,
  },
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
