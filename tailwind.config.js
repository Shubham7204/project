module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'brutal': '4px 4px 0 0 rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0 0 rgba(0,0,0,1)',
        'brutal-lg': '6px 6px 0 0 rgba(0,0,0,1)',
      },
      borderRadius: {
        'brutal': '4px',
      },
      fontFamily: {
        'brutal': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 