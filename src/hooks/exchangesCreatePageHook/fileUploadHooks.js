import {areImageFiles, areValidFileSizes, isValidFileCount,} from "../../utils/validateUploadedFiles.js";
import {useState} from "react";
// 파일 업로드 관련
export const useFileUpload = () => {
    // 총 업로드할 파일 리스트 및 파일 검사했을 때의 에러 값을 상태값으로 관리
    const [uploadedFile, setUploadedFile] = useState([]);
    const [fileUploadErrorMessage, setFileUploadErrorMessage] = useState(null);

    // 파일 검사하는 함수
    const validateFiles = (allFiles) => {
        // - 검사 결과는 {valid: true/false, (false인 경우) errorMessage: '에러 메시지'}
        const isImageFileFlag = areImageFiles(allFiles); // 이미지 파일인지
        const fileCountFlag = isValidFileCount(allFiles, 5); // 맥시멈 5개
        const validFileSizeFlag = areValidFileSizes(allFiles, 50); // 최대 50MB

        // 각 검사 결과를 확인하고 실패하면 errorMessage 및 valid 여부를 객체로 반환
        if (!isImageFileFlag.valid) {
            return { valid: false, errorMessage: isImageFileFlag.errorMessage };
        } else if (!fileCountFlag.valid) {
            return { valid: false, errorMessage: fileCountFlag.errorMessage };
        } else if (!validFileSizeFlag.valid) {
            return { valid: false, errorMessage: validFileSizeFlag.errorMessage };
        }

        return { valid: true }; // 모든 검사를 통과하면 반환하는 값
    }


    // 파일을 첨부했을 때의 로직
    const handleFileSelect = (e) => {

        // 파일 최대 개수를 구하려면, 검증 함수 호출 전 일단 기존 파일 + 이전 파일을 합쳐서 검증을 해야 함
        const newFiles = Array.from(e.target.files); // 배열이 아닌 FileList이므로 배열로 변환하여 전달
        const allFiles = [...uploadedFile, ...newFiles];

        // 파일 중복 체크: name을 기준으로 중복되는 파일을 제외
        const uniqueFiles = allFiles.filter((file, index, self) =>
            index === self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
        );

        // 파일 검사 : {valid: true/false, (에러시) errorMessage : 에러메시지} 반환함
        const validateFilesResult = validateFiles(uniqueFiles); // 수정된 부분: allFiles 전달

        // 에러가 있었을 시, 에러 메시지 모달을 CreateNewPost 모달에서 띄어주기 위해, usestate로 관리하는 에러 값을 수정해줌
        if (!validateFilesResult.valid) {
            setFileUploadErrorMessage(validateFilesResult.errorMessage); // 에러 메시지 상태 업데이트
            console.log('파일 검사 미통과');
            return;
        }

        // 모든 검사 통과하면 파일 상태 업데이트
        setUploadedFile(uniqueFiles);
        setFileUploadErrorMessage(null); // 에러 메시지 초기화
    };


    return { uploadedFile, setUploadedFile, fileUploadErrorMessage, handleFileSelect };
};
