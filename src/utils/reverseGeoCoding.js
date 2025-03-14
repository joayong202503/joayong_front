// llave, 엔드포인트 설정
const MI_LLAVE = 'bf75c75f520140a2a275a27c0289286e'; // OpenCage에서 받은 API 키
const BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

// 좌표로 주소 찾기 함수
export const getAddressByCoords = async (latitude, longitude) => {

    if (!latitude  || !longitude) return null;

    const url = `${BASE_URL}?q=${latitude}+${longitude}&key=${MI_LLAVE}&language=ko`; // 한국어로 주소 반환

    try {
        // API 요청
        const response = await fetch(url);
        const data = await response.json();

        // 200 아니면 null 반환;
        if (data.status.code !== 200) {
            console.error('해당 경도, 위도의 실제주소를 찾을 수 없습니다:', data.status.message);
            return null;
        }

        // fetch 성공하면 주소 반환
        console.log(data);
        const address = `${data.results[0].components.city} ${data.results[0].components.borough}`; // 첫 번째 결과의 주소
        return address;
    } catch (error) {
        console.error('에러 발생:', error);
        return null;
    }
};