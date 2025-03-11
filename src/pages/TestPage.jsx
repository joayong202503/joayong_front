import React from 'react';
import Button from "../components/common/Button.jsx";
import DropDownSelect from "../components/common/DropDownSelect.jsx";
import styles from "./TestPage.module.scss";

const TestPage = () => {
        return (
            <div className={styles.page}>
                    <h1> -------------- 드롭다운(DropDownSelect) PROPS ------------------ </h1>

                    <span> ✅ Placeholder </span><br/>
                    <span> - default 는 내용 없습니다. </span><br/>
                    <span> ✅width</span><br/>
                    <span> - px를 붙이지 않고 숫자만 입력해주세요. 기본값은 fit-content입니다. 드롭다운과 선택 창의 길이가 같게 하려면, 길이를 설정해줘야 합니다.</span><br/>
                    <span> ✅ onValueChange </span><br/>
                    <span> - 선택된 값이 바뀔 때 발생할 이벤트. 선택된 값의 value는 예시와 같이 parameter에 (value)로 받아올 수 있습니다. radix에서
                    자동 상태값 관리 </span>
                    <span> ✅ items </span><br/>
                    <span> 옵션 박스를 만든 객체를 객체 자체로 전달해주시면 됩니다. </span><br/>
                    <span> ✅ keyField</span><br/>
                    <span>각 옵션 컴포너트에서 key 값으로 사용할 값을 정의합니다. 예를들어 items[id]를 각 옵션 박스의 key로 설정하려면, 'id'를 적어주시면 됩니다. </span><br/>
                    <span> ✅ valueField</span><br/>
                    <span>각 옵션 컴포넌트에서 value 값으로 사용할 값을 정의합니다. 예를들어 items[cityName]를 각 옵션 박스의 value로 설정하려면, 'cityName'를 적어주시면 됩니다. </span>
                    <br />

                    <DropDownSelect
                        placeHolder={'플레이스 홀더 수기입력'}
                        width={200}
                        onValueChange={(value) => console.log('선택된 값: ', value)}
                        items={[
                                { id: 1, name: '사과' },
                                { id: 2, name: '딸기' },
                                { id: 3, name: '포도' },
                                { id: 4, name: '배' },
                        ]}
                        keyField='id' // items의 'id'를 key 값으로 해달라
                        valueField='name' // items의 'name'을 value로 해달라
                    />


                    <h1> --------------- 버튼(Button) ----------------- </h1>
                    <h4> Disabled화 : props으로 `disabled=true` </h4>
                    <Button disabled={true}> 기본 Disabled</Button>
                    <Button disabled={true} theme={'blueTheme'}> blueTheme Disabled</Button>
                    <Button disabled={true} theme={'blackTheme'}>blackTheme Disabled</Button>
                    <Button disabled={true} theme={'whiteTheme'}>whiteTheme Disabled</Button>

                    <h3> 색상테마 : props으로 `theme='blue/black/whiteTheme`</h3>
                    <Button> 기본</Button>
                    <Button theme={'blueTheme'}> blueTheme </Button>
                    <Button theme={'blackTheme'}>blackTheme</Button>
                    <Button theme={'whiteTheme'}>whiteTheme</Button>

                    <h4> 글자크기 : props으로 `fontSize=small/medium/large`</h4>
                    <Button> 기본 </Button>
                    <Button fontSize={'small'}> small</Button>
                    <Button fontSize={'medium'}> medium</Button>
                    <Button fontSize={'large'}>large</Button>

                    <h4> display를 none으로 설정 : props으로 `hidden=hidden`</h4>
                    <Button hidden={'hidden'}> 기본</Button>

                    <h4>onClick 이벤트 : onClick으로 props 전달 </h4>
                    <Button theme={'blueTheme'} onClick={() => {
                            console.log('콘솔창')
                    }}> 클릭 후 콘솔창 확인</Button>
            </div>
        );
};

export default TestPage;
