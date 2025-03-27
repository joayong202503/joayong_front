import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePostModification = (
    postData, // 서버에 보낼 데이터(editpage에서 중앙관리)
    validationSchema, // yup 유효성 검증
    updatePost, // postData를 업데이트 하는 함수
    queryClient, // 캐싱데이터 무효화용(상세페이지)
    postId
) => {
    const navigate = useNavigate();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
    const [miniModalMessage, setMiniModalMessage] = useState('');
    const [isNegativeMiniModalMessage, setIsNegativeMiniModalMessage] = useState(false);

    // 폼 데이터로 변환
    const transformToFormData = (postData) => {
        const formData = new FormData();
        const newPostData = {...postData};
        delete newPostData.images;

        formData.append('post',
            new Blob([JSON.stringify(newPostData)],
                { type: 'application/json' }));

        // postData.images가 null이 아닌 경우, 사진을 새로 보내는 것이므로
        // 서버에 보낼 update-image 값을 true로 갱신하고 파일을 append
        if (postData.images && Array.isArray(postData.images)) {
            newPostData['update-image'] = true;
            postData.images.forEach(image => {
                formData.append('images', image);
            });
        }
        return formData;
    };

    // 게시글 수정
    const handlePostModification = async () => {
        try {
            await validationSchema.validate(postData, { abortEarly: true });
            const formData = transformToFormData(postData);
            await updatePost(formData);

            // 캐시데이터 무효화
            queryClient.invalidateQueries(['postDetail', postId]);

            handleSuccess();
        } catch (error) {
            handleError(error);
        }
    };

    const handleSuccess = () => {
        setIsConfirmModalOpen(false);
        setIsMiniModalOpen(true);
        setMiniModalMessage('게시글이 정상적으로 수정되었습니다.');

        // 1초 후 상세 페이지로 이동
        setTimeout(() => {
            navigate(`/exchanges/${postId}`);
        }, 1000);
    };

    const handleError = (error) => {
        setIsConfirmModalOpen(false);
        setIsMiniModalOpen(true);
        setIsNegativeMiniModalMessage(true);
        setMiniModalMessage(error.message || error.errors[0]);

        // 2초 후 미니 모달 닫기
        setTimeout(() => {
            setIsMiniModalOpen(false);
            setTimeout(() => {
                setIsNegativeMiniModalMessage(false);
                setMiniModalMessage("정상적으로 처리되었습니다.");
            }, 2010);
        }, 2000);
    };

    return {
        handlePostModification,
        isConfirmModalOpen,
        setIsConfirmModalOpen,
        isMiniModalOpen,
        setIsMiniModalOpen,
        miniModalMessage,
        isNegativeMiniModalMessage
    };
};