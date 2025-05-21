// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ou conforme sua estrutura
  ],
  safelist: [
    'bg-cyan-500',
    'scale-110',
    'opacity-50',
    // adicione outras se necessário
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
