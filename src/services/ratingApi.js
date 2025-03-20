import fetchWithAuth from "./fetchWithAuth.js";

// API 기본 URL 설정
const API_URL = 'http://localhost:8999';

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_REQUIRED = '/api/joayong';

// 사용자의 별점 리뷰 정보 가져오기
export const fetchUserRatings = async (name) => {
  try {
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/review?username=${name}`);

    if (!response.ok) {
      throw new Error('API 호출 실패: ' + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자의 별점 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
};