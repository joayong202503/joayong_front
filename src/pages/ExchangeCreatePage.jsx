import {useSelector} from "react-redux";
import {useRegionCategories} from "../hooks/exchangesCreatePageHook/regionHooks.js";
import React, {useEffect, useRef, useState} from "react";
import styles from "./ExchangeCreatePage.module.scss";
import {Form, useNavigate} from "react-router-dom";
import ImageUploadSection from "../components/common/imagesAndFiles/ImageUploadSection.jsx";
import AlertModal from "../components/common/AlertModal.jsx";
import FileListDisplay from "../components/common/imagesAndFiles/FileListDisplay.jsx";
import TitleInputSection from "../components/ExchangeCreatePage/TitleInputSection.jsx";
import RegionSelectSection from "../components/common/categories/RegionSelectSection.jsx";
import TalentSelectSection from "../components/common/categories/TalentSelectSection.jsx";
import ContentInputSection from "../components/ExchangeCreatePage/ContentInputSecition.jsx";
import SubmitButton from "../components/ExchangeCreatePage/SubmitButton.jsx";
import {useTalentCategories} from "../hooks/exchangesCreatePageHook/talentHooks.js";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";
import {postApi} from "../services/api.js";
import fetchWithUs from "../services/fetchWithAuth.js";
import {useLocation} from "../context/LocationContext.jsx";
import {getAddressByCoords} from "../utils/reverseGeoCoding.js";
import MiniAlert from "../components/common/MiniAlert.jsx";
import AdvancedImageUpload from "../components/common/imagesAndFiles/AdvancedImageUpload.jsx";
import ImageCarouselWithThumbNail from "../components/common/imagesAndFiles/ImageCarouselWithThumbNail.jsx";
import * as ReactDom from "react-dom";

