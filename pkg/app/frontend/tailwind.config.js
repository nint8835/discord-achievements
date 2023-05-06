/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        fontFamily: {
            sans: ['IBM Plex Sans', 'sans-serif'],
            mono: ['IBM Plex Mono', 'monospace'],
        },
        extend: {},
    },
    plugins: [],
};
