/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-pink': '#FFE5F0',
        'nav-grey': '#F5F5F5',
        'nav-blue': '#E3F2FD',
        'nav-yellow': '#FFF9C4',
      },
      height: {
        'fluid-xs': 'clamp(100px, 12vw, 150px)',
        'fluid-sm': 'clamp(150px, 20vw, 250px)',
        'fluid-md': 'clamp(200px, 25vw, 400px)',
        'fluid-lg': 'clamp(300px, 40vw, 600px)',
        'fluid-xl': 'clamp(400px, 50vw, 800px)',
        'fluid-thumb': 'clamp(60px, 8vw, 96px)',
        'fluid-avatar': 'clamp(40px, 5vw, 48px)',
        'fluid-icon': 'clamp(24px, 3vw, 32px)',
      },
      fontSize: {
        'fluid-xs': 'clamp(0.625rem, 1vw, 0.75rem)',
        'fluid-sm': 'clamp(0.75rem, 1.25vw, 0.875rem)',
        'fluid-base': 'clamp(0.875rem, 1.5vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 2vw, 1.25rem)',
        'fluid-xl': 'clamp(1.125rem, 2.25vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.25rem, 2.5vw, 1.75rem)',
        'fluid-3xl': 'clamp(1.5rem, 3vw, 2rem)',
      },
      spacing: {
        'fluid-xs': 'clamp(0.25rem, 0.5vw, 0.5rem)',
        'fluid-sm': 'clamp(0.5rem, 1vw, 1rem)',
        'fluid-md': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 3vw, 2.5rem)',
        'fluid-xl': 'clamp(2rem, 4vw, 3rem)',
      },
      gap: {
        'fluid-sm': 'clamp(0.5rem, 1vw, 1rem)',
        'fluid-md': 'clamp(1rem, 2vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      width: {
        'fluid-thumb': 'clamp(60px, 8vw, 96px)',
        'fluid-avatar': 'clamp(40px, 5vw, 48px)',
        'fluid-icon': 'clamp(24px, 3vw, 32px)',
        'fluid-icon-lg': 'clamp(32px, 4vw, 48px)',
      },
    },
  },
  plugins: [],
}
