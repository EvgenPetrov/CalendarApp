import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from "url";

export default defineConfig({
    plugins: [svgr(), react()],
    resolve: {
        alias: {
            src: fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        watch: { usePolling: true, interval: 100 },
    },
});
