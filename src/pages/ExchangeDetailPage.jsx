import React, {useEffect, useState} from 'react';
// import styles from 'ExchangeDetailPage.module.scss';
import {useQuery} from "@tanstack/react-query";
import {postApi} from "../services/api.js";
import {useNavigate} from "react-router-dom";
import {usePostDetailFetchWithUseQuery} from "../hooks/useQueryHooks.js";

const ExchangeDetailPage = () => {

    const navigate = useNavigate();

    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data, isLoading, isError, error } = usePostDetailFetchWithUseQuery();

    // useQuery 작업 완료되었고, 에러 메시지의 status가 500이면 : 서버 오류 페이지로 이동
    // 에러 발생 시, 페이지 이동을 useEffect로 처리
    useEffect(() => {
        if (isError && error) {
            const errorDetails = JSON.parse(error.message); // 에러는 error 객체이고, 그 안에 response 담아두었음
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