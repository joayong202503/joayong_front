import fetchWithAuth from "./fetchWithAuth";
import { messageApi } from "./api";
import {ApiError} from "../utils/ApiError.js";

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


/**
 * 매칭 요청 메시지 다양한 필터링 적용하여 가져오기
 * @param filter - ALL, RECEIVE, SEND (기본값 : ALL)
 * @param status - N(아무것도 하지 않음), M(매칭됨), D(거절됨) / (기본값 : null)
 * @return - 서버 응답(PROMISE)
 */
export const fetchMatchingRequestsWithFilters = async (filter = 'ALL', status = null) => {
    try {
        // fetch
        const response = await fetchWithAuth(messageApi.getMatchingRequestsWithFilters(filter, status));

        // status code가 200이면, 값 반환
        if (response.ok) {
            return await response.json();
        }

        // 200이 아니면, 에러 던지기
        const errorData = await response.json();
        throw new ApiError(
            response.status,
            errorData.message || '매칭 요청 조회 실패',
            errorData
        );
    } catch (error) {
        // 서버에서 전달된 오류 메시지를 ApiError 객체로 만들어서 error로 던진 경우 
        if (error.status && error.details) {
            throw error;
        }
        // 다른 에러는 ApiError로 변환한 후 전달
        console.error("매칭 요청 조회 중 오류 발생:", error);
        throw new ApiError(
            500,
            '기타 오류 발생',
            error
        );
    }
};