/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./Sinh Portfolio web/**/*.html",
        "./Sinh Portfolio web/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                'cyber-amber': '#FFBF00', // Màu vàng Hổ Phách riêng cho Sinh.EXE
            }
        },
    },
    plugins: [],
}