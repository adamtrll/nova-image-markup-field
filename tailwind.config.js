/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.js',
        './resources/js/**/*.vue',
    ],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'rgba(var(--colors-primary-50))',
                    100: 'rgba(var(--colors-primary-100))',
                    200: 'rgba(var(--colors-primary-200))',
                    300: 'rgba(var(--colors-primary-300))',
                    400: 'rgba(var(--colors-primary-400))',
                    500: 'rgba(var(--colors-primary-500))',
                    600: 'rgba(var(--colors-primary-600))',
                    700: 'rgba(var(--colors-primary-700))',
                    800: 'rgba(var(--colors-primary-800))',
                    900: 'rgba(var(--colors-primary-900))',
                    950: 'rgba(var(--colors-primary-950))',
                },
            },
        },
    },
    plugins: [],
    important: '.image-markup',
}
