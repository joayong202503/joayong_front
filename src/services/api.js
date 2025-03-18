// src/services/api.js

// 백엔드 주소 설정
export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8999'  // 개발 환경
    : '배포 후 백엔드 주소';  // 프로덕션 환경

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_NOT_REQUIRED = '/api/joayong/auth';
const AUTH_REQUIRED = '/api/joayong';

// 주제 별 url 경로
const POST_URL = `${API_URL}${AUTH_REQUIRED}/post`
const MESSAGE_URL = `${API_URL}${AUTH_REQUIRED}/message`;
// ================================================================== //

// 카테고리(지역, 재능) 관련 API
export const categoryApi = {
  getRegionAndTalentCategory : `${API_URL}${AUTH_REQUIRED}/category`
};

// 로그인, 로그아웃 관련 API
export const authApi = {
  login : `${API_URL}${AUTH_NOT_REQUIRED}/login`, // 로그인(유저 + 로그인 여부 반환)
  me : `${API_URL}${AUTH_REQUIRED}/user/me` // 유저 정보 반환(자동 로그인인 경우 이 api로 user정보 조회함)
};

// 게시글 관련 API
export const postApi = {
  newPost : POST_URL, // 게시글 등록 (POST METHOD)
  specificPost : POST_URL,// 단일 게시글 조회
  increaseViewCount : `${POST_URL}/view-count/`, // 단일 게시글 조회
  deletePost : `${POST_URL}/delete/` // 게시글 삭제
}

// 메시지 관련 api
export const messageApi = {
  isMatchingRequestValid : `${MESSAGE_URL}/available?postId=`
}
