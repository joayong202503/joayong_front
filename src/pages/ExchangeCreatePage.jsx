import {useSelector} from "react-redux";
import {useRegionCategories} from "../hooks/exchangesCreatePageHook/regionHooks.js";
import React, {useContext, useEffect, useRef, useState} from "react";
import styles from "./ExchangeCreatePage.module.scss";
import {Form, UNSAFE_LocationContext, useNavigate} from "react-router-dom";
import ImageUploadSection from "../components/ExchangeCreatePage/ImageUploadSection.jsx";
import AlertModal from "../components/common/AlertModal.jsx";
import FileListDisplay from "../components/ExchangeCreatePage/FileListDisplay.jsx";
import TitleInputSection from "../components/ExchangeCreatePage/TitleInputSection.jsx";
import RegionSelectSection from "../components/ExchangeCreatePage/RegionSelectSection.jsx";
import TalentSelectSection from "../components/ExchangeCreatePage/TalentSelectSection.jsx";
import ContentInputSection from "../components/ExchangeCreatePage/ContentInputSecition.jsx";
import SubmitButton from "../components/ExchangeCreatePage/SubmitButton.jsx";
import {useTalentCategories} from "../hooks/exchangesCreatePageHook/talentHooks.js";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";
import {authApi, postApi} from "../services/api.js";
import fetchWithAuth from "../services/fetchWithAuth.js";
import fetchWithUs from "../services/fetchWithAuth.js";
import {useLocation} from "../context/LocationContext.jsx";

