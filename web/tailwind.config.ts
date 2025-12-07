import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                teal: {
                    500: "#2A9D8F", // Primary color from UI
                    600: "#264653", // Darker teal
                },
                sidebar: "#1E1E1E", // Dark sidebar
                background: "#F5F6FA", // Light background
            },
        },
    },
    plugins: [],
};
export default config;
