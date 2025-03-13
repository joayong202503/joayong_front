
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authActions, fetchMe} from "../slices/authSlice.js";

const TestForAuthSlicePage = () => {

    // 로그인 여부를 가져오는 함수
    const userInfo = useSelector((state) => state.auth.user);

    const dispatch = useDispatch();

    return (
        <div>
            <h1>로그인 여부 : { userInfo ? '로그인되었음. /me에서 가져온 값을 아래에 표시' : '비로그인'}</h1>
            <p>가상 로그인 테스트를 위해, postman에서 회원가입+로그인 후, 로그인 시 responsebody로 주는 accessToken redux에 저장하였음</p>
            <p>아래에는 useSelector((state) 화살표 state.auth.user)에서 가져오는 모든 값입니다</p>
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
                await dispatch(fetchMe());
            }}>로그인 버튼</button>
            <button onClick={() => {
                dispatch(authActions.deleteUserInfo());
            }}>로그아웃 버튼</button>
        </div>
    );
};

export default TestForAuthSlicePage;
