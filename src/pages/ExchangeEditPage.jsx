
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
import {useQueryClient} from "@tanstack/react-query";
import AdvancedImageUpload from "../components/common/imagesAndFiles/AdvancedImageUpload.jsx";
import ImageCarouselWithThumbNail from "../components/common/imagesAndFiles/ImageCarouselWithThumbNail.jsx";
import * as ReactDom from "react-dom";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";
import {useImageHandling} from "../hooks/exchangeEditPageHooks/useImageHandling.js";

const ExchangeEditPage = () => {

    // 페이지 처음 진입 시 최상단으로 스크롤 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const queryClient = useQueryClient();
    const { exchangeId: postId } = useParams();
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name);
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const sortedTalentCategories = useMemo(() => getSortedTalentCategories(talentCategories), [talentCategories]);

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

    // yup 유효성 검증 훅
    const { validationSchema } = useValidation();

    // 파일을 업로드 검증 훅
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, setUploadedFile, setFileUploadErrorMessage } = useFileUpload();

    // 이미지 삭제 관련 훅
    const { handleFileDelete } = useImageHandling(
        updatePostData,
        postData
    );

    // 이전 사진 삭제인 경우 전체 삭제, 아니면 선택 사진만 삭제
    const handleImageDelete = (selectedImageIndex) => {
        if (!(postData.images[selectedImageIndex] instanceof File)) {
            showConfirmModal({
                title: '게시물의 일관성을 위해 게시글 기존 사진은 전체 삭제만 가능합니다. 모든 사진을 삭제하시겠습니까?',
                onConfirm: () => {
                    handleFileDelete(selectedImageIndex);
                    setIsConfirmModalOpen(false);
                }
            });
        } else {
            handleFileDelete(selectedImageIndex);
        }
    };

    // 파일 업로드 성공 시 postData 업데이트
    useEffect(() => {
        if (uploadedFile) {
            updatePostData('update-image', true);
            updatePostData('images', uploadedFile);
        }
    }, [uploadedFile]);

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

    // 이미지 캐러셀 모달 상태
    const [isImageCarouselModalOpen, setIsImageCarouselModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 이미지 모달 열려 있는 동안은 스크롤 불가
    useEffect(() => {
        if (isImageCarouselModalOpen) {
            document.body.style.overflow = "hidden"; // 스크롤 방지
        } else {
            document.body.style.overflow = ""; // 원래 상태로 복구
        }
        return () => {
            document.body.style.overflow = ""; // 컴포넌트 언마운트 시 복구
        };
    }, [isImageCarouselModalOpen]);

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

    // 파일 업로드 유효성 검사 미통과 시 모달
    useEffect(() => {
        if (fileUploadErrorMessage) {
            setIsMiniModalOpen(true);
            setIsNegativeMiniModalMessage(true);
            setMiniModalMessage(fileUploadErrorMessage);
            // 다시 isNegativeMiniModal 값 돌려놓기
            setTimeout(() => {
                setIsNegativeMiniModalMessage(false);
            }, 2000);
        }
    }, [fileUploadErrorMessage]);

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
            updatePostData('images', data.images);

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

    console.log('서버에 보낼 내용:', postData);

    // 컨펌 모달
    const showConfirmModal = ({ title, message, onConfirm, onCancel }) => {
        setIsConfirmModalOpen(true);
        setConfirmModalTitle(title);
        setConfirmModalOnConfirm(() => onConfirm);
        setConfirmModalOnCancel(onCancel);
    };

    // 폼 데이터로 변환
    const transformToFormData = (postData) => {

        const formData = new FormData();

        // postData.images는 서버에 보낼 용도가 아니라 image carousel 용이므로, 삐고 formData 생성
        const newPostData = {...postData};
        delete newPostData.images;

        formData.append('post',
            new Blob([JSON.stringify(newPostData)],
                { type: 'application/json' }));

        // postData.images가 null이 아닌 경우, 사진을 새로 보내는 것이므로
        // 서버에 보낼 update-image 값을 true로 갱신하고 파일을 append
        if (postData.images && Array.isArray(postData.images)) {
            newPostData['update-image'] = true;
            postData.images.forEach(image => {
                formData.append('images', image);
            });
        }
        return formData;
    };

    // 미니 모달 표시 헬퍼 함수
    const showMiniModalWithTimeout = (message, isNegative = false) => {
        setIsMiniModalOpen(true);
        setMiniModalMessage(message);
        setIsNegativeMiniModalMessage(isNegative);

        setTimeout(() => {
            setIsMiniModalOpen(false);
            if (isNegative) {
                setTimeout(() => {
                    setIsNegativeMiniModalMessage(false);
                    setMiniModalMessage("정상적으로 처리되었습니다.");
                }, 2010);
            }
        }, 2000);
    };

    // 수정 성공 시 처리
    const handleModificationSuccess = () => {
        setIsConfirmModalOpen(false);
        showMiniModalWithTimeout('게시글이 정상적으로 수정되었습니다.');

        setTimeout(() => {
            navigate(`/exchanges/${postId}`);
        }, 1000);
    };

    // 수정 실패 시 처리
    const handleModificationError = (error) => {
        setIsConfirmModalOpen(false);
        showMiniModalWithTimeout(error.message || error.errors[0], true);
    };

    // 게시글 수정
    const handlePostModification = async () => {
        try {
            await validationSchema.validate(postData, { abortEarly: true });
            const formData = transformToFormData(postData);
            await updatePost(formData);
            queryClient.invalidateQueries(['postDetail', postId]);
            handleModificationSuccess();
        } catch (error) {
            handleModificationError(error);
        }
    };

    return (
        <>
            <div className={styles.postEditPage}>

                {/* 사진 : fetc가 되고나면 실행 */}
                { postData &&
                    <div className={styles.imageSection}>
                        <AdvancedImageUpload
                            images={postData?.images || []}
                            maxLength={5}
                            description={['게시물의 일관성을 위해, 사진은 전체 변경 또는 유지만 가능해요.', '사진에 마우스를 올려 확대/취소 할 수 있어요.']}
                            onFileDelete={handleImageDelete}
                            onEnlargePhoto={(index) => {  // index 받아서 처리
                                setCurrentImageIndex(index);
                                setIsImageCarouselModalOpen(true);
                            }}
                            isAllOrNone={true} // 사진 전체 수정만 가능
                            onFileSelect={handleFileSelect}
                        />
                    </div>
                }

                <TitleInputSection
                    label="제목"
                    placeholder="제목을 입력하세요"
                    ref={refs.title}
                    id="title"
                    maxLength={50}
                    defaultValue={postData.title}
                    onChange={(e) => updatePostData('title', e.target.value)}
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
                    onChange={(e) => updatePostData('content', e.target.value)}
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
                            onCancel: () => () => {
                                setIsConfirmModalOpen(false)
                            }
                        })}
                    > 수정하기
                    </Button>
                </div>
                {/*end of buttons */}

                {/* 컨펌 모달 */}
                {isConfirmModalOpen &&
                    <ConfirmModal
                        title={confirmModalTitle}
                        onConfirm={confirmModalOnConfirm}
                        onClose={confirmModalOnCancel}
                    />}

                {/*  미니 모달 */}
                {isMiniModalOpen &&
                    <MiniAlert
                        isVisible={isMiniModalOpen}
                        onClose={() => {
                            setIsMiniModalOpen(false)
                            setIsMiniModalOpen(false)
                        }}
                        message={miniModalMessage}
                        isNegative={isNegativeMiniModalMessage}
                    />
                }
            </div>

            {/*이미지 확대 버튼 누르면 이미지 캐러셀이 모달에서 보이게 함 */}
            {isImageCarouselModalOpen &&
                ReactDom.createPortal(
                <div className={styles.modalOverlay}
                     onClick={(e) => {
                         e.stopPropagation();
                         setIsImageCarouselModalOpen(false);
                     }}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsImageCarouselModalOpen(false);
                        }} // 모달 컨텐츠 클릭 시 이벤트 전파 중단
                    >
                        {/* 모달 내용 */}
                        <button
                            className={styles.closeButton}
                            onClick={() => setIsImageCarouselModalOpen(false)}
                        >
                            X
                        </button>
                        <ImageCarouselWithThumbNail
                            imagesObject={postData.images}
                            width="80%"
                            height="80%"
                            initialIndex={currentImageIndex || 0}
                            isOpenModal={isImageCarouselModalOpen}
                            setIsOpenModal={setIsImageCarouselModalOpen}
                        />
                    </div>
                </div>,
                document.body // 정확히 DOM 요소를 지정
                )
            }


        </>
    );
};

export default ExchangeEditPage;