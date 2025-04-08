import { useState } from 'react';

export const useImageHandling = (updatePostData, postData) => {
    const handleFileDelete = (selectedImageIndex) => {
        const selectedImage = postData.displayImages[selectedImageIndex];

        // 서버 이미지 삭제
        if (!(selectedImage instanceof File)) {
            const currentDeleteIds = Array.isArray(postData['delete-image-ids']) 
                ? postData['delete-image-ids'] 
                : [];
            updatePostData('delete-image-ids', [...currentDeleteIds, selectedImage.id]);
            updatePostData('update-image', true);
        } 
        // 로컬 파일 삭제
        else {
            const updatedImages = postData.images.filter(file => file !== selectedImage);
            updatePostData('images', updatedImages);

            if (updatedImages.length === 0 && !postData['delete-image-ids']?.length) {
                updatePostData('update-image', false);
            }
        }

        const updatedDisplayImages = postData.displayImages.filter((_, idx) => idx !== selectedImageIndex);
        updatePostData('displayImages', updatedDisplayImages);
    };

    return { handleFileDelete };
};