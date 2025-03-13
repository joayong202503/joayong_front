import styles from './ExchangeCreatePage.module.scss';
import { useSelector} from "react-redux";
import DropDownSelect from "../components/common/DropDownSelect.jsx";
import {getSortedRegionCategories, getSortedTalentCategories} from "../utils/sortCategories.js";
import {useRef, useState} from "react";
import InputBox from "../components/common/InputBox.jsx";
import Button from "../components/common/Button.jsx";

const ExchangeCreatePage = () => {

    // ============ 사진 첨부 관련 ====
    const fileInputRef = useRef();
    const contentInputRef = useRef();

    // ============= 재능 관련 ==================
    // 선택된 재능 대분류 카테고리 ID를 상태 관리(소분류 필터링용)
    const [selectedTalentToGiveMainCategoryId, setSelectedTalentToGiveMainCategoryId] = useState(null);
    const [selectedTalentToReceiveMainCategoryId, setSelectedTalentToReceiveMainCategoryId] = useState(null);

    // ============= 지역 관련 ==================
    // 선택된 지역 대, 중 분류 카테고리 ID를 상태 관리(소분류 필터링용)
    const [selectedRegionMainCategoryId, setSelectedRegionMainCategoryId] = useState(null);
    const [selectedRegionMiddleCategoryId, setSelectedRegionMiddleCategoryId] = useState(null);

    // ============ 재능 관련 ==============
    // redux에서 카테고리 정보를 가져후, 가나다순으로 정렬 후, 분류 별로 나눔
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const sortedTalentCategories = getSortedTalentCategories(talentCategories);
    // 소분류는 대분류 선택에 따라 변경되어야 하므로, 별도로 관리
    const talentToGiveSubCategories = sortedTalentCategories.find(category => category.id === selectedTalentToGiveMainCategoryId)?.subTalentList;
    const talentToReceiveSubCategories = sortedTalentCategories.find(category => category.id === selectedTalentToReceiveMainCategoryId)?.subTalentList;
    const titleInputRef = useRef();

    // 메인 카테고리 선택 값이 변하면, 소 카테고리 선택 값도 변하게 하는 함수
    // value 값은 radix primitves seletive 라이브러리에서 자동으로 가져옴
    const handleTalentToGiveMainCategoryChange = (value) => {

        // category.name(카테고리명)이 선택된 value와 일치하는 객체를 찾아, 그 객체의 아이디 값을 저장
        const selectedItem = sortedTalentCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToGiveMainCategoryId(selectedItem.id);
        }
    }

    const handleTalentToReceiveMainCategoryChange = (value) => {
        // category.name(카테고리명)이 선택된 value와 일치하는 객체를 찾아, 그 객체의 아이디 값을 저장
        const selectedItem = sortedTalentCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedTalentToReceiveMainCategoryId(selectedItem.id);
        }
    }

    // ============ 지역 관련 ==============
    // redux에서 카테고리 정보를 가져후, 가나다순으로 정렬 후, 분류 별로 나눔
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);
    const sortedRegionCategories = getSortedRegionCategories(regionCategories);
    // 중/소분류는 대분류 선택에 따라 변경되어야 하므로, 별도로 관리
    const regionMiddleCategories = sortedRegionCategories.find(category => category.id === selectedRegionMainCategoryId)?.subRegionList;
    const regionLastCategories = regionMiddleCategories?.find(category => category.id === selectedRegionMiddleCategoryId)?.detailRegionList;

    // 메인 카테고리 선택 값이 변하면, 중/소 카테고리 선택 값도 변하게 하는 함수
    // value 값은 radix primitves seletive 라이브러리에서 자동으로 가져옴
    const handleRegionMainCategoryChange = (value) => {

        // category.name(카테고리명)이 선택된 value와 일치하는 객체를 찾아, 그 객체의 아이디 값을 저장
        const selectedItem = sortedRegionCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedRegionMainCategoryId(selectedItem.id);
            console.log(selectedRegionMainCategoryId);
        }
    }

    const handleRegionMiddleCategoryChange = (value) => {
        // category.name(카테고리명)이 선택된 value와 일치하는 객체를 찾아, 그 객체의 아이디 값을 저장
        console.log('aaa',regionMiddleCategories);
        const selectedItem = regionMiddleCategories.find(category => category.name === value);
        if (selectedItem) {
            setSelectedRegionMiddleCategoryId(selectedItem.id);
        }
    }


    // ============ 사진 첨부 관련 ====
    // 드롭박스로 만든 div를 클릭해도 input type file 박스가 클릭되도록 함
    const triggerFileInput = () => {
        fileInputRef.current.click();
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.subWrapper}>

                <div className={styles.imageDropArea} id='imageDropArea' onClick={triggerFileInput}>
                    <span className={styles.inputLabel}>능력을 한 눈에 보여줄 수 있는 사진을 첨부해보는 건 어떤가요?<span><br/>
                    </span> 매칭 확률을 높일 수 있어요.</span><br/>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="fileInputBox"
                        accept="image/*"
                        onChange={() => {}}/>
                </div>

                {/* 타이틀 박스 */}
                <div className={`${styles.inputWrapper} ${styles.title}`}>
                    <label htmlFor={'title'}><span className={styles.inputLabel}>제목</span></label>
                    <InputBox
                        placeHolder={'제목을 입력하세요'}
                        width={'100%'}
                        ref={titleInputRef}
                        name={'title'}
                        id={'title'}
                    />
                </div>

                {/* 접선 희망 지역 */}
                <div className={`${styles.inputWrapper} ${styles.location}`}>
                    <span className={styles.inputLabel}>접선 희망 지역</span>
                    <div className={`${styles.dropDownWrapper}`}>
                        <DropDownSelect
                            placeHolder={'대분류'}
                            items={sortedRegionCategories.map((category) => category)}
                            keyField={'id'}
                            valueField={'name'}
                            width={130}
                            // 선택이 되면, 이에 따라 재능 소분류도 변경되어야 함
                            onValueChange={handleRegionMainCategoryChange}
                        ></DropDownSelect>

                        <DropDownSelect
                            placeHolder={'중분류'}
                            items={regionMiddleCategories ? regionMiddleCategories : []}
                            keyField={'id'}
                            valueField={'name'}
                            width={130}
                            // 아직 대분류를 선택하지 않아 값이 없으면, true를 반환 -> radix ui 의 내장 기능으로 disabled됨
                            disabled={!regionMiddleCategories}
                            onValueChange={handleRegionMiddleCategoryChange}
                        />

                        <DropDownSelect
                            placeHolder={'소분류'}
                            items={regionLastCategories ? regionLastCategories : []}
                            keyField={'id'}
                            valueField={'name'}
                            width={130}
                            // 아직 대분류를 선택하지 않아 값이 없으면, true를 반환 -> radix ui 의 내장 기능으로 disabled됨
                            disabled={!regionLastCategories}
                        />
                    </div>
                </div>

                <div className={styles.talentExchangeWrapper}>
                    {/* ==== 내가 줄 재능 ===== */}
                    <div className={styles.inputWrapper}>
                        <span className={styles.inputLabel}>내가 줄 재능</span>
                        {/*재능 대분류 */}
                        <div className={`${styles.dropDownWrapper} ${styles.talentToGive}`}>
                            <DropDownSelect
                                placeHolder={'대분류'}
                                items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
                                keyField={'id'}
                                valueField={'name'}
                                width={130}
                                // 선택이 되면, 이에 따라 재능 소분류도 변경되어야 함
                                onValueChange={handleTalentToGiveMainCategoryChange}
                            ></DropDownSelect>

                            {/* 재눙 소분류 */}
                            <DropDownSelect
                                placeHolder={'소분류'}
                                items={talentToGiveSubCategories ? talentToGiveSubCategories : []}
                                keyField={'id'}
                                valueField={'name'}
                                width={130}
                                // 아직 대분류를 선택하지 않아 값이 없으면, true를 반환 -> radix ui 의 내장 기능으로 disabled됨
                                disabled={!talentToGiveSubCategories}
                            />
                        </div>
                    </div>

                    <div className={styles.inputWrapper}>
                        <span className={styles.inputLabel}>내가 받을 재능</span>
                        {/*재능 대분류 */}
                        <div className={`${styles.dropDownWrapper} ${styles.talentToReceive}`}>
                            <DropDownSelect
                                placeHolder={'대분류'}
                                items={sortedTalentCategories.map((talentMainCategory) => talentMainCategory)}
                                keyField={'id'}
                                valueField={'name'}
                                width={130}
                                // 선택이 되면, 이에 따라 재능 소분류도 변경되어야 함
                                onValueChange={handleTalentToReceiveMainCategoryChange}
                            ></DropDownSelect>

                            {/* 재눙 소분류 */}
                            <DropDownSelect
                                placeHolder={'소분류'}
                                items={talentToReceiveSubCategories ? talentToReceiveSubCategories : []}
                                keyField={'id'}
                                valueField={'name'}
                                width={130}
                                // 아직 대분류를 선택하지 않아 값이 없으면, true를 반환 -> radix ui 의 내장 기능으로 disabled됨
                                disabled={!talentToReceiveSubCategories}
                            />
                        </div>
                    </div>
                </div>

                {/* 내용 적는 박스 */}
                <div className={`${styles.inputWrapper} ${styles.content}`}>
                    <label htmlFor={'content'}><span className={styles.inputLabel}>설명</span></label>
                    <textArea
                        placeHolder={'가르칠 내용과 이 재능에 대한 경험을 설명해주세요'}
                        ref={contentInputRef}
                        name={'title'}
                        id={'title'}
                    />
                </div>

                <div className={styles.submitButtonWrapper}>
                    <Button
                        theme={'blackTheme'}
                        fontSize={'medium'}
                        width={'100%'}
                        className={'fill'}
                    >
                        재능교환 등록하기
                    </Button>
                </div>


            </div>


        </div>
    );
};

export default ExchangeCreatePage;