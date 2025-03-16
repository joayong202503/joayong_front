import React from 'react';
import {API_URL} from "../services/api.js";

const GetCompleteImagePath = (imagePathServerResponse) => {

    // http://localhost:8999/fish/uploads/d696ce32-4be9-4728-af77-ffb93b740271_sVideo-Mar22025-VEED-ezgif.com-video-to-gif-converter.gif

    // 빈 값일 때는 아무 것도 하지 않음
    if (!imagePathServerResponse) {
        return null;
    }
    return imagePathServerResponse.map((item) => ({
        ...item,
        imageUrl: `${API_URL}${item.imageUrl}`,
    }));
};

export default GetCompleteImagePath;