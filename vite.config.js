import { defineConfig } from 'vite';

export default defineConfig({
  base: '/tomrer-drungilas/', // Change this to your actual GitHub repo name https://ad-run.github.io/tomrer-drungilas/
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        kontakt: './kontakt.html', // Add this to include kontakt.html
      },
    },
  },
});



