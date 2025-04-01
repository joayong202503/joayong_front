import fetchWithAuth from '../services/fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'https://3.34.211.202:8999/api/joayong'

/**
 * 교환 게시물을 검색하는 API 함수
 * @param {string} keyword - 검색 키워드
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 한 페이지당 아이템 수
 * @returns {Promise<Object>} - 검색 결과 데이터
 */
export const searchExchanges = async (keyword, page = 0, size = 12) => {
  try {
    //1. URL 인코딩으로 특수문자 처리
    const encodedKeyword = encodeURIComponent(keyword);
    //2. API 호출
    const response = await fetchWithAuth(
      `${API_URL}/post/search?keyword=${encodedKeyword}&page=${page}&size=${size}`
    );

    // 3. 응답확인
    if (!response.ok) {
      // 404 상태코드이면 응답 본문을 확인
      if (response.status === 404) {
        // 응답 본문 확인
        const errorData = await response.json();

        // "검색결과가 없습니다" 메시지인 경우 빈 결과 반환
        if (errorData.message === "검색결과가 없습니다.") {
          return {
            postList: {
              content: [],
              number: page,
              last: true,
              totalElements: 0,
              totalPages: 0
            }
          };
        }
      }
      throw new Error('검색 결과를 가져오는데 실패했습니다: ' + response.status);
    }
    //4. JSON 변환 및 반환
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('검색 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export default searchExchanges;