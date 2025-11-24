import { defineConfig } from "vite"
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';


// https://vitejs.dev/config/
export default defineConfig({
     plugins: [react(), tsconfigPaths()],
     build: {
          chunkSizeWarningLimit: 3000,
          outDir: "build", // This sets the output directory to 'build'
          emptyOutDir: true, // This ensures the output directory is emptied before each build
     },
})
