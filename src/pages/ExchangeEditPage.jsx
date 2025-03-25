import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TitleInputSection from "../components/ExchangeCreatePage/TitleInputSection";
import DropDownBasic from '../components/common/DropDownBasic';
import ContentInputSection from '../components/ExchangeCreatePage/ContentInputSecition';
import {fetchPostDetail, updatePost} from '../services/postService.js';
import styles from './ExchangeEditPage.module.scss';
import {
    getRegionDetailsObjectBySubId,
    getSortedTalentCategories,
    getTalentCategoryDetailsObject
} from "../utils/sortAndGetCategories.js";
import Button from "../components/common/Button.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";
import { usePostData } from '../hooks/exchangeEditPageHooks/usePostData.js';
import { useCategoryState } from '../hooks/exchangeEditPageHooks/useCategoryState.js';
import { useAutoFocus } from '../hooks/exchangeEditPageHooks/useAutoFocus.js';
import { useValidation } from '../hooks/exchangeEditPageHooks/useValidation.js';

const ExchangeEditPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지의 최상단으로 이동
    }, []);

    const { exchangeId: postId } = useParams();
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name);

    // 서버에서 가져온 데이터
    const [originalPost, setOriginalPost] = useState(null);

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

    // 서버에 제출할 데이터 관리 훅
    const { postData, updatePostData } = usePostData();

    // yup 유효성 검증 조건
    const { validationSchema } = useValidation();

    // 필터링용 카테고리 관리 훅
    const { categoryState, setCategoryState, handleCategoryChange: handleCategoryStateChange } = useCategoryState(updatePostData);

    // 자동 포커스 관리 훅
    const { handleAutoFocus } = useAutoFocus(refs);

    // 컨펌 모달 상태
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState('');
    const [confirmModalOnConfirm, setConfirmModalOnConfirm] = useState(() => () => {});
    const [confirmModalOnCancel, setConfirmModalOnCancel] = useState(() => () => {});

    // 미니 모달 상태
    const [isMiniModalOpen, setIsMiniModalOpen] = useState(false);
    const [miniModalMessage, setMiniModalMessage] = useState('');
    const [isNegativeMiniModalMessage, setIsNegativeMiniModalMessage] = useState(false);

    // Selectors
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const sortedTalentCategories = useMemo(() => getSortedTalentCategories(talentCategories), [talentCategories]);

    // 드롭다운 값 변경 시 카테고리 상태 업데이트 및 자동 포커스
    const handleCategoryChange = (type, level) => (selectedItem) => {
        if (!selectedItem) return;

        handleCategoryStateChange(type, level)(selectedItem);
        handleAutoFocus(type, level);
    };

    //필터링 시 소분류 값 다르게 보여주는 용으로 관리하는 CategoryState의 초기 값 설정
    const initializeCategories = useCallback((data) => {
        const regionDetails = getRegionDetailsObjectBySubId(data['region-id'], regionCategories);
        const giveDetails = getTalentCategoryDetailsObject(data['talent-g-id'], talentCategories);
        const takeDetails = getTalentCategoryDetailsObject(data['talent-t-id'], talentCategories);

        setCategoryState({
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
        });
    }, [regionCategories, talentCategories, setCategoryState]);

    // 게시글 상세정보 가져오기
    const fetchPostDetails = useCallback(async () => {
        try {
            const response = await fetchPostDetail(postId);
            const data = await response.json();

            setOriginalPost(data);

            // 서버에서 받은 데이터로 postData 업데이트
            updatePostData('title', data.title);
            updatePostData('content', data.content);
            updatePostData('region-id', data['region-id']);
            updatePostData('talent-g-id', data['talent-g-id']);
            updatePostData('talent-t-id', data['talent-t-id']);
            updatePostData('post-id', data['post-id']);

            // 필터링용 카테고리 초기화
            initializeCategories(data);
        } catch (error) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    status: error.status,
                    message: error.message,
                }
            });
        }
    }, [postId, updatePostData, initializeCategories, navigate]);

    // 내 게시글 아니면 접근 다시 한 번 이중 차단
    useEffect(() => {
        if (originalPost && originalPost.name !== myUsername) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    message: "내 게시글만 수정 가능합니다."
                }
            });
        }
    }, [originalPost, myUsername, navigate]);

    // 게시글 상세정보 가져오기
    useEffect(() => {
        fetchPostDetails();

        // 제목란에 focus하기
        if (refs.title.current) {
            refs.title.current.focus();
        }
    }, [postId]);

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

    // 게시글 수정
    const handlePostModification = async () => {
        try {
            // 유효성 검증
            console.log('보낼 내용');
            console.log(postData);
            console.log('보낼 내용');
            await validationSchema.validate(postData, { abortEarly: true });

            // 폼 데이터로 변환
            const transformToFormData = (postData) => {
                // - formdata에 데이터 집어넣기
                //   :  이미지의 경우,  formData.append(fetch 할 때의 key 이름, file)
                //   :  json의 경우, formData.append(fetch 할 때 보낼 key 이름, new Blob([JSON.stringify(data)], {data type} )'
                const formData = new FormData();
                formData.append('post',
                    new Blob([JSON.stringify(postData)],
                        { type: 'application/json' }));

                return formData;
            };

            const formData = transformToFormData(postData);

            await updatePost(formData);  // updatePost에서 이미 에러 처리함

            setIsConfirmModalOpen(false);
            setIsMiniModalOpen(true);
            setMiniModalMessage('게시글이 정상적으로 수정되었습니다.');

            // 2초 후 상세 페이지로 이동
            setTimeout(() => {
                navigate(`/exchanges/${postId}`);
            }, 2000);
        } catch (error) {
            setIsConfirmModalOpen(false);
            setIsMiniModalOpen(true);
            setIsNegativeMiniModalMessage(true);

            // ApiError인 경우 message 사용, validation 에러인 경우 errors 배열 사용
            setMiniModalMessage(error.message || error.errors[0]);

            // 2초 후 미니 모달 닫기
            setTimeout(() => {
                setIsMiniModalOpen(false);
                setTimeout(() => {
                    setIsNegativeMiniModalMessage(false);
                    setMiniModalMessage("정상적으로 처리되었습니다.");
                }, 2010);
            }, 2000);
        }
    };

    return (
        <div className={styles.postEditPage}>
            <TitleInputSection
                label="제목"
                placeholder="제목을 입력하세요"
                ref={refs.title}
                id="title"
                maxLength={50}
                defaultValue={postData.title}
            />

            {/* 지역 선택 섹션 */}
            <div className={`${styles.locationSection} ${styles.contentBox}`}>
                <span className={styles.title}>여기서 만날 수 있어요</span>
                <div className={styles.locationContainer}>
                    <DropDownBasic
                        options={regionCategories}
                        defaultOption={categoryState?.region?.main}
                        onChange={handleCategoryChange('region', 'main')}
                        selectedOption={categoryState.region.main}
                        width={150}
                        placeholder={'대분류'}
                    />
                    <DropDownBasic
                        options={categoryState?.region?.main?.subRegionList || []}
                        defaultOption={categoryState?.region?.middle}
                        onChange={handleCategoryChange('region', 'middle')}
                        selectedOption={categoryState?.region?.middle}
                        width={150}
                        ref={refs.secondRegion}
                        disabled={!categoryState?.region?.main}
                        placeholder={'중분류'}
                    />
                    <DropDownBasic
                        options={categoryState?.region?.middle?.detailRegionList || []}
                        defaultOption={categoryState?.region?.last}
                        onChange={handleCategoryChange('region', 'last')}
                        selectedOption={categoryState?.region?.last}
                        width={150}
                        ref={refs.thirdRegion}
                        disabled={!categoryState?.region?.middle}
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
                            defaultOption={categoryState?.talent?.give?.main}
                            onChange={handleCategoryChange('talent', 'give-main')}
                            selectedOption={categoryState?.talent?.give?.main}
                            width={150}
                            placeholder={'대분류'}
                        />
                        <DropDownBasic
                            ref={refs.talentGiveSub}
                            options={categoryState?.talent?.give.main?.subTalentList || []}
                            defaultOption={categoryState?.talent?.give?.sub}
                            onChange={handleCategoryChange('talent', 'give-sub')}
                            selectedOption={categoryState?.talent?.give?.sub}
                            width={150}
                            placeholder={'소분류'}
                            disabled={!categoryState?.talent?.give?.main}
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
                            defaultOption={categoryState?.talent?.take?.main}
                            onChange={handleCategoryChange('talent', 'take-main')}
                            selectedOption={categoryState?.talent?.take?.main}
                            width={150}
                            placeholder={'대분류'}
                        />
                        <DropDownBasic
                            ref={refs.talentTakeSub}
                            options={categoryState?.talent?.take?.main?.subTalentList || []}
                            defaultOption={categoryState?.talent?.take?.sub}
                            onChange={handleCategoryChange('talent', 'take-sub')}
                            selectedOption={categoryState?.talent?.take?.sub}
                            width={150}
                            placeholder={'소분류'}
                            disabled={!categoryState?.talent?.take?.main}
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
                defaultValue={postData.content}
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
                            navigate(-1);
                        },
                        onCancel: () => () => setIsConfirmModalOpen(false)
                    })}
                > 취소하기</Button>
                <Button
                    theme={'blueTheme'}
                    fontSize={'small'}
                    onClick={() => showConfirmModal({
                        title: '게시글을 수정하시겠습니까?',
                        onConfirm: () => handlePostModification,
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
            { isMiniModalOpen &&
                <MiniAlert
                    isVisible={isMiniModalOpen}
                    onClose={() => {setIsMiniModalOpen(false)}}
                    message={miniModalMessage}
                    isNegative={isNegativeMiniModalMessage}
                />
            }
        </div>


    );
};

export default ExchangeEditPage;