/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
