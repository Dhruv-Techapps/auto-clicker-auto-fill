/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  root: __dirname,
  resolve: {
    alias: {
      '@acf-configs': path.resolve(__dirname, 'src')
    }
  },
  cacheDir: '../../node_modules/.vite/apps/acf-configs',
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
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
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
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return 'main';
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
    passWithNoTests: true,
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reporter: ['lcov'],
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'istanbul' as const
    }
  }
}));
