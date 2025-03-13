import { defineConfig } from 'vite';

export default defineConfig({
  base: '/github.com/ad-run/tomrer-drungilas', // Change this to your actual GitHub repo name
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        kontakt: './kontakt.html', // Add this to include kontakt.html
      },
    },
  },
});

