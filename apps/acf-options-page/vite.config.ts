/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => ({
  base: process.env.VITE_PUBLIC_URL || '/',
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
  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'mixed-decls', 'color-functions', 'global-builtin', 'if-function']
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
    chunkSizeWarningLimit: 600, // react-vendor is intentionally large due to React and its dependencies, so we set a higher warning limit
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return;

          if (id.includes('@monaco-editor') || id.includes('state-local')) return 'monaco';

          if (
            id.includes('react-markdown') ||
            id.includes('remark-') ||
            id.includes('rehype-') ||
            id.includes('micromark') ||
            id.includes('mdast-') ||
            id.includes('hast-') ||
            id.includes('unified') ||
            id.includes('unist-') ||
            id.includes('vfile') ||
            id.includes('trough') ||
            id.includes('bail')
          )
            return 'markdown';

          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase';

          if (
            id.includes('react') ||
            id.includes('scheduler') ||
            id.includes('redux') ||
            id.includes('reselect') ||
            id.includes('immer') ||
            id.includes('@restart/') ||
            id.includes('@popperjs') ||
            id.includes('dom-helpers') ||
            id.includes('@dnd-kit') ||
            id.includes('@tanstack') ||
            id.includes('react-transition-group') ||
            id.includes('prop-types') ||
            id.includes('classnames') ||
            id.includes('uncontrollable') ||
            id.includes('warning') ||
            id.includes('invariant') ||
            id.includes('@swc/helpers') ||
            id.includes('@babel/runtime') ||
            id.includes('@react-aria') ||
            id.includes('use-sync-external-store')
          )
            return 'react-vendor';

          // No return here — Vite decides where unmatched node_modules go
          // This breaks the circular dependency between vendor <-> react-vendor
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
