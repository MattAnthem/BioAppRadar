import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                work: ['"Work Sans"', 'sans-serif'],
            },
            fontSize: {
                'fluid-h1': [
                  'clamp(0.2rem, 0.4rem + 2vw, 0.5rem)',
                  { lineHeight: '1.2' }
                ],
            },
        },
    },
    plugins: [],
};

export default config;