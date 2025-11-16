import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import webSpatial from '@webspatial/vite-plugin';

export default defineConfig({
  plugins: [
    webSpatial({
      outputDir: '',
    }),
    react({
      jsxImportSource: '@webspatial/react-sdk',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
