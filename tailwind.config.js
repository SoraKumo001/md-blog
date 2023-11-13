/** @type {import('tailwindcss').Config} */
export const content = [
  './src/**/*.{js,ts,jsx,tsx,mdx}',
  'node_modules/daisyui/dist/**/*.js',
  'node_modules/react-daisyui/dist/**/*.js',
];
export const theme = {
  extend: {},
};
export const daisyui = {
  themes: [
    {
      theme: {
        primary: '#307df8',
        secondary: '#f000b8',
        accent: '#1dcdbc',
        neutral: '#2b3440',
        'base-100': '#ffffff',
        info: '#3abff8',
        success: '#36d399',
        warning: '#fbbd23',
        error: '#f87272',
      },
    },
  ],
};
export const plugins = [require('daisyui')];
