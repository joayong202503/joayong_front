// services/postService.js
import fetchWithAuth from "./fetchWithAuth.js";
import {postApi} from "./api.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiError} from '../utils/ApiError.js'

export const increasePostViewCount = async (postId) => {

    try {
        console.log(1111, postId);
        const response = await fetchWithAuth(`${postApi.increaseViewCount}${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            console.warn('조회수 올리기 실패');
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('조회수 증가 오류:', error);
        return null;
    }
};



// 캐싱 데이터 업데이트 하는 부분 제외한 게시물 삭제 로직
const deletePost = async (postId) => {

    console.log('2423423423423234', postId);

    try {
        const response = await fetchWithAuth(`${postApi.deletePost}${postId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const data = await response.json();
            // 서버 내부 오류일 때
            if (response.status === 500) {
                // 에러에 여러 값 반환하기 위해, ApiError라는 클래스를 만들어 객체로 전달
                throw new ApiError(data.status, '서버 오류 발생', data?.message); // ApiError로 구조화된 에러 던지기
            } else if (response.status !== 500) {
                throw new ApiError(response.status, '기타 오류 발생', data?.message); // 다른 상태 코드 에러 처리
            }
        }

        // 성공: 삭제 결과 반환
        return await response.json();

        // 네트워크 문제, url 오류, cors 에러 등
    } catch (error) {
        console.error('네트워크 또는 기타 에러:', error); // 네트워크 에러나 런타임 에러 로그
        throw new ApiError("etc", '네트워크 또는 기타 에러 발생', error.message || '알 수 없는 오류'); // 네트워크 에러 처리
    }
};


// 상세보기 페이지는 캐싱데이터로 관리하기 때문에, useMutation을 사용하여 캐싱데이터에서도 게시글 삭제 해줘야 함
export const useDeletePost = () => {
    const queryClient = useQueryClient(); // React Query의 캐시를 관리하는 객체

    const mutation = useMutation({
        mutationFn: deletePost, // mutation 함수는 mutationFn으로 전달
        onSuccess: (data, postId) => {
            // 삭제 성공 후 캐시 무효화
            queryClient.setQueryData(["postDetail", postId], data);
        },
        onError: (error) => {
            console.error("게시글 삭제 중 오류 발생:", error);
            // ApiError 객체가 반환됨
        },
    });

    return mutation;
};


// 조회수만 따로 받아오기
export const getPostViewCount = async (postId) => {
    return await fetchWithAuth(`${postApi.viewCount}${postId}`);
}


export default useDeletePost;


