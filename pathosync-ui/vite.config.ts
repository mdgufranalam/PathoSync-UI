import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './'),
            '@/components': resolve(__dirname, './components'),
            '@/hooks': resolve(__dirname, './hooks'),
            '@/utils': resolve(__dirname, './utils'),
            '@/types': resolve(__dirname, './types'),
            '@/styles': resolve(__dirname, './styles')
        }
    },
    define: {
        // Define environment variables
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    server: {
        port: 3000,
        host: true,
        strictPort: false,
        open: true
    },
    preview: {
        port: 4173,
        host: true,
        strictPort: false,
        open: true
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
                    charts: ['recharts'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    animations: ['motion'],
                    utils: ['class-variance-authority', 'clsx', 'tailwind-merge']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'lucide-react',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            'recharts',
            'motion'
        ],
        exclude: ['@vite/client', '@vite/env']
    },
    css: {
        devSourcemap: true
    },
    esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
})