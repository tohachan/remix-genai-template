import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import path from 'path';

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    }),
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
  },
});
