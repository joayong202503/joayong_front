import React, {useCallback, useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AlertModal from "../components/common/AlertModal.jsx";
import Categories from "../components/common/Categories.jsx";
import styles from "./ExchangeRequestPage.module.scss";
import {useSelector} from "react-redux";
import {MapPinnedIcon} from "lucide-react";
import ContentInputSection from "../components/ExchangeCreatePage/ContentInputSecition.jsx";
import Button from "../components/common/Button.jsx";
import ImageUploadSection from "../components/ExchangeCreatePage/ImageUploadSection.jsx";
import FileListDisplay from "../components/ExchangeCreatePage/FileListDisplay.jsx";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";

const ExchangeRequestPage = () => {

    // ===== 전역 관리
    const username = useSelector((state) => state.auth.user.name);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { postDetail } = state;
    console.log(postDetail);
    const {postDetail:post} = state;
    const { exchangeId: postId } = useParams();

    //  =========== 모달 상태값
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalOnClose, setModalOnClose] = useState(null);

    // ======== 파일 업로드 상태값
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, setUploadedFile } = useFileUpload();
    const fileInputRef = useRef();

    // 파일 업로드 오류 메시지가 변경될 때마다 모달 표시
    useEffect(() => {
        if (fileUploadErrorMessage) {
            console.log(fileUploadErrorMessage);
            setModalMessage(fileUploadErrorMessage);
            setModalOnClose(() => setModalOpen(false));
            setModalOpen(true);
        }
    }, [fileUploadErrorMessage]); // fileUploadErrorMessage 값이 변경될 때마다 실행

    // 상세 페이지로 이동하는 함수
    const redirectToPostDetailPage = useCallback(() => {
        navigate(`/exchanges/${postId}`);
    }, [postId, navigate]);

    console.log(modalOpen);

    // 비정상 접근인지 확인하는 함수(postId까지 조건으로 걸어준 이유는, postId는 useparams으로 가져오므로 렌더링 후에 가져오는데,
    //    만약 postId가 업데이트 되기 전에 postId를 바탕으로 상세페이지로 이동한다면, 그럼 undefined 경로로 redirect됨
    const isInvalidAccess = () => {
        return postId && !postDetail;
    };

    // invalid access면 게시글 상세페이지로 이동
    useEffect(() => {

        console.log("useEffect 실행됨");
        console.log("isInvalidAccess():", isInvalidAccess());

        if (isInvalidAccess()) {
            console.log(28237843298);
            setModalMessage('정상적인 접근 경로가 아닙니다. 게시글 상세페이지로 이동합니다.');
            setModalOnClose(redirectToPostDetailPage);
            setModalOpen(true);

            const timer = setTimeout(() => {
                setModalOpen(false);
                redirectToPostDetailPage();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isInvalidAccess, postId, postDetail, redirectToPostDetailPage]);

    return (
        <div className={styles.mainWrapper}>

            {/* 이미지 업로드 */}
            <ImageUploadSection
                ref={fileInputRef}
                onFileSelect={handleFileSelect}
            />

            {/* 파일 이름 목록을 표시하는 컴포넌트 */}
            <FileListDisplay
                // uploadedFiles={uploadedFile}
                // setUploadedFile={setUploadedFile}
            />

            {/* 상세페이지로 옮기는 모달 */}
            {modalOpen && (
                <AlertModal
                    title={modalMessage}
                    onClose={modalOnClose}
                    onPressEscape={modalOnClose}
                />
            )}

            <div className={styles.categoriesSection}>
                {/* 주는 카테고리 */}
                <div className={`${styles.sectionBox} ${styles.half}`}>
                    <span className={styles.title}><span className={styles.highlight}>{username}</span>님이 알려주실 재능</span>
                    <div className={styles.contentBox}>
                        <Categories
                            mainCategory={post.offerCategoryMain || '정보 없음'}
                            subCategory={post.offerCategorySub || '정보 없음'}
                            subCategoryId={post.offerCategorySubId || 'unknown'}
                            theme={'give'}
                            className={'column'}
                            size={'large'}
                        />
                    </div>
                </div>
                {/* 받는 카테고리 */}
                <div className={`${styles.sectionBox} ${styles.half}`}>
                    <span className={styles.title}><span className={styles.highlight}>{post.username}</span>님께 배우고 싶은 재능</span>
                    <div className={styles.contentBox}>
                        <Categories
                            mainCategory={post.offerCategoryMain || '정보 없음'}
                            subCategory={post.offerCategorySub || '정보 없음'}
                            subCategoryId={post.offerCategorySubId || 'unknown'}
                            theme={'want'}
                            className={'column'}
                            size={'large'}
                        />
                    </div>
                </div>
            </div>
            {   /*  end of 재능  */}

            {/* 지역 */}
            <div className={`${styles.sectionBox} ${styles.half}`}>
                <span className={styles.title}>여기서 만날 수 있어요</span>
                <div className={styles.contentBox}>
                    <span className={styles.contentText}>
                        <MapPinnedIcon size={16}/>{post.locationSmall ? `   ${post?.locationSub} ${post?.locationSmall}` : '정보없음'}
                    </span>
                </div>
            </div>

            {/* 지역 */}
            <div className={`${styles.sectionBox}`}>
                <span className={styles.title}>{username}님의 재능을 어필해보세요</span>
                <ContentInputSection
                    placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"
                    isTitleNecessary={false}
                    // ref={contentInputRef}
                    // name="content"
                />
            </div>

            <Button
                theme={'blueTheme'}
                fontSize={'medium'}
                className={'fill'}
                // ref={ref}
                type={'submit'}
                // onSubmit={}
            >제출하기</Button>

        </div>
    );
};

export default ExchangeRequestPage;
