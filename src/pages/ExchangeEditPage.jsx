import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TitleInputSection from "../components/ExchangeCreatePage/TitleInputSection";
import DropDownBasic from '../components/common/DropDownBasic';
import ContentInputSection from '../components/ExchangeCreatePage/ContentInputSecition';
import {fetchPostDetail} from '../services/postService.js';
import styles from './ExchangeEditPage.module.scss';
import {
    filterRegionCategories, getRegionDetailsObjectBySubId,
    getSortedTalentCategories,
    getTalentCategoryDetailsObject
} from "../utils/sortAndGetCategories.js";
import Button from "../components/common/Button.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";

const ExchangeEditPage = () => {

    const { exchangeId: postId } = useParams();
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name);

    // Ref
    const refs = {
        title: useRef(null),
        secondRegion: useRef(null),
        thirdRegion: useRef(null),
        talentGiveMain: useRef(null),
        talentGiveSub: useRef(null),
        talentTakeMain: useRef(null),
        talentTakeSub: useRef(null),
        content: useRef(null)
    };

    // State
    const [postData, setPostData] = useState({
        post: null,
        region: {
            main: null,
            middle: null,
            last: null
        },
        talent: {
            give: { main: null, sub: null },
            take: { main: null, sub: null }
        }
    });

    // 컨펌 모달 훅
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState(() => () => {});
    const [confirmModalOnCancel, setConfirmModalOnCancel] = useState(() => () => {});

    // 미니 모달
    const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
    const [miniModalOnClose, setMiniModalOnClose] = useState(() => () => {});

    // Selectors
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const sortedTalentCategories = useMemo(() => {
        return getSortedTalentCategories(talentCategories);
    });

    // 게시글 상세정보 가져오기
    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await fetchPostDetail(postId);
            const data = await response.json();

            // region-id 로 대/중/소분류 이름 가져오기(api는 소분류만 제공)
            const regionDetails = getRegionDetailsObjectBySubId(data['region-id'], regionCategories) || [];

            // talent id로 대/소분류 상세정보 가져오기(api는 소분류만 제공)
            const giveDetails = getTalentCategoryDetailsObject(data['talent-g-id'], talentCategories);
            const takeDetails = getTalentCategoryDetailsObject(data['talent-t-id'], talentCategories);

            setPostData(prev => ({
                ...prev,
                post: data,
                region: {
                    main: regionDetails?.mainCategory,
                    middle: regionDetails?.subCategory,
                    last: regionDetails?.smallCategory
                },
                talent: {
                    give: {
                        main: giveDetails?.mainCategory,
                        sub: giveDetails?.subCategory
                    },
                    take: {
                        main: takeDetails?.mainCategory,
                        sub: takeDetails?.subCategory
                    }
                }
            }));
        } catch (error) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    status: error.status,
                    message: error.message,
                }
            });
        }
    }, [postId, regionCategories, talentCategories, navigate]);

    // 내 게시글 아니면 접근 다시 한 번 이중 차단
    useEffect(() => {
        if (postData.post && postData.post.name !== myUsername) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    message: "내 게시글만 수정 가능합니다."
                }
            });
        }
    }, [postData.post, myUsername, navigate]);

    // 게시글 상세정보 가져오기
    useEffect(() => {
        fetchPostDetails();

        // 제목란에 focus하기
        if (refs.title.current) {
            refs.title.current.focus();
        }
    }, [postId, fetchPostDetails]);

    // 드롭다운 값 변경 시 영역별 각종 처리 로직
    const handleCategoryChange = (type, level) => (selectedItem) => {
        console.log(selectedItem, '111111111111111111111111111111111');
        if (!selectedItem) return;

        // post 자체를 수정해주기
        setPostData(prev => {
            // find 등의 함수를 쓰기 위해 객체 복사
            const updatedData = { ...prev };

            // 지역을 변경할 때
            if (type === 'region') {

                // 지역 대분류 변경할 때
                if (level === 'main') {
                    updatedData.region = {
                        main: selectedItem, // 대분류는 선택한 값으로
                        middle: null, // 중/소분류는 null로
                        last: null
                    };
                } else if (level === 'middle') {
                    updatedData.region = {
                        ...prev.region, // 기존 값 유지
                        middle: selectedItem, // 중분류는 선택한 값으로
                        last: null // 소분류는 null로
                    };
                } else if (level === 'last') {
                    updatedData.region = {
                        ...prev.region,
                        last: selectedItem
                    };
                }
            // 재능을 변경할 때
            } else if (type === 'talent') {
                if (level === 'give-main') {
                    updatedData.talent.give = {
                        main: selectedItem, // 대분류는 선택한 값으로
                        sub: null // 소분류는 null로
                    };
                } else if (level === 'give-sub') {
                    updatedData.talent.give = {
                        ...prev.talent.give, // 기존 값 유지
                        sub: selectedItem // 소분류는 선택한 값으로
                    };
                } else if (level === 'take-main') {
                    updatedData.talent.take = {
                        main: selectedItem,
                        sub: null
                    };
                } else if (level === 'take-sub') {
                    updatedData.talent.take = {
                        ...prev.talent.take,
                        sub: selectedItem
                    };
                }
            }

            return updatedData;
        });

        // 자동 포서크 관련
        const focusMap = {
            'region-main': refs.secondRegion,
            'region-middle': refs.thirdRegion,
            'region-last': refs.talentGiveMain,
            'talent-give-main': refs.talentGiveSub,
            'talent-give-sub': refs.talentTakeMain,
            'talent-take-main': refs.talentTakeSub,
            'talent-take-sub': refs.content
        };

        const focusKey = `${type}-${level}`; // parameter로 (region, main)을 주면, 위 focusmap에서 region-main에 해당하는 focus할 부분을 찾아온다.
        if (focusMap[focusKey]?.current) {
            // focusKey값이 'talent-take-sub'면 refs.content(textarea)의 글자 가장 뒤에 focus, 나머지는 그냥 focus
            if (focusKey === 'talent-take-sub') {
                focusMap[focusKey].current.focus();
                focusMap[focusKey].current.setSelectionRange(focusMap[focusKey].current.value.length, focusMap[focusKey].current.value.length);
                return;
            }
            setTimeout(() => focusMap[focusKey].current.focus(), 0);
        }
    };

    if (!postData.post) return null;

    console.log(postData);
    console.log(111);
    console.log(111);
    console.log(111);

    // 컨펌 모달
    const showConfirmModal = ({ title, message, onConfirm, onCancel }) => {
        setIsConfirmModalOpen(true);
        setConfirmModalTitle(title);
        setConfirmModalOnConfirm(onConfirm);
        setConfirmModalOnCancel(onCancel);
    };

    return (
        <div className={styles.postEditPage}>
            <TitleInputSection
                label="제목"
                placeholder="제목을 입력하세요"
                ref={refs.title}
                id="title"
                maxLength={50}
                defaultValue={postData.post.title}
            />

            {/* 지역 선택 섹션 */}
            <div className={`${styles.locationSection} ${styles.contentBox}`}>
                <span className={styles.title}>여기서 만날 수 있어요</span>
                <div className={styles.locationContainer}>
                    <DropDownBasic
                        options={regionCategories}
                        defaultOption={postData.region.main}
                        onChange={handleCategoryChange('region', 'main')}
                        selectedOption={postData.region.main}
                        width={150}
                        placeholder={'대분류'}
                    />
                    <DropDownBasic
                        options={postData.region.main?.subRegionList || []}
                        defaultOption={postData.region.middle}
                        onChange={handleCategoryChange('region', 'middle')}
                        selectedOption={postData.region.middle}
                        width={150}
                        ref={refs.secondRegion}
                        disabled={!postData.region.main}
                        placeholder={'중분류'}
                    />
                    <DropDownBasic
                        options={postData.region.middle?.detailRegionList || []}
                        defaultOption={postData.region.last}
                        onChange={handleCategoryChange('region', 'last')}
                        selectedOption={postData.region.last}
                        width={150}
                        ref={refs.thirdRegion}
                        disabled={!postData.region.middle}
                        placeholder={'소분류'}
                    />
                </div>
            </div>

            {/* 재능 섹션 */}
            <div className={styles.bothTalentsContainer}>
                {/* 줄 재능 */}
                <div className={`${styles.talentSection} ${styles.contentBox} ${styles.half}`}>
                    <span className={styles.title}>내가 줄 재능</span>
                    <div className={styles.locationContainer}>
                        <DropDownBasic
                            ref={refs.talentGiveMain}
                            options={sortedTalentCategories}
                            defaultOption={postData.talent.give.main}
                            onChange={handleCategoryChange('talent', 'give-main')}
                            selectedOption={postData.talent.give.main}
                            width={150}
                            placeholder={'대분류'}
                        />
                        <DropDownBasic
                            ref={refs.talentGiveSub}
                            options={postData.talent.give.main?.subTalentList || []}
                            defaultOption={postData.talent.give.sub}
                            onChange={handleCategoryChange('talent', 'give-sub')}
                            selectedOption={postData.talent.give.sub}
                            width={150}
                            placeholder={'소분류'}
                            disabled={!postData.talent.give.main}
                        />
                    </div>
                </div>

                {/* 받을 재능 */}
                <div className={`${styles.talentSection} ${styles.contentBox} ${styles.half}`}>
                    <span className={styles.title}>내가 받을 재능</span>
                    <div className={styles.locationContainer}>
                        <DropDownBasic
                            ref={refs.talentTakeMain}
                            options={sortedTalentCategories}
                            defaultOption={postData.talent.take.main}
                            onChange={handleCategoryChange('talent', 'take-main')}
                            selectedOption={postData.talent.take.main}
                            width={150}
                            placeholder={'대분류'}
                        />
                        <DropDownBasic
                            ref={refs.talentTakeSub}
                            options={postData.talent.take.main?.subTalentList || []}
                            defaultOption={postData.talent.take.sub}
                            onChange={handleCategoryChange('talent', 'take-sub')}
                            selectedOption={postData.talent.take.sub}
                            width={150}
                            placeholder={'소분류'}
                            disabled={!postData.talent.take.main}
                        />
                    </div>
                </div>
            </div>

            {/* 내용 */}
            <ContentInputSection
                maxlength={2200}
                placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"
                isTitleNecessary={true}
                name={'content'}
                ref={refs.content}
                defaultValue={postData.post.content}
            />

            <div className={styles.buttonContainer}>
                <Button
                    theme={'whiteTheme'}
                    fontSize={'small'}
                    onClick={() => showConfirmModal({
                        title: '게시글 수정을 취소하시겠습니까?',
                        onConfirm: () => () => {
                            // minmodal 2초 지속. 미니 모달 닫힌 후 이전 페이지로 이동(미니 모달 사용자가 닫아도 마찬가지)
                            setIsConfirmModalOpen(false);
                            setIsMiniModalOpen(true);
                            setMiniModalOnClose(() => () => navigate(-1));
                        },
                        onCancel: () => () => setIsConfirmModalOpen(false)
                    })}
                > 취소하기</Button>
                <Button
                    theme={'blueTheme'}
                    fontSize={'small'}
                    onClick={() => showConfirmModal({
                        title: '게시글을 수정하시겠습니까?',
                        // onConfirm: handlePostModification,
                        onConfirm: () => () => alert("수정수정"),
                        onCancel: () => () => {setIsConfirmModalOpen(false)}
                    })}
                > 수정하기
                </Button>
            </div> {/*end of buttons */}

            {/* 컨펌 모달 */}
            {isConfirmModalOpen &&
                <ConfirmModal
                    title={confirmModalTitle}
                    onConfirm={confirmModalOnConfirm}
                    onClose={confirmModalOnCancel}
            />}

            {/*  미니 모달 */}
            <MiniAlert
                isVisible={isMiniModalOpen}
                onClose={miniModalOnClose}
            />



        </div>
    );
};

export default ExchangeEditPage;