// 업로드된 파일 관련 각종 검사 함수들

// img/* 인지 검증하는 함수
export const areImageFiles = (files) => {
    let errorMessage = '';
    let valid = true;

    // FileList를 배열로 변환하여 순회
    Array.from(files).forEach(file => {
        if (!file.type.startsWith("image/")) {
            valid = false;
            errorMessage = "이미지 파일만 업로드 가능합니다.";
        }
    });

    return valid ? { valid: true } : { valid: false, errorMessage };
};

// 파일 개수가 맞는지 확인하는 함수
export const isValidFileCount = (files, maxFileNumber) => {
    if (files.length > maxFileNumber) {
        return { valid: false, errorMessage: `최대 ${maxFileNumber}개의 사진만 업로드 가능합니다.` };
    }
    return { valid: true };
};

// 파일 개별 용량 확인
export const areValidFileSizes = (files, maxSizeMB) => {
    const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;
    let errorMessage = '';
    let valid = true;

    // FileList를 배열로 변환하여 순회
    Array.from(files).forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
            valid = false;
            errorMessage = `${maxSizeMB}MB 이하의 파일만 첨부 가능합니다.`;
        }
    });

    return valid ? { valid: true } : { valid: false, errorMessage };
};
