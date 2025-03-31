import {areImageFiles, areValidFileSizes, isValidFileCount,} from "../../utils/validateUploadedFiles.js";
import {useState} from "react";

// 파일 업로드 관련
export const useFileUpload = () => {
    // 총 업로드할 파일 리스트 및 파일 검사했을 때의 에러 값을 상태값으로 관리
    const [uploadedFile, setUploadedFile] = useState([]);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState('');

    // 파일 검사하는 함수
    const validateFiles = (newFiles, totalImagesCount) => {
        const newFilesArray = Array.from(newFiles);

        // 1. 새로운 파일들에 대한 검증
        // 이미지 파일 형식 검사
        const isImageFileFlag = areImageFiles(newFilesArray);
        if (!isImageFileFlag.valid) {
            return { valid: false, errorMessage: isImageFileFlag.errorMessage };
        }

        // 파일 크기 검사
        const validFileSizeFlag = areValidFileSizes(newFilesArray, 50);
        if (!validFileSizeFlag.valid) {
            return { valid: false, errorMessage: validFileSizeFlag.errorMessage };
        }

        // 2. 전체 이미지 개수 검증
        if (totalImagesCount > 5) {
            return {
                valid: false,
                errorMessage: `최대 5개의 사진만 업로드 가능합니다.`
            };
        }

        return { valid: true };
    };

    // 파일을 첨부했을 때의 로직
    const handleFileSelect = (e, totalImagesCount) => {
        setFileUploadErrorMessage(null);

        // 새로 첨부한 파일만 검증
        const newFiles = Array.from(e.target.files);

        // 유효성 검사
        const validationResult = validateFiles(newFiles, totalImagesCount);

        // 입력 필드 초기화 - 검증 결과와 관계없이 항상 초기화
        e.target.value = '';

        if (!validationResult.valid) {
            setFileUploadErrorMessage(null);
            setTimeout(() => {
                setFileUploadErrorMessage(validationResult.errorMessage);
            }, 10);
            return;
        }

        // 유효성 검사 통과한 경우에만 파일 추가
        const allFiles = [...uploadedFile, ...newFiles];
        // 증복 검사
        const uniqueFiles = allFiles.filter((file, index, self) =>
            index === self.findIndex((f) => f.name === file.name)
        );

        setUploadedFile(uniqueFiles);
    };

    return {
        fileUploadErrorMessage,
        uploadedFile,
        handleFileSelect,
        setUploadedFile,
        setFileUploadErrorMessage
    };
};
