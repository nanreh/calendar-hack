import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  "base": "/hacks/calendarhack/",
  resolve: {
    alias: [
      // react-datepicker 6 has both "browser" (UMD) and "module" (ESM) fields and no "exports".
      // Vite 8 picks the UMD build, whose default export is not the component. Point at the ESM build.
      // Can be removed once react-datepicker is upgraded to a version with an "exports" field.
      {
        find: /^react-datepicker$/,
        replacement: 'react-datepicker/dist/es/index.js',
      },
    ],
  },
})
