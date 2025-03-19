module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))', // 커스텀 변수 정의
      },
    },
  },
  plugins: [],
};
