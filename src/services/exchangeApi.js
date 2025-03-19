import fetchWithAuth from '../services/fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'http://localhost:8999'

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_REQUIRED = '/api/joayong';

// 최근 등록된 재능 교환 목록 가져오기
export const fetchRecentExchanges = async (limit = 12,page =0 ) => {
    try {
        // 기존 fetchWithAuth 함수를 사용하여 API 호출
        const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/post/main?size=${limit}&page=${page}`);

        if (!response.ok) {
            throw new Error('API 호출 실패: ' + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('최근 게시글 목록을 가져오는데 실패했습니다:', error);
        throw error;
    }
};


export default fetchRecentExchanges;