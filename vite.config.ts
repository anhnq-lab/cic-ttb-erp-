import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Use "/" for Vercel deployment, "/cic-ttb-erp-/" for GitHub Pages
  const base = process.env.VERCEL ? '/' : '/cic-ttb-erp-/';

  return {
    server: {
      port: 5000,
      host: '0.0.0.0',
    },
    base,
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
