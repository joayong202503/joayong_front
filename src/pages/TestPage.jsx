import React from 'react';
import Button from "../components/common/Button.jsx";

const TestPage = () => {
    return (
        <div>
                <h3> disabled 목록 </h3>
                <Button disabled={true}> 기본 Disabled</Button>
                <Button disabled={true} theme={'blueTheme'}> blueTheme Disabled</Button>
                <Button disabled={true} theme={'blackTheme'}>blackTheme Disabled</Button>
                <Button disabled={true} theme={'whiteTheme'}>whiteTheme Disabled</Button>

                <h3>기본 목록</h3>
                <Button> 기본</Button>
                <Button theme={'blueTheme'}> blueTheme </Button>
                <Button theme={'blackTheme'}>blackTheme</Button>
                <Button theme={'whiteTheme'}>whiteTheme</Button>

                <h3>글자크기 목록</h3>
                <Button> 기본</Button>
                <Button fontSize={'small'}> small</Button>
                <Button fontSize={'medium'}> medium</Button>
                <Button fontSize={'large'}>large</Button>

                <h3>hidden</h3>
                <Button hidden={'hidden'}> 기본</Button>

                <h3>onClick 이벤트</h3>
                <Button onClick={() => {console.log('콘솔창')}}> 콘솔창 확인</Button>
        </div>
    )
//
// @param theme - 전체 테마( blueTHeme, whiteTheme, blackTheme )
// @param fontSize - small(14px), middle(16), large)18)
// @param hidden - hidden (display가 none이 됨)
// @param children
// @param disabled - (*default : false)
// @param type - (*default : 버튼)버튼 종류
// @param className
// @param onClick
// @param props - 기타 props

};

export default TestPage;