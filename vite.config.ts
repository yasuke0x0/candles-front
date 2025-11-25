import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
     plugins: [react(), tsconfigPaths(), tailwindcss()],
     server: {
          host: true,
     },
     build: {
          chunkSizeWarningLimit: 3000,
          outDir: "build", // This sets the output directory to 'build'
          emptyOutDir: true, // This ensures the output directory is emptied before each build
     },
})
