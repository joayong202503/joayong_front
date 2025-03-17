import fetchWithAuth from "./fetchWithAuth";
import { messageApi } from "./api";

// 이미 수락되거나 pending인 매칭 요청이 있는지 확인
export const checkMatchingRequestValidity = async (postId) => {
    try {
        const response = await fetchWithAuth(`${messageApi.isMatchingRequestValid}${postId}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        });

        return await response.json();
    } catch (error) {
        console.error("매칭 요청 유효성 확인 중 오류 발생:", error);
        throw error;
    }
};