// 리뷰 관련 API 호출을 위한 파일
import fetchWithAuth from './fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'https://api.lesson2you.site';

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_REQUIRED = '/api/joayong';

// 리뷰 제출하기
export const submitReview = async (messageId, ratingDetailtList) => {
    try {
        const requestData = {
            messageId,
            ratingDetailtList
        };

        // fetchWithAuth 함수를 사용하여 API 호출
        const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            // 오류 응답 내용 확인
            const errorText = await response.text();
            console.error(`Review API Error (${response.status}):`, errorText);
            throw new Error('API 호출 실패: ' + response.status);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('리뷰 제출에 실패했습니다:', error);
        throw error;
    }
};