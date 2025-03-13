import {useSelector} from "react-redux";
import {useFileUpload, useRegionCategories, useTalentCategories} from "./exchangeCreatePageLogic.js";
import React, {useEffect, useRef, useState} from "react";
import styles from "./ExchangeCreatePage.module.scss";
import {Form} from "react-router-dom";
import ImageUploadSection from "../components/ExchangeCreatePage/ImageUploadSection.jsx";
import AlertModal from "../components/common/AlertModal.jsx";
import FileListDisplay from "../components/ExchangeCreatePage/FileListDisplay.jsx";

const ExchangeCreatePage = () => {

    const [showAlertModal, setShowAlertModal] = useState(false);

    // Redux에서 카테고리 값 가져오기
    const talentCategories = useSelector((state) => state.talentCategory.talentCategories);
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);

    // 커스텀 훅들 사용
    const { sortedTalentCategories, talentToGiveSubCategories, talentToReceiveSubCategories, handleTalentToGiveMainCategoryChange, handleTalentToReceiveMainCategoryChange } = useTalentCategories(talentCategories);
    const { sortedRegionCategories, regionMiddleCategories, regionLastCategories, handleRegionMainCategoryChange, handleRegionMiddleCategoryChange } = useRegionCategories(regionCategories);
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, handleFileDelete:handleDelete } = useFileUpload();
    const handleFileDelete = handleDelete();

    // 값 가져오기 위해, ref 만들어서 자식 컴포넌트에 내려 줌
    const fileInputRef = useRef();
    const titleInputRef = useRef();
    const contentInputRef = useRef();

    // useEffect를 사용하여 fileUploadErrorMessage 값이 변경될 때마다 모달 띄우기
    useEffect(() => {
        console.log("fileUploadErrorMessage: ", fileUploadErrorMessage);
        if (fileUploadErrorMessage) {
            setShowAlertModal(true);
        } else {
            setShowAlertModal(false);
        }
    }, [fileUploadErrorMessage]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.subWrapper}>
                {/* 파일 업로드 시 검사에서 실패할 경우, 모달 띄우기*/}
                {/* fileUploadErorMessage은 useState로 상태관리 되며, validateFiles() 함수 호출 값이 valid:false를 반환할 경우 상태값 변경됨*/}
                {fileUploadErrorMessage && showAlertModal && (
                    <AlertModal
                        title='사진 첨부 오류'
                        message={fileUploadErrorMessage}
                        onClose={() => setShowAlertModal(false)}
                    />
                )}

                <Form>
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

                    {/* 제목 입력 */}
                    {/* <TitleInputSection label="제목" placeholder="제목을 입력하세요" ref={titleInputRef} id="title" /> */}
                    {/* 지역 선택 */}
                    {/* <RegionSelectSection */}
                    {/*   sortedRegionCategories={sortedRegionCategories} */}
                    {/*   regionMiddleCategories={regionMiddleCategories} */}
                    {/*   regionLastCategories={regionLastCategories} */}
                    {/*   handleRegionMainCategoryChange={handleRegionMainCategoryChange} */}
                    {/*   handleRegionMiddleCategoryChange={handleRegionMiddleCategoryChange} */}
                    {/* /> */}
                    {/* 재능 선택 */}
                    {/* <TalentSelectSection */}
                    {/*   label="내가 줄 재능" */}
                    {/*   sortedTalentCategories={sortedTalentCategories} */}
                    {/*   talentSubCategories={talentToGiveSubCategories} */}
                    {/*   handleTalentCategoryChange={handleTalentToGiveMainCategoryChange} */}
                    {/* /> */}
                    {/* 받을 재능 */}
                    {/* <TalentSelectSection */}
                    {/*   label="내가 받을 재능" */}
                    {/*   sortedTalentCategories={sortedTalentCategories} */}
                    {/*   talentSubCategories={talentToReceiveSubCategories} */}
                    {/*   handleTalentCategoryChange={handleTalentToReceiveMainCategoryChange} */}
                    {/* /> */}
                    {/* 내용 입력 */}
                    {/* <ContentInputSection */}
                    {/*   placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요" */}
                    {/*   ref={contentInputRef} */}
                    {/*   name="content" */}
                    {/*   id="content" */}
                    {/* /> */}
                    {/* 제출 버튼 */}
                    {/* <SubmitButton */}
                    {/*   text="재능교환 등록하기" */}
                    {/*   theme="blackTheme" */}
                    {/*   fontSize="medium" */}
                    {/*   width="100%" */}
                    {/*   className="fill" */}
                    {/* /> */}
                </Form>
            </div>
        </div>
    );
};

export default ExchangeCreatePage;