const ExchangeCreatePage = () => {

    // LocationContext 가져오기
    const { latitude, longitude, message,loading }  = useLocation();

    const navigate = useNavigate();

    // 모달 상태관리
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Redux에서 카테고리 값 가져오기
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);

    // 커스텀 훅들 사용
    const { sortedTalentCategories, talentToGiveSubCategories, talentToReceiveSubCategories,
        handleTalentToGiveMainCategoryChange, handleTalentToReceiveMainCategoryChange, handleTalentToGiveSubCategoryChange,
        handleTalentToReceiveSubCategoryChange, selectedTalentToReceiveSubCategory, selectedTalentToGiveSubCategory } = useTalentCategories(talentCategories);
    const { sortedRegionCategories, regionMiddleCategories, regionLastCategories, selectedRegionLastCategory,
        handleRegionMainCategoryChange, handleRegionMiddleCategoryChange, handleRegionLastCategoryChange } = useRegionCategories(regionCategories);
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, handleFileDelete:handleDelete } = useFileUpload();
    const handleFileDelete = handleDelete();

    // 값 가져오기 위해, ref 만들어서 자식 컴포넌트에 내려 줌
    const fileInputRef = useRef();
    const titleInputRef = useRef();
    const contentInputRef = useRef();
    const submitButtonRef = useRef();

    // 파일 업로드 오류 메시지가 변경될 때마다 모달 표시
    useEffect(() => {
        if (fileUploadErrorMessage) {
            setShowAlertModal(true);
            setAlertMessage({ message: "데이터를 확인하세요", title: fileUploadErrorMessage });
        }
    }, [fileUploadErrorMessage]); // fileUploadErrorMessage 값이 변경될 때마다 실행

    // 값 가져오기 위해, ref 만들어서 자식 컴포넌트에 내려 줌

    // Tab 키가 눌렸을 때 제출 버튼으로 포커스를 이동
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            console.log(submitButtonRef.current);
            submitButtonRef.current.focus();
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

        // 테스트용
        // console.log(selectedTalentToReceiveSubCategory);
        // console.log(selectedTalentToGiveSubCategory);
        // console.log(selectedRegionLastCategory);

        // - formdata에 데이터 집어넣기
        //   :  이미지의 경우,  formData.append(fetch 할 때의 key 이름, file)
        //   :  json의 경우, formData.append(fetch 할 때 보낼 key 이름, new Blob([JSON.stringify(data)], {data type} )'
        formData.append('post',
            new Blob([JSON.stringify(post)],
            { type: 'application/json' }));

        // uploadedFile(상태값으로 관리)가 존재하고 배열인 경우에만 append
        appendUploadedFileToFormData(uploadedFile, formData);

        // 테스트용
        // console.log(uploadedFile);
        return formData;
    }

    const validateFormData = (post) => {

        console.log(post);

        // 1) 타이틀 공백 체크
        const title = post.title;
        if (!title || !title.trim()) {
            setShowAlertModal(true);
            setAlertMessage({message: "데이터를 확인해주세요", title: "제목을 입력해 주세요."});
            return false;
        }

        // 2) 내용 공백 체크
        const content = post.content;
        if (!content || !content.trim()) {
            setShowAlertModal(true);
            setAlertMessage({message: "데이터를 확인해주세요", title: "내용을 입력해 주세요."});
            return false;
        }

        // 3) 지역 공백 체크
        const regionId = post["region-id"];
        if (!regionId || isNaN(regionId)) {
            setShowAlertModal(true);
            setAlertMessage({message: "데이터를 확인해주세요", title: "지역을 선택해 주세요."});
            return false;
        }

        // 4) 줄 재능 null 체크
        const talentToGiveId = post["talent-g-id"];
        if (!talentToGiveId || isNaN(talentToGiveId)) {
            setShowAlertModal(true);
            setAlertMessage({message: "데이터를 확인해주세요", title: "줄 수 있는 재능을 입력해 주세요."});
            return false;
        }

        // 5) 받을 재능 null 체크
        const talentToReceiveId = post["talent-t-id"];
        if (!talentToReceiveId || isNaN(talentToReceiveId)) {
            setShowAlertModal(true);
            setAlertMessage({message: "데이터를 확인해주세요", title:"받고자 하는 재능을 선택해주세요"});
            return false;
        }

        // 모든 값이 유효하면 true 반환
        return true;
    }

    const preparePostFormOfFormData = () => {
        const nonFileData = {
            title: titleInputRef.current.value,
            content: contentInputRef.current.value,
            "talent-g-id": selectedTalentToGiveSubCategory.id,
            "talent-t-id": selectedTalentToReceiveSubCategory.id,
            "region-id": selectedRegionLastCategory.id
        };
        return nonFileData;
    }

    // 제출할 때 로직
    const handleSubmit = async (e) => {

        e.preventDefault();
        const post = preparePostFormOfFormData();

        // 데이터 검증
        const isValidateData = validateFormData(post);
        if (!isValidateData) return;

        // 데이터 성공 성공 시 formdata 준비하여 fetch
        const payload = getFormData(post, uploadedFile);
        const response = await fetchWithUs(postApi.newPost, {
            method: 'POST',
            // headers의 content-type은 알아서 multipart file로 전송됨
            body: payload
        });

        // 성공 : 모달 뜬 후 이전 페이지로 이동
        if (response.ok) {
            setShowSuccessModal(true);
        } else {
            // 400대, 500대 에러 처리
            if (response.status >= 500) {
                // 서버 내부 오류
                setShowAlertModal(true);
                setAlertMessage({
                    title: "서버 내부 문제",
                    message: "서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
                });
            } else if (response.status >= 400 && response.status < 500) {
                // 클라이언트 오류 (400번대)
                const errorData = await response.json(); // 응답으로 받은 에러 메시지를 뿌림
                // 서버에서 message가 없다면 기본 메시지 사용
                const errorMessage = errorData.message || "요청에 문제가 있습니다. 다시 시도해주세요.";

                setShowAlertModal(true);
                setAlertMessage({
                    title: "요청 오류",
                    message: errorMessage
                });
            }
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.subWrapper}>
                {/* 게시글 등록 실패할 경우, 모달 띄우기*/}
                {showAlertModal && (
                    <AlertModal
                        title={alertMessage.title}
                        message={alertMessage.message}
                        onClose={() => {
                            setShowAlertModal(false);
                            setAlertMessage(null);
                        }}
                    />
                )}

                {/* 게시글 등록 성공할 경우, 모달 띄우기*/}
                {showSuccessModal && (
                    <AlertModal
                        title={"게시글이 등록되었습니다."}
                        message={"이전 페이지로 이동합니다."}
                        onClose={() => {
                            setShowSuccessModal(false);
                            navigate(-1);  // 2초 후 이전 페이지로 이동
                        }}
                    />
                )}

                <Form
                    method={'post'}
                    onSubmit={handleSubmit}>
                    {/*formData값 확인용*/}
                    {/* 이미지 업로드 하는 부분 */}
                    <ImageUploadSection
                        ref={fileInputRef}
                        onFileSelect={handleFileSelect}
                    />

                    {/* 파일 이름 목록을 표시하는 컴포넌트 */}
                    <FileListDisplay uploadedFiles={uploadedFile} />
                    <FileListDisplay
                        uploadedFile={uploadedFile}
                         // 파일 딜리트 하는 함수
                        onDelete={handleFileDelete}
                    />

                     {/*제목 입력 */}
                     <TitleInputSection
                         label="제목"
                         placeholder="제목을 입력하세요"
                         ref={titleInputRef}
                         id="title"
                     />
                     {/*지역 선택*/}
                     <RegionSelectSection
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
                       onKeyDown={handleKeyDown}
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
                     />
                </Form>
            </div>
        </div>
    );
};

export default ExchangeCreatePage;