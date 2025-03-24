import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  server: {
    port: 5173, // 프론트엔드 포트 변경
    proxy: {
      "/ws": {
        target: "http://localhost:8999",
        ws: true,
        changeOrigin: true, // 추가: Origin 헤더 변경
        secure: false, // 추가: HTTPS 아닌 경우
        logLevel: "debug", // 추가: 프록시 디버깅 로그 활성화
      },
    },
  },
  plugins: [react()],
  define: {
    global: {},
  },
  
});