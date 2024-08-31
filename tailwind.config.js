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
    extend: {
      fontFamily: {
        matemasie: ['Matemasie', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
      },
      colors: {
        primary: {
          DEFAULT: '#B04A4A', // 벽돌색
        },
        secondary: {
          DEFAULT: '#660000', // 노랑색
        },
        accent: {
          DEFAULT: '#333333', // 짙은회색
        },
      },
    },
  },
  plugins: [[require('@tailwindcss/aspect-ratio')]],
}
