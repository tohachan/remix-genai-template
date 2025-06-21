import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import path from 'path';

export default defineConfig({
  plugins: [
    remix({
      appDirectory: 'app',
      buildDirectory: 'build',
      ignoredRouteFiles: ['**/*.css'],
      serverModuleFormat: 'esm',
    }),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
  build: {
    cssMinify: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for large dependencies
          vendor: ['react', 'react-dom'],
          // RTK Query and Redux toolkit
          redux: ['@reduxjs/toolkit', 'react-redux'],
          // UI library chunks
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          // Chart libraries
          charts: ['recharts'],
          // DnD kit
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          // Calendar library
          calendar: ['react-big-calendar'],
          // Monaco editor
          editor: ['@monaco-editor/react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'recharts',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'react-big-calendar',
    ],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
