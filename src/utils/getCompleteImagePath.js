import React from 'react';
import {API_URL} from "../services/api.js";

const GetCompleteImagePath = (imagePathServerResponse) => {

    // http://localhost:8999/fish/uploads/d696ce32-4be9-4728-af77-ffb93b740271_sVideo-Mar22025-VEED-ezgif.com-video-to-gif-converter.gif

    // 빈 값일 때는 아무 것도 하지 않음
    if (!imagePathServerResponse) {
        return null;
    }

    // 사용자 조회 api 에서는 이미지를 imageUrl이 아닌 profileImageUrl으로 줌
    if (imagePathServerResponse.profileImageUrl) {
        console.log('요놈');

        if (!imagePathServerResponse.profileImageUrl) {
            return imagePathServerResponse;
        } else {
            return {
                ...imagePathServerResponse,
                profileImageUrl: `${API_URL}${imagePathServerResponse.profileImageUrl}`,
            };
        }
    }

    // 나머지는 imageUrl로 줌
    return {
        ...imagePathServerResponse,
        imageUrl: `${API_URL}${imagePathServerResponse.imageUrl}`,
    };
};

export default GetCompleteImagePath;