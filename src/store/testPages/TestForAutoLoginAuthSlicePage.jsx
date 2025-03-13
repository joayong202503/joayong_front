import React from 'react';
import {useSelector} from "react-redux";

const TestForAutoLoginAuthSlicePage = () => {

    const userInfoTest = useSelector((state) => state.auth.user);

    return (
        <div>
            <h1>로그인 여부 : { userInfoTest ? '로그인되었음' : '비로그인'}</h1>
            <p> App 컴포넌트를 감싸는 UserInfoFetcher에서 /me fefch하여 정보 가져옴</p>
            <p>아래에는 useSelector((state) 화살표 state.auth.user)에서 가져오는 모든 값입니다</p>
            {userInfoTest && (
                <div>
                    {Object.entries(userInfoTest).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {value}
                        </li>
                    ))}
                </div>
            )
            }
        </div>
    );
};

export default TestForAutoLoginAuthSlicePage;