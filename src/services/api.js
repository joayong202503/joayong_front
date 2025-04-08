// src/services/api.js

// 백엔드 주소 설정
export const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8999'  // 개발 환경
    : 'https://api.lesson2you.site'; // 프로덕션 환경

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_NOT_REQUIRED = '/api/joayong/auth';
const AUTH_REQUIRED = '/api/joayong';

// 주제 별 url 경로
const POST_URL = `${API_URL}${AUTH_REQUIRED}/post`
const MESSAGE_URL = `${API_URL}${AUTH_REQUIRED}/message`;
const USER_URL = `${API_URL}${AUTH_REQUIRED}/user`;
// ================================================================== //

// 카테고리(지역, 재능) 관련 API
export const categoryApi = {
  getRegionAndTalentCategory : `${API_URL}${AUTH_REQUIRED}/category`
};

// 로그인, 로그아웃 관련 API
export const authApi = {
  login : `${API_URL}${AUTH_NOT_REQUIRED}/login`, // 로그인(유저 + 로그인 여부 반환)
  signup : `${API_URL}${AUTH_NOT_REQUIRED}/signup`, //  회원가입입
  me : `${API_URL}${AUTH_REQUIRED}/user/me`, // 유저 정보 반환(자동 로그인인 경우 이 api로 user정보 조회함)
  duplicate : `${API_URL}${AUTH_NOT_REQUIRED}/duplicate-check`, // 이메일, 이름 중복확인 
};

// 게시글 관련 API
export const postApi = {
  newPost : POST_URL, // 게시글 등록 (POST METHOD)
  specificPost : POST_URL,// 단일 게시글 조회
  increaseViewCount : `${POST_URL}/view-count/`, // "POST" MAPPING
  viewCount : `${POST_URL}/view-count/`, // "GET" MAPPING
  deletePost : `${POST_URL}/delete/`, // 게시글 삭제
  updatePost : `${POST_URL}/update`, // 게시글 수정 (PUT)
}

const getMatchingRequestUrl = (filter, status) => {
    // 선택 가능한 옵션 목록
    const VALID_FILTERS = ['ALL', 'RECEIVE', 'SEND'];
    const VALID_STATUS = ['N', 'M', 'D', 'R', 'RW', 'RS', 'C'];


    // 받은 filter 값을 대문자로 변환 -> filter 값이 없거나 유효하지 않으면 기본값으로 ALL 설정
    const validatedFilter =
        (!filter || !VALID_FILTERS.includes(filter?.toUpperCase())) ? 'ALL' : filter.toUpperCase();

    // 받은 status 값을 대문자로 변환 -> filter 값이 없거나 유효하지 않으면 기본값으로 ALL 설정
    const validatedStatus =
        (!status || !VALID_STATUS.includes(status?.toUpperCase())) ? false : status.toUpperCase();

    const fetchUrl = `${MESSAGE_URL}?filter=${validatedFilter}`; // 기본 url 설정
    if (validatedStatus) {
        // status가 있으면 url에 추가
        return `${fetchUrl}&status=${validatedStatus}`;
    }

    return fetchUrl;
}


// 메시지 관련 api
export const messageApi = {
    isMatchingRequestValid: `${MESSAGE_URL}/available?postId=`,
    sendMatchingRequest: `${MESSAGE_URL}`,
    getMatchingRequestsWithFilters: function(filter, status) {
      return getMatchingRequestUrl(filter, status);
    },
    acceptMatchingRequest: function(messageId) {
      return `${MESSAGE_URL}/accept/${messageId}`;
    },
    rejectMatchingRequest: function (messageId) {
        return `${MESSAGE_URL}/reject/${messageId}`;
    },
    // 레슨 완료만 하기(리뷰 등록 전)
    completeLesson: function(messageId) {
        return `${MESSAGE_URL}/complete/${messageId}`;
    },
    // 매칭 요처 메시지 이미지
    getMatchingRequestMessageImages: function(messageId) {
        return `${MESSAGE_URL}/${messageId}`;
    }
}

// user 관련 api
export const userApi = {
  getUserInfo: function (username) {
    return `${USER_URL}/profile/${username}`;
  }
}