const ExchangeCreatePage = () => {

    // LocationContext 가져온 후, 주소를 위도+경도에서 도로명 주소로 변환해주기
    const { latitude, longitude }  = useLocation();
    const [ userAddress, setUserAddress ] = useState();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageCarouselModalOpen, setIsImageCarouselModalOpen] = useState(false);

    useEffect(() => {
        const getAddressByApi = async () => {
            const fetchAddress = await getAddressByCoords(latitude, longitude);
            setUserAddress(fetchAddress);
        };
        getAddressByApi();
    }, [latitude,longitude]);

    const navigate = useNavigate();

    // 제출 버튼 누른 후 서버 응답 올때까지 다시 제출 못하도록
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 모달 상태관리
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const timeoutRef = useRef(null); // 타이머 ID 저장

    // 모달 직접 닫았을 떄 모달 닫을 떄 로직이 두 번 작동하는 것을 방지 하기 위한 상태값
    const [isNavigating, setIsNavigating] = useState(false);

    // 페이지 이동(모달을 직접 닫을 경우, isNavigating이 true로 되어서 중복 이동 방지)
    const handleNavigation = () => {
        if (!isNavigating) {
            setIsNavigating(true);
            setShowSuccessModal(false);
            navigate('/exchanges');
        }
    };

    // Redux에서 카테고리 값 가져오기
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);

    // 커스텀 훅들 사용
    const { sortedTalentCategories, talentToGiveSubCategories, talentToReceiveSubCategories,
        handleTalentToGiveMainCategoryChange, handleTalentToReceiveMainCategoryChange, handleTalentToGiveSubCategoryChange,
        handleTalentToReceiveSubCategoryChange, selectedTalentToReceiveSubCategory, selectedTalentToGiveSubCategory } = useTalentCategories(talentCategories);
    const { sortedRegionCategories, regionMiddleCategories, regionLastCategories, selectedRegionLastCategory,
        handleRegionMainCategoryChange, handleRegionMiddleCategoryChange, handleRegionLastCategoryChange } = useRegionCategories(regionCategories);
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, setUploadedFile, setFileUploadErrorMessage } = useFileUpload();

    // 값 가져오기 위해, ref 만들어서 자식 컴포넌트에 내려 줌
    const fileInputRef = useRef();
    const titleInputRef = useRef();
    const contentInputRef = useRef();
    const submitButtonRef = useRef();

    // 파일 업로드 오류 메시지가 변경될 때마다 모달 표시
    useEffect(() => {
        if (!fileUploadErrorMessage) return;
        handleAlertModal(fileUploadErrorMessage);
    }, [fileUploadErrorMessage]);

    // 모달 띄우기
    const handleAlertModal = (message) => {
        console.log('handleAlertModal called with message:', message);

        // 기존 타이머가 실행 중이라면 취소
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // 모달 열기 및 메시지 설정
        setAlertMessage(message);
        setShowAlertModal(true);

        // 1.5초 후 모달 자동 닫기
        timeoutRef.current = setTimeout(() => {
            setShowAlertModal(false);
            timeoutRef.current = null; // 타이머 초기화
        }, 1500);
    };

    // 엔터키로 폼 제출되는 것을 막음
    const handleEnterKeyDown = (e) => {

        // enter키의 작동을 막을 건데, 그치만 textarea에 있을 때는 enter키가 정상적으로 작동해야 줄 띄우기가 가능,
        if (e.target === contentInputRef.current) return;

        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // 이미지가 있을 시에면 formData에 append
    const appendUploadedFileToFormData = (uploadedFile, formData) => {
        if (Array.isArray(uploadedFile) && uploadedFile.length > 0) {
            uploadedFile.forEach(image => formData.append('images', image));
        } else {
            console.log('uploadedFile is not an array or is null/undefined');
        }
    }

    // formdata로 데이터 전송하기 위해, FORMDATA 객체 생성
    const getFormData = (post, uploadedFile) => {

        const formData = new FormData();
        // - 파일(사진)과 나머지 이렇게 크게 2개로 나누고, 각 부분에 대해서 나눠서 보냄

        // - formdata에 데이터 집어넣기
        //   :  이미지의 경우,  formData.append(fetch 할 때의 key 이름, file)
        //   :  json의 경우, formData.append(fetch 할 때 보낼 key 이름, new Blob([JSON.stringify(data)], {data type} )'
        formData.append('post',
            new Blob([JSON.stringify(post)],
                { type: 'application/json' }));

        // uploadedFile(상태값으로 관리)가 존재하고 배열인 경우에만 append
        appendUploadedFileToFormData(uploadedFile, formData);

        // 테스트용
        console.log(post.content.length);
        return formData;
    }

    const validateFormData = (post) => {
        console.log('=== Validation Debug ===');
        console.log('validateFormData called with:', post);
        
        // 기존 검증 로직
        if (!post.title || !post.title.trim()) {
            console.log('Title validation failed');
            handleAlertModal("제목을 입력해주세요");
            return false;
        }

        // 2) 내용 공백 체크
        const content = post.content;
        if (!content || !content.trim()) {
            handleAlertModal("내용을 입력해주세요");
            return false;
        }

        // 3) 지역 공백 체크
        const regionId = post["region-id"];
        if (!regionId || isNaN(regionId)) {
            handleAlertModal("지역을 입력해주세요");
            return false;
        }

        // 4) 줄 재능 null 체크
        const talentToGiveId = post["talent-g-id"];
        if (!talentToGiveId || isNaN(talentToGiveId)) {
            handleAlertModal("줄 재능을 입력해주세요");
            return false;
        }

        // 5) 받을 재능 null 체크
        const talentToReceiveId = post["talent-t-id"];
        if (!talentToReceiveId || isNaN(talentToReceiveId)) {
            setShowAlertModal(true);
            handleAlertModal("받고자 하는 재능을 입력해주세요");
            return false;
        }

        // 모든 값이 유효하면 true 반환
        return true;
    }

    const preparePostFormOfFormData = () => {
        const regionId = selectedRegionLastCategory && selectedRegionLastCategory.id ? selectedRegionLastCategory.id : null;
        const talentGiveId = selectedTalentToGiveSubCategory && selectedTalentToGiveSubCategory.id ? selectedTalentToGiveSubCategory.id : null;
        const talentReceiveId = selectedTalentToReceiveSubCategory && selectedTalentToReceiveSubCategory.id ? selectedTalentToReceiveSubCategory.id : null;

        return {
            title: titleInputRef.current.value,
            content: contentInputRef.current.value,
            "talent-g-id": talentGiveId,
            "talent-t-id": talentReceiveId,
            "region-id": regionId
        };
    }




    // 제출할 때 로직
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        // 버튼 클릭 후 다시 제출 못하도록 비활성화
        setIsSubmitting(true);

        const post = preparePostFormOfFormData();

        // 데이터 검증
        const isValidateData = validateFormData(post);
        if (!isValidateData) {
            // 검증 실패 시 다시 버튼 활성화
            setIsSubmitting(false);
            return;
        }

        // 데이터 성공 시 formdata 준비하여 fetch
        const payload = getFormData(post, uploadedFile);
        const response = await fetchWithUs(postApi.newPost, {
            method: 'POST',
            body: payload
        });

        // 성공 : 모달 뜬 후 이전 페이지로 이동
        if (response.ok) {
            setShowSuccessModal(true);
            setTimeout(() => {
                handleNavigation();  // 통합된 네비게이션 함수 사용
            }, 2000);
        } else {
            // 400대, 500대 에러 처리
            if (response.status === 500) {
                setShowAlertModal(true);
                setAlertMessage({
                    title: "서버 오류",
                    message: "서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                });
            } else if (response.status >= 400 && response.status < 500) {
                const errorData = await response.json();
                const errorMessage = errorData.message || "요청에 문제가 있습니다. 다시 시도해주세요.";

                setShowAlertModal(true);
                setAlertMessage({
                    title: "요청 오류",
                    message: errorMessage
                });
            }
        }

        // 버튼 상태 업데이트
        setIsSubmitting(false);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.subWrapper}>
                {/* 게시글 등록 실패할 경우 */}
                {showAlertModal && (
                    <MiniAlert
                        message={alertMessage}
                        isNegative={true}
                        duration={1500}
                        onClose={() => setShowAlertModal(false)}
                    />
                )}

                {/* 게시글 등록 성공할 경우 */}
                {showSuccessModal && (
                    <MiniAlert
                        message="게시글이 등록되었습니다."
                        isNegative={false}
                        duration={1500}
                        onClose={handleNavigation}
                    />
                )}

                <Form
                    method={'post'}
                    onKeyDown={handleEnterKeyDown}
                    onSubmit={handleSubmit}
                >
                    {/*이미지 업로드 하는 부분*/}
                    <AdvancedImageUpload
                        images={uploadedFile}
                        maxLength={5}
                        description={['능력을 한 눈에 보여줄 사진을 첨부하고, 매칭 확률을 높여보세요.', '사진은 최대 5개 업로드 가능합니다.']}
                        onFileDelete={(index, e) => {
                            // 버튼 클릭이 Form 태그의 submit을 일어키는 것을 방지
                            if (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            }

                            const newFiles = uploadedFile.filter((_, i) => i !== index);
                            setUploadedFile(newFiles);

                            // 파일 입력 필드 초기화
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        onEnlargePhoto={(index) => {
                            setCurrentImageIndex(index);
                            setIsImageCarouselModalOpen(true);
                        }}
                        ref={fileInputRef}
                        isAllOrNone={false}
                        onFileSelect={(e) => handleFileSelect(e, uploadedFile.length + e.target.files.length)}
                    />
                    <div className={styles.gap}></div>

                    {/*제목 입력 */}
                    <TitleInputSection
                        label="제목"
                        placeholder="제목을 입력하세요"
                        ref={titleInputRef}
                        id="title"
                        maxLength={50}
                    />

                    {/*지역 선택*/}
                    <RegionSelectSection
                        userAddress={userAddress}
                        sortedRegionCategories={sortedRegionCategories}
                        regionMiddleCategories={regionMiddleCategories}
                        regionLastCategories={regionLastCategories}
                        handleRegionMainCategoryChange={handleRegionMainCategoryChange}
                        handleRegionMiddleCategoryChange={handleRegionMiddleCategoryChange}
                        handleRegionLastCategoryChange={handleRegionLastCategoryChange}
                    />
                    {/* 재능 선택 */}
                    <TalentSelectSection
                        label='talentToGive'
                        sortedTalentCategories={sortedTalentCategories}
                        talentToGiveSubCategories={talentToGiveSubCategories}
                        talentToReceiveSubCategories={talentToReceiveSubCategories}
                        handleTalentToGiveMainCategoryChange={handleTalentToGiveMainCategoryChange}
                        handleTalentToReceiveMainCategoryChange={handleTalentToReceiveMainCategoryChange}
                        handleTalentToGiveSubCategoryChange={handleTalentToGiveSubCategoryChange}
                        handleTalentToReceiveSubCategoryChange={handleTalentToReceiveSubCategoryChange}
                    />
                    {/* 내용 입력 */}
                    <ContentInputSection
                        placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"
                        ref={contentInputRef}
                        name="content"
                        id="content"
                    />

                    {/*제출 버튼*/}
                    <SubmitButton
                        text="재능교환 등록하기"
                        theme="blackTheme"
                        fontSize="medium"
                        width="100%"
                        className="fill"
                        ref={submitButtonRef}
                        onSubmit={handleSubmit}
                        disabled={isSubmitting}
                    />
                </Form>
            </div>

            {isImageCarouselModalOpen && ReactDom.createPortal(
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
                            imagesObject={uploadedFile}
                            width="80%"
                            height="80%"
                            initialIndex={currentImageIndex || 0}
                            isOpenModal={isImageCarouselModalOpen}
                            setIsOpenModal={setIsImageCarouselModalOpen}
                            setCurrentIndex={setCurrentImageIndex}
                        />
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default ExchangeCreatePage;