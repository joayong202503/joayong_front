import fetchWithAuth from '../services/fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'http://localhost:8999/api/joayong'


// 최근 등록된 재능 교환 목록 가져오기
export const fetchRecentExchanges = async (size = 12,page =0 ) => {
    try {
        // 기존 fetchWithAuth 함수를 사용하여 API 호출
        const response = await fetchWithAuth(`${API_URL}/post/main?size=${size}&page=${page}`);

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