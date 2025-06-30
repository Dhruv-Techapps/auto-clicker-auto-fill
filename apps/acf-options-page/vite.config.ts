/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  root: __dirname,
  resolve: {
    alias: {
      '@acf-options-page': path.resolve(__dirname, 'src')
    }
  },
  cacheDir: '../../node_modules/.vite/apps/acf-options-page',
  server: {
    port: 4200,
    host: 'localhost',
    proxy: {
      '/locales': {
        target: 'http://localhost:3333',
        secure: false,
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4300,
    host: 'localhost'
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true
      },
      include: '**/*.svg'
    }),
    visualizer({ open: true, filename: 'dist/stats.html' })
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          console.log('id', id);
          if (id.includes('node_modules/react-dom/')) {
            return 'react-dom';
          }
          if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) {
            return 'firebase';
          }
          if (id.includes('@tanstack')) {
            return 'tanstack';
          }
          if (id.includes('@dnd-kit')) {
            return 'dnd-kit';
          }
          if (id.includes('node_modules/bootstrap-icons')) {
            return 'bootstrap-icons';
          }
        }
      }
    }
  },
  define: {
    'import.meta.vitest': undefined
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    passWithNoTests: true,
    coverage: {
      reporter: ['lcov'],
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'istanbul' as const
    }
  }
}));
