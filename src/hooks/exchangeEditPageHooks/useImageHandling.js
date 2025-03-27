import { useState } from 'react';

export const useImageHandling = (updatePostData, postData, showConfirmModal) => {
    // 기존 첨부사진 삭제 요청 시 로직
    const handleFileDelete = (selectedImageIndex) => {

        console.log(selectedImageIndex);
        console.log(selectedImageIndex);
        console.log(selectedImageIndex);
        console.log(selectedImageIndex);
        const a = postData.images.filter((_, index) => index !== selectedImageIndex);
        console.log(33333, a);
        console.log(33333, a);
        console.log(33333, a);
        // 서버에서 가져온 이미지인 경우 전체 삭제만 가능
        if (!(postData.images[selectedImageIndex] instanceof File)) {
            updatePostData('update-image', true);
            updatePostData('images', null);
            return;
        }

        // 로컬에서 새로 업로드한 이미지는 개별 삭제 가능
        updatePostData('update-image', true);
        updatePostData('images', postData.images.filter((_, index) => index !== selectedImageIndex));
    };

    return { handleFileDelete };
};