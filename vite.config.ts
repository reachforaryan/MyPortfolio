import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* The contact form degrades to mailto: without its key, and a deploy that
   forgot the variable degrades silently. The build log is where that gets seen. */
const warnMissingFormKey = {
  name: 'warn-missing-form-key',
  buildStart() {
    if (!process.env.VITE_WEB3FORMS_KEY) {
      console.warn(
        '\n\x1b[33m! VITE_WEB3FORMS_KEY is not set — the contact form will fall back to mailto:\x1b[0m\n'
      );
    }
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), warnMissingFormKey],
});
