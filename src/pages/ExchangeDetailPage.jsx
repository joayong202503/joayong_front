import React, {useEffect, useState} from 'react';
// import styles from 'ExchangeDetailPage.module.scss';
import {useQuery} from "@tanstack/react-query";
import {postApi} from "../services/api.js";
import fetchWithAuth from "../services/fetchWithAuth.js";
import {useNavigate} from "react-router-dom";

const ExchangeDetailPage = () => {

    const navigate = useNavigate();

    /**  ###########  react-query를 통해 캐싱된 데이터를 가져옴 ##################
     * @param {queryKey: react-query에서 00이라는 이름으로 이 쿼리를 관리해주세요., queryFn: 데이터 fetch 로직}
     * @return {data: 서버 응답(responseData)
     *          , isLoading: query에서 로딩중인지 여부
     *          , isError: error가 떳는지 여부
     *          , error: throw Error 처리한 내용(처음에는 undefined, isError 완료된 후 업데이트 됨) }
     */
        // 로딩 중에는 skeleton을 보여주기 위해, loader로 쓰지 않음
    const { data, isLoading, error, isError }  = useQuery({
        queryKey: ['postDetail'],  // 쿼리 키는 queryKey로 전달
        queryFn: async () => {     // fetch 함수는 queryFn으로 전달
            const response = await fetchWithAuth(postApi.specificPost);
            const data = await response.json();

            if (!response.ok) {
                // 서버 오류가 발생하면 throw로 에러를 던짐 -> useQuery에서 'error' 항목에 error 내용 받음
                throw new Error(JSON.stringify(data));
            }

            return await response.json();
        }
    });

    // fetch 가 완료되었고, 에러 메시지의 status가 500이면 : 서버 오류 페이지로 이동
    // 에러 발생 시, 페이지 이동을 useEffect로 처리
    useEffect(() => {
        if (isError && error) {
            const errorDetails = JSON.parse(error.message);
            if (errorDetails.status === 500) {
                // navigate로 에러 페이지로 이동하면서 메시지 전달
                navigate('/error', {state: { errorPageUrl: window.location.pathname, status: errorDetails.status, message: errorDetails.message }});
            }
        }
    }, [isError, error, navigate]);

    return (
        <div>
        //     테스트용 페이지 입니다.
        </div>
    );
};

export default ExchangeDetailPage;