// services/postService.js
import fetchWithAuth from "./fetchWithAuth.js";
import { postApi } from "./api.js";

export const increasePostViewCount = async (postId) => {
    try {
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