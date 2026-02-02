/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                cta: 'var(--color-cta)',
                background: 'var(--color-background)',
                text: 'var(--color-text)',
            },
            fontFamily: {
                heading: ['Exo', 'sans-serif'],
                body: ['Roboto Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
