
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authActions, fetchMe} from "../slices/authSlice.js";
import fetchWithUs from "../../services/fetchWithUs.js";
import {authApi} from "../../services/api.js";

const TestForAuthSlicePage = () => {

    // 로그인 여부를 가져오는 함수
    const userInfo = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    // 테스트용 가짜 아이디 로그인 정보(db에 저장해 놓은 로그인 정보)
    const fakeUser = {
        username: 'testUser',
        email: 'abcd@naver.com'
    }

    return (
        <div>
            <h1>로그인 여부 : { userInfo ? '비로그인' : '로그인'}</h1>
            <p>아래에는 useSelector((state) => state.auth.user)에서 가져오는 모든 값입니다</p>
            {userInfo && (
                <div>
                    {Object.entries(userInfo).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </div>
            )
            }
            <button onClick={async () => {
                dispatch(authActions.login(fakeUser));
                await dispatch(fetchMe());
            }}>로그인 버튼</button>
            <button onClick={() => {
                dispatch(authActions.logout());
            }}>로그아웃 버튼</button>
        </div>
    );
};

export default TestForAuthSlicePage;
