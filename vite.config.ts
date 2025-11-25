import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: './dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    compression({ algorithm: "brotliCompress", ext: ".br" }),
    compression({ algorithm: "gzip", ext: ".gz" })
  ],
  build: {
    target: 'es2022',          
    cssCodeSplit: true,         
    minify: 'terser',           
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'],
        passes: 3,
        hoist_props: true,
        collapse_vars: true,
        reduce_vars: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        switches: true,
        loops: true,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
      maxWorkers: 2,
    },
    rollupOptions: {
      output: {
 
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/@reduxjs')) {
            return 'react';
          }
          if (id.includes('node_modules/@tanstack')) return 'query';
          if (id.includes('node_modules/leaflet')) return 'leaflet';
          if (id.includes('node_modules/axios') || id.includes('node_modules/dayjs') || id.includes('node_modules/moment')) return 'utils';
        },
        entryFileNames: `assets/js/[name].[hash].js`,
        chunkFileNames: `assets/js/[name].[hash].js`,
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? '')) return `assets/css/[name].[hash].[ext]`;
          return `assets/[name].[hash].[ext]`;
        },
      },
    },

    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: [
      'react', 'react-dom', 'react-redux', '@reduxjs/toolkit',
      '@tanstack/react-query', '@tanstack/react-query-devtools',
      '@tanstack/react-query-persist-client', '@tanstack/query-sync-storage-persister',
      'axios', 'dayjs', 'moment', 'moment-timezone', 'idb-keyval',
      'leaflet', 'leaflet-draw', 'react-leaflet',
    ],
  },
});