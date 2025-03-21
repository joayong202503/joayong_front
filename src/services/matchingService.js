import fetchWithAuth from "./fetchWithAuth";
import {messageApi} from "./api";
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


// 단일 STATUS 조건에 대한 fetch 수행
const fetchSingleStatus = async (filter, status) => {
    // status가 R+C인 경우는 이 함수를 직접 호출하면 안됨
    if (status === 'R+C') {
        throw new Error('R+C status should be handled by fetchCompletedStatus');
    }
    
    const response = await fetchWithAuth(messageApi.getMatchingRequestsWithFilters(filter, status));
    if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
            response.status,
            errorData.message || '매칭 요청 조회 실패',
            errorData
        );
    }
    return response.json();
};

// 메시지 조회할 때 완료된 상태(R, C)를 함께 조회하는 함수
const fetchCompletedStatus = async (filter) => {
    try {
        const urlForStatusR = messageApi.getMatchingRequestsWithFilters(filter, 'R');
        const urlForStatusC = messageApi.getMatchingRequestsWithFilters(filter, 'C');
        console.log(urlForStatusR);
        console.log(urlForStatusC);

        const [statusRData, statusCData] = await Promise.all([
            fetchWithAuth(urlForStatusR).then(res => res.json()),
            fetchWithAuth(urlForStatusC).then(res => res.json())
        ]);

        // 두 결과를 합쳐서 반환
        return [...statusRData, ...statusCData];
    } catch (error) {
        console.error("완료된 상태 조회 중 오류 발생:", error);
        throw error;
    }
};

/**
 * 매칭 요청 메시지 다양한 필터링 적용하여 가져오기
 * @param filter - ALL, RECEIVE, SEND (기본값 : ALL)
 * @param status - N(아무것도 하지 않음), M(매칭됨), D(거절됨), R(수업완료), C(리뷰까지 완료) / (기본값 : null - 모두)
 */
export const fetchMatchingRequestsWithFilters = async (filter = 'ALL', status = null) => {
    try {
        // 사용자에게 보여 줄 때는 1) 수업완료 했지만 리뷰는 안함 2) 수업완료하고 리뷰까지 완료함 <- 을 하나로 갑쳐서 보여줄 것임
        // -> "이 때는 parameter를 "R+C"로 받아서, 두 번 패치할 것임. 따라서 따로 함수 분리해줌
        return status === 'R+C'
            ? await fetchCompletedStatus(filter) // STATUS는 자동으로 R과 c일ONTAL
            : await fetchSingleStatus(filter, status);
    } catch (error) {
        // 서버에서 전달된 오류 메시지를 ApiError 객체로 만들어서 error로 던진 경우
        if (error.status && error.details) {
            throw error;
        }
        console.error("매칭 요청 조회 중 오류 발생:", error);
        throw new ApiError(
            500,
            '기타 오류 발생',
            error
        );
    }
};


/**
 * 메시지 수락 요청하기
 * @param messageId - 수락할 메시지의 ID
 */
export const acceptMatchingRequest = async (messageId) => {
    try {
        const response = await fetchWithAuth(messageApi.acceptMatchingRequest(messageId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            // 성공하지 않는 모든 경우는 백엔드에서 에러 반환
            throw new ApiError(
                response.status,
                errorData.message || '메시지 수락 실패',
                errorData
            );
        }
        return await response.json(); // { isAccept: true }
    } catch (error) {
        // 백엔드에서 200 이외로 응답해서, 프론트에스 응답내용을 객체로 감아서 error를 던진 경우
        if (error instanceof ApiError) {
            throw error; // 이미 ApiError로 처리된 에러는 그대로 전달
        }
        // 기타 예상치 못한 에러는 기타 에러로 처리
        throw new ApiError(
            500,
            '네크워크 오류가 발생했습니다',
            error
        );
    }
};