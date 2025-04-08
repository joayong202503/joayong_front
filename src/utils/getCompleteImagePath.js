import React from 'react';
import {API_URL} from "../services/api.js";

const GetCompleteImagePath = (imagePathServerResponse) => {

    // 빈 값일 때는 아무 것도 하지 않음
    if (!imagePathServerResponse) {
        return null;
    }

    // 사용자 조회 api 에서는 이미지를 imageUrl이 아닌 profileImageUrl으로 줌
    if (imagePathServerResponse.profileImageUrl) {

        if (!imagePathServerResponse.profileImageUrl) {
            return imagePathServerResponse;
        } else {
            return {
                ...imagePathServerResponse,
                profileImageUrl: `${imagePathServerResponse.profileImageUrl}`,
            };
        }
    }

    // Card용 데이터
    if (typeof imagePathServerResponse === 'string') {
        return `${imagePathServerResponse}`
    }

    // 나머지는 imageUrl로 줌
    const data = {
        ...imagePathServerResponse,
        imageUrl: `${imagePathServerResponse.imageUrl}`,
    };
    return data;
};

export default GetCompleteImagePath;