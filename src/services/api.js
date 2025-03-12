// src/services/api.js

// 백엔드 주소 설정
const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8999'  // 개발 환경
    : '배포 후 백엔드 주소';  // 프로덕션 환경

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_NOT_REQUIRED = '/api/joayong/auth';
const AUTH_REQUIRED = '/api/joayong';

// ================================================================== //

// 카테고리(지역, 재능) 관련 API
export const categoryApi = {
  getRegionAndTalentCategory : `${API_URL}${AUTH_REQUIRED}/category`
};
