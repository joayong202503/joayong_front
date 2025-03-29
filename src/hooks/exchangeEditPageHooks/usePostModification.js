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

        // 서버에 formdata로 전달할 사진 : 새 로컬 사진만(images key)
        const newImages = newPostData.images || [];

        // displayImages는 서버에서 받은 이미지와 새로 추가된 이미지를 모두 포함
        // delete-image-ids에 포함되지 않은 기존 이미지는 유지되어야 함
        const displayImages = newPostData.displayImages || [];

        // 서버에 post key로 전송할 데이터에서 제외할 필드들
        delete newPostData.images;
        delete newPostData.displayImages;

        // post 데이터를 JSON으로 변환하여 추가
        formData.append('post',
            new Blob([JSON.stringify(newPostData)],
                { type: 'application/json' }));

        // 새로운 이미지만 formData에 추가
        if (newImages && Array.isArray(newImages)) {
            newImages.forEach(image => {
                if (image instanceof File) {
                    formData.append('images', image);
                }
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
