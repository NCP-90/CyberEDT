import { defineConfig } from 'vite'

export default defineConfig({
    base: './',
    server: {
        host: true, // Listen on all addresses
        port: 5173,
        watch: {
            usePolling: true // Sometimes needed in certain environments (WSL, Docker)
        }
    },
})
