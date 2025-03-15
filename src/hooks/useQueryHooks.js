// useQuery : fetch 할 때 한 번 서버에서 데이터를 받아온 후, 데이터를 캐시해두고 캐시된 데이터를 반환하도록 함
// 이 파일에는 useQuery를 이용하여 fetch하는 것들이 담겨 있습니다.

import {useQuery} from "@tanstack/react-query";
import fetchWithAuth from "../services/fetchWithAuth.js";
import {postApi} from "../services/api.js";

// Default 세팅
// 캐싱 데이터 유지 시간 (5분)
const STALE_TIME = 100 * 60 * 5;

export const usePostDetailFetchWithUseQuery  = () => {
    /**  ###########  react-query를 통해 캐싱된 데이터를 가져옴 ##################
     * @param {queryKey: react-query에서 00이라는 이름으로 이 쿼리를 관리해주세요., queryFn: 데이터 fetch 로직}
     * @return {data: 서버 응답(responseData)
     *          , isLoading: query에서 로딩중인지 여부
     *          , isError: error가 떳는지 여부
     *          , error: throw Error 처리한 내용(처음에는 undefined, isError 완료된 후 업데이트 됨) }
     */
    return useQuery({
        queryKey: ['postDetail'],  // 쿼리 키는 queryKey로 전달
        queryFn: async () => {     // fetch 함수는 queryFn으로 전달
            const response = await fetchWithAuth(postApi.specificPost);
            const data = await response.json();

            if (!response.ok) {
                // 서버 오류가 발생하면 throw로 에러를 던짐 -> useQuery에서 'error' 항목에 error 내용 받음
                throw new Error(JSON.stringify(data));
            }

            return await response.json();
        },
        staleTime: STALE_TIME
    });
}

