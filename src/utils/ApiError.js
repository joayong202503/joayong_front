// 에러 발생 시 객체로 반환

export class ApiError extends Error {
    constructor(status, message, details) {
        super(message); // 기본 Error.message 설정
        this.status = status; // 상태 코드
        this.details = details; // 추가적인 정보 전달
    }
}
