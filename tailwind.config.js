/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // ✅ content 경로 확인
  theme: {
    extend: {
      colors: {
        background: "#ffffff", // ✅ bg-background 클래스 추가
        foreground: "#000000", // ✅ text-foreground 클래스 추가
        border: "#e5e7eb", // ✅ border-border 클래스 추가
      },
    },
  },
  plugins: [],
};
