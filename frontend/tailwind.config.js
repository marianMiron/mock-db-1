/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                agentDark: "#0B0F19",
                agentAccent: "#3B82F6",
                agentSuccess: "#10B981"
            }
        },
    },
    plugins: [],
}
