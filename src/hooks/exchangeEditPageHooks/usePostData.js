// 서버에 제출할 값을 상태값 관리
import { useState } from 'react';


// 서버에 제출할 데이터만 관리하는 훅
export const usePostData = () => {
    const [postData, setPostData] = useState({
        'post-id': '',
        title: '',
        content: '',
        'region-id': '',
        'talent-g-id': '',
        'talent-t-id': '',
        'update-image': false, // 수정하기 않으면 기본값은 false
        'delete-image-ids': [], // 기존 이미지 중 삭제할 이미지 : image id 서버에 전달
        images: null, // 새로 추가된 이미지 : 서버에 formdata로 전달할
        displayImages: [], // UI 표시용 이미지 배열(서버 + 추가 이미지)
    });

    // 제목, 내용, 지역id, 재능id를 서버에 보낼 값만 관리하는 postData useState에 업데이트하는 함수
    const updatePostData = (field, value) => {
        setPostData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return { postData, updatePostData };
};