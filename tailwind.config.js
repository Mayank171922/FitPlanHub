/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3498db',
                secondary: '#2c3e50',
                success: '#27ae60',
                danger: '#e74c3c',
                warning: '#f39c12',
            },
        },
    },
    plugins: [],
}