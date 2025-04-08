import {QueryClient} from "@tanstack/react-query";

// 성능 최적화를 위한 react-query를 통한 캐싱
// 1) 라이브러리 설치 후 new QueryClient()로 쿼리 만들기
export const queryClient = new QueryClient();