import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hanu.padhloyaar',
  appName: 'PadhLoYaarAI',
  webDir: 'public', // Fallback
  server: {
    url: 'https://plyai.vercel.app', // CHANGE THIS TO YOUR REAL URL
    cleartext: true
  }
};

export default config;
