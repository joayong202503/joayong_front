// src/services/api.js

// 백엔드 주소 설정
export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8999'  // 개발 환경
    : '배포 후 백엔드 주소';  // 프로덕션 환경

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_NOT_REQUIRED = '/api/joayong/auth';
const AUTH_REQUIRED = '/api/joayong';

// 주제 별 url 경로
const POST = '/post'
const MESSAGE_URL = `${API_URL}${AUTH_REQUIRED}/message`;
// ================================================================== //

// 카테고리(지역, 재능) 관련 API
export const categoryApi = {
  getRegionAndTalentCategory : `${API_URL}${AUTH_REQUIRED}/category`
};

// // 로그인, 로그아웃 관련 API
// export const authApi = {
//   login : `${API_URL}${AUTH_NOT_REQUIRED}/login`, // 로그인(유저 + 로그인 여부 반환)
//   me : `${API_URL}${AUTH_REQUIRED}/user/me` // 유저 정보 반환(자동 로그인인 경우 이 api로 user정보 조회함)
// };

// 게시글 관련 API
export const postApi = {
  newPost : `${API_URL}${AUTH_REQUIRED}${POST}`, // 게시글 등록 (POST METHOD)
  specificPost : `${API_URL}${AUTH_REQUIRED}${POST}`,// 단일 게시글 조회  (@pathvariable)
  increaseViewCount : `${API_URL}${AUTH_REQUIRED}${POST}/view-count?id=`// 단일 게시글 조회  (@pathvariable로 post)
}

// 메시지 관련 api
export const messageApi = {
  isMatchingRequestValid : `${MESSAGE_URL}/available?postId=`
}
// 📌 **회원가입 및 로그인 API 추가**
export const authApi = {
  signup: async (email, name, password) => {
    const response = await fetch(`${API_URL}${AUTH_NOT_REQUIRED}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    return response.json();
  },

  duplicateCheck: async (type, value) => {
    const response = await fetch(`${API_URL}${AUTH_NOT_REQUIRED}/duplicate-check?type=${type}&value=${value}`);
    return response.json();
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}${AUTH_NOT_REQUIRED}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_URL}${AUTH_REQUIRED}/logout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getUserInfo: async (token) => {
    const response = await fetch(`${API_URL}${AUTH_REQUIRED}/user/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};