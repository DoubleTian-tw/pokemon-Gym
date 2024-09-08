import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_PATH || "/pokemon-Gym",
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
});
