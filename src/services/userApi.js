// src/services/userApi.js
import fetchWithAuth from './fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'http://localhost:8999';

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_REQUIRED = '/api/joayong';

// 사용자 프로필 정보 가져오기
export const fetchUserProfile = async (name) => {
  try {
    // fetchWithAuth 함수를 사용하여 API 호출
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/user/profile/${name}`);

    if (!response.ok) {
      throw new Error('API 호출 실패: ' + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자 프로필을 가져오는데 실패했습니다:', error);
    throw error;
  }
};