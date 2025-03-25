// 유저 정보 조회
import fetchWithAuth from "./fetchWithAuth.js";
import {userApi} from "./api.js";
import {ApiError} from "../utils/ApiError.js";

export const fetchUserInfo = async (username) => {
    try {
        const response = await fetchWithAuth(userApi.getUserInfo(username));
        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                response.status,
                response.message || '오류 발생',
                data);
        }

        return data;
    } catch (error) {
        console.error('유저 정보를 가져오는데 실패했습니다:', error);
        throw new Error;
    }
};