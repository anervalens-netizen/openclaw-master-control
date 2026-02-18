import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';

// Custom plugin to auto-start bridge.js with Vite
const bridgePlugin = () => {
  let bridgeProcess: any = null;
  return {
    name: 'start-bridge',
    configureServer() {
      if (bridgeProcess) return;
      console.log('🚀 Starting OpenClaw Bridge...');
      bridgeProcess = spawn('node', ['bridge.js'], {
        stdio: 'inherit',
        shell: true
      });

      process.on('exit', () => bridgeProcess?.kill());
      process.on('SIGINT', () => bridgeProcess?.kill());
      process.on('SIGTERM', () => bridgeProcess?.kill());
    }
  };
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        strictPort: true,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
      plugins: [react(), bridgePlugin()],
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
