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
        // R : 양쪽 리뷰 안함   & RW : 게시글 글쓴이만 리뷰함  & RS : 게시글 본 사람만 리뷰함 & c : 전체 리뷰함,
        const urlForStatusR = messageApi.getMatchingRequestsWithFilters(filter, 'R');
        const urlForStatusRW = messageApi.getMatchingRequestsWithFilters(filter, 'RW');
        const urlForStatusRS = messageApi.getMatchingRequestsWithFilters(filter, 'RS');
        const urlForStatusC = messageApi.getMatchingRequestsWithFilters(filter, 'C');

        const [statusRData, statusRWData, statusRSData, statusCData] = await Promise.all([
            fetchWithAuth(urlForStatusR).then(res => {
                return res.json().then(data => {
                    console.log('Status R (리뷰 안함) 응답:', data);
                    return data;
                });
            }),
            fetchWithAuth(urlForStatusRW).then(res => {
                return res.json().then(data => {
                    console.log('Status RW (게시글 작성자만 리뷰) 응답:', data);
                    return data;
                });
            }),
            fetchWithAuth(urlForStatusRS).then(res => {
                return res.json().then(data => {
                    console.log('Status RS (요청자만 리뷰) 응답:', data);
                    return data;
                });
            }),
            fetchWithAuth(urlForStatusC).then(res => {
                return res.json().then(data => {
                    console.log('Status C (모두 리뷰 완료) 응답:', data);
                    return data;
                });
            })
        ]);

        const combinedResults = [...statusRData, ...statusCData, ...statusRWData, ...statusRSData];
        console.log('모든 상태 합친 최종 결과:', combinedResults);
        return combinedResults;
    } catch (error) {
        console.error("완료된 상태 조회 중 오류 발생:", error);
        throw error;
    }
};

/**
 * 매칭 요청 메시지 다양한 필터링 적용하여 가져오기
 * @param filter - ALL, RECEIVE, SEND (기본값 : ALL)
 * @param status - N(아무것도 하지 않음), M(매칭됨), D(거절됨), R(수업완료 후 리뷰 안함), RW(수업 완료 후 게시글 쓴 사람만 리뷰), RS(수업 완료 후 매칭 요청 메시지 보낸사람만 리뷰 완료), C(리뷰까지 완료) / (기본값 : null - 모두)
 */
export const fetchMatchingRequestsWithFilters = async (filter = 'ALL', status = null) => {
    try {
        // 사용자에게 보여 줄 때는 1) 수업완료 했지만 리뷰는 안함 2) 수업완료하고 리뷰까지 완료함 <- 을 하나로 보여줄 것임
        // -> "이 때는 parameter를 "R+RW+RS+C"로 받아서, 여러 번 패치 후 통합
        // R : 양쪽 리뷰 안함   & RW : 게시글 글쓴이만 리뷰함  & RS : 게시글 본 사람만 리뷰함 & c : 전체 리뷰함,

        if (status === 'R+RW+RS+C') {
            return await fetchCompletedStatus(filter); // 이미 JSON으로 파싱된 데이터 반환
        }

        const responseData = await fetchSingleStatus(filter, status);
        return await responseData; // Response 객체를 JSON으로 파싱 까지 되어 있음

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

// 매칭 요청을 거절
export const rejectMatchingRequest = async (messageId) => {
    try {
        const response = await fetchWithAuth(messageApi.rejectMatchingRequest(messageId), {
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
                errorData.message || '매칭 거절 실패',
                errorData
            );
        }

        return await response.json(); // { isReject: true }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            '네트워크 오류가 발생했습니다',
            error
        );
    }
};


// 매칭 레슨 완료(리뷰 쓰기 전)
export const fetchCompleteLesson = async (messageId) => {
    try {
        const response = await fetchWithAuth(messageApi.completeLesson(messageId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new ApiError(
                response.status,
                errorData.message || '레슨 완료 처리 실패',
                errorData
            );
        }

        return await response.json(); // { isCompleted: true } 반환
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            '기타 네트워크 오류가 발생했습니다',
            error
        );
    }
};



// 매칭 요청 메시지의 이미지를 조회
export const fetchMatchingRequestMessageImages = async (messageId) => {
    try {
        const response = await fetchWithAuth(`${messageApi.getMatchingRequestMessageImages(messageId)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new ApiError(
                response.status,
                errorData.message || '메시지 이미지 조회 실패',
                errorData
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(
            500,
            '네트워크 오류가 발생했습니다',
            error
        );
    }
};