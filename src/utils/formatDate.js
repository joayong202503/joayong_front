import React from 'react';

function formatDate(dateString) {
    const now = new Date();
    const date = new Date(dateString);

    // 24시간 이내의 날짜인 경우
    const timeDiff = now - date;
    const diffInHours = Math.floor(timeDiff / (1000 * 60 * 60)); // 시간 차이 계산

    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;  // 24시간 이내라면 "X시간 전"
    }

    // 24시간 이상이라면 일반적인 날짜 형식
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간 형식
    }).replace(',', '').replace(/\//g, '.');  // '2025.02.03 14:30' 형식으로 변경
}

export default formatDate;