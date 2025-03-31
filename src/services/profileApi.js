// 사용자 프로필 정보 가져오는 api
import fetchWithAuth from './fetchWithAuth';

// API 기본 URL 설정
const API_URL = 'http://3.34.211.202:8999';

// 인증 필요 여부에 따른 url 앞 부분 경로
const AUTH_REQUIRED = '/api/joayong';

// 사용자 프로필 정보 가져오기
export const fetchUserProfile = async (username) => {
  try {
    // fetchWithAuth 함수를 사용하여 API 호출
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/user/profile/${username}`);

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

// 사용자가 작성한 게시물 가져오기
export const fetchUserPosts = async (username) => {
  try {
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/post/user/${username}`);

    // 404 응답의 경우 게시물이 없다고 간주하고 빈 배열 반환
    if (response.status === 404) {
      console.log('사용자의 게시물이 없습니다.');
      return [];
    }

    // 다른 오류 응답 처리
    if (!response.ok) {
      throw new Error('API 호출 실패: ' + response.status);
    }

    const data = await response.json();

    // data가 null이거나 빈 배열인 경우에도 빈 배열 반환
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('사용자의 게시물을 가져오는데 실패했습니다:', error);
    throw error;
  }
};

// 사용자의 별점 리뷰 정보 가져오기
export const fetchUserRatings = async (username,page= 0,limit=5) => {
  try {
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/review/paging?username=${username}&page=${page}&size=${limit}`);

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

// 프로필 이미지 업로드하기

export const uploadProfileImage = async (imageFile) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append('profile-image', imageFile);

    // 토큰 직접 가져오기
    const token = localStorage.getItem("accessToken");

    // 직접 fetch 호출 (fetchWithAuth 사용하지 않음)
    // multipart/form-data를 위해 Content-Type 헤더를 명시적으로 지정하지 않음
    const response = await fetch(`${API_URL}${AUTH_REQUIRED}/user/update/profile-image`, {
      method: 'PUT',
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('서버 응답 에러:', response.status, errorText);
      throw new Error(`이미지 업로드 API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('프로필 이미지 업로드에 실패했습니다:', error);
    throw error;
  }
};

// 사용자 이름 변경하기
export const updateUsername = async (newName) =>{
  try{
    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/user/update/name?newname=${encodeURIComponent(newName)}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('서버 응답 에러:', response.status, errorText);
      throw new Error(`사용자 이름 변경 API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자 이름 변경에 실패했습니다:', error);
    throw error;
  }
}

// 사용자 재능 카테고리 업데이트하기
export const updateUserCategories = async (categoryData) => {
  try {
    const requestData = {
      "talent-g-id": categoryData.teachingCategoryId,
      "talent-t-id": categoryData.learningCategoryId
    };

    const response = await fetchWithAuth(`${API_URL}${AUTH_REQUIRED}/user/update/talent`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('서버 응답 에러:', response.status, errorText);
      throw new Error(`재능 카테고리 업데이트 API 호출 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('재능 카테고리 업데이트에 실패했습니다:', error);
    throw error;
  }
};
