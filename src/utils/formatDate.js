import React from 'react';

function formatDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    // 시간 차이를 초 단위로 계산
    const timeDiff = now - date;

    // 분과 시간 차이 계산
    const diffInMinutes = Math.floor(timeDiff / (1000 * 60)); // 분 단위 차이
    const diffInHours = Math.floor(diffInMinutes / 60); // 시간 단위 차이

    // 5분 이내라면 "방금 전"
    if (diffInMinutes < 5) {
        return "방금 전";
    }

    // 1시간 이내라면 "X분 전"
    if (diffInHours < 1) {
        return `${diffInMinutes}분 전`;
    }

    // 24시간 이내라면 "X시간 전"
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    // 24시간 이상이라면 일반적인 날짜 형식
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간 형식
    }).replace(',', '').replace(/\//g, '.'); // '2025.02.03 14:30' 형식으로 변환
}

export default formatDate;
