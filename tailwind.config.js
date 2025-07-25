/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Animation personnalisée pour l'effet Border Beam
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      // Keyframes pour l'animation de rotation du faisceau
      keyframes: {
        "border-beam": {
          "100%": {
            "--t": "1turn",
          },
        },
      },
    },
  },
  plugins: [],
}