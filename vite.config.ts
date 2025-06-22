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

    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    exclude: ['@remix-run/dev'],
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
