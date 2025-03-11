import { Select } from "radix-ui";
import {
    ChevronDownIcon,
    ChevronUpIcon,
} from "@radix-ui/react-icons";
import styles from "./DropDownSelect.module.scss";
import React, {useEffect} from "react";

/**
 * 공식라이브러리 주소 : https://www.radix-ui.com/primitives/docs/components/select#root
 * @param placeHolder - default : 내용 없음
 * @param width - 박스 길이를 픽셀 단위로 "px 없이" 입력합니다. (default: fit-content)
 * @param onValueChange - 선택된 값이 바뀔 때 발생할 이벤트. 선택된 값의 value는 예시와 같이 parameter에 (value)로 받아올 수 있습니다. value는 radix에서
 *                     자동 상태값 관리됩니다.
 * @param items - 옵션 박스에 넣을 내용이 포함된 객체
 * @params keyField - 각 옵션 컴포너트에서 key 값으로 사용할 값을 정의합니다. 예를들어 items[id]를 각 옵션 박스의 key로 설정하려면, 'id'를 적어주시면 됩니다.
 * @param valueField - 각 옵션 컴포넌트에서 value 값으로 사용할 값을 정의합니다. 예를들어 items[cityName]를 각 옵션 박스의 value로 설정하려면, 'cityName'를 적어주시면 됩니다.
 * @returns {JSX.Element}
 */
const DropDownSelect = ({placeHolder, items, keyField, valueField, width, onValueChange}) => {

    // ! Select Component가 기본적으로 body에 pointEvents를 0으로 설정하게 하는 것을 방지하는 커스텀 훅!
    useEffect(() => {
            document.body.style.pointerEvents = 'auto'; // 스크롤 잠금 해제

    }, []);

    // 눈에 보이는 부분을 감싸는 wrapper
    //  - 열어두려면 open={true}
    //  - value 바뀔 시, onValueChange 이벤트 발생(value는 radix 에서 자동으로 상태값으로 관리)
    return (
        <Select.Root
            onValueChange={onValueChange}
            // open={true}
            className={styles.SelectRoot}>

        {/* 눈에 보이는 부분 div. place holder 글씨 색 : .SelectTrigger[data-placeholder]. width는 prop으로 받아옴 */}
        <Select.Trigger className={styles.SelectTrigger} style={{ width: `${width}px` }}>
            <Select.Value placeholder={placeHolder} />
            {/* 드롭다운 버튼 누르는 아이콘의 wrapper */}
            <Select.Icon className={styles.SelectIcon}>
                {/* 드롭다운 버튼 */}
                <ChevronDownIcon />
            </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
            {/* 스크롤 다운, 내용 등 드롭다운 해야 보이는 부분 전체를 감싸는 wrapper*/}
            {/*    popper : 위치 조정용*/}
            <Select.Content
                position="popper"
                className={styles.SelectContent}
                style={{ width: `${width}px`}}
            >
                <Select.ScrollUpButton className={styles.SelectScrollButton}>
                    <ChevronUpIcon />
                </Select.ScrollUpButton>
                {/* 드롭다운 메뉴에서 스크롤 버튼 빼고 */}
                <Select.Viewport className={styles.SelectViewport}>
                    {/* 항목들만 나열 : 스타일은 아래 SelectItem 컴포넌트에서 지정 */}
                    {items.map(item => (
                        // key는 selectItem component에서 쓸 값. keyField는 selecitem의 자식에게 전달할 값
                        <SelectItem
                            key={item[keyField]}
                            items={item}
                            keyField={keyField}
                            value ={item[valueField]}
                        >
                            {item[valueField]}
                        </SelectItem>
                    ))}


                </Select.Viewport>
                <Select.ScrollDownButton className={styles.SelectScrollButton}>
                    <ChevronDownIcon />
                </Select.ScrollDownButton>
            </Select.Content>
        </Select.Portal>
    </Select.Root>
);

}
export default DropDownSelect;

const SelectItem = React.forwardRef(
    ({ children, items, keyField, ...props }, forwardedRef) => {
        return (
            // 감싸는 div
            <Select.Item
                className={styles.SelectItem}
                {...props}
                ref={forwardedRef}
            >
                {/* 각 선택 옵션 */}
                <Select.ItemText
                    asChild={true}
                    key={items[keyField]}
                >
                    {/* asChild로 감싸진 요소는 여기에서 자유롭게 설정 */}
                    <span className={styles.SelectItemText}>{children}</span>
                </Select.ItemText>    {/* 선택된 항목에 체크 아이콘 표시 */}
            </Select.Item>
        );
    },
);
