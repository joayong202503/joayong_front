
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
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";

const ExchangeRequestPage = () => {

    // ===== 전역 관리
    const username = useSelector((state) => state.auth.user.name);
    // const username = useSelector((state) => state.auth.user.name);
    const navigate = useNavigate();
    const { exchangeId: postId } = useParams();
    const {state} = useLocation(); // navigate 할 때 전달한 값.렌더링 후 가져와짐
    const post = state?.postDetail;

    //  =========== 모달 상태값
    const [redirectModalOpen, setRedirectModalOpen] = useState(false); // 이전 페이지 모달
    const [redirectModalMessage, setRedirectModalMessage] = useState('');
    const [modalOpen, setModalOpen ] = useState(false);
    const [modalMessage, setModalMessage ] = useState('');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false); // 컨펌 모달
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [requestCancelHandler, setRequestCancelHandler] = useState(null);
    const [requestConfirmHandler, setRequestConfirmHandler] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // 성공 알림 미니 모달

    // ======== 파일 업로드 상태값
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, setUploadedFile } = useFileUpload();
    const fileInputRef = useRef();

    // 파일 업로드 과정 중 오류 발생하면 모달 띄우기
    useEffect(() => {
        if (fileUploadErrorMessage) {
            setModalMessage(fileUploadErrorMessage);
            setModalOpen(true); // 짧은 딜레이 후 다시 열기
        }
    }, [fileUploadErrorMessage])

    // ========== 비정상 접인 경로아서 접근했는지 확인
    const isInValidateAccess = () => {
        // state는 uselocation이므로 렌더링 후 가져와지므로, state로만 거르면 제일 처음에는 무조건 undefined가 나옴
        return postId && !state;
    }

    // 상세 페이지로 이동
    function redirectToDetailPage() {
        // 모달 메시지 설정
        setRedirectModalMessage("올바르지 않은 접속 경로입니다. 게시글 상세 페이지로 이동합니다.");
        // 모달 열기
        setRedirectModalOpen(true);

        // 2초 뒤에 페이지 이동
        setTimeout(() => {
            navigate(`/exchanges/${postId}`);
        }, 5000);
    }


    // 비정상 접근인지 확인하는 함수(postId까지 조건으로 걸어준 이유는, postId는 useparams으로 가져오므로 렌더링 후에 가져오는데,
    //    만약 postId가 업데이트 되기 전에 postId를 바탕으로 상세페이지로 이동한다면, 그럼 undefined 경로로 redirect됨
    useEffect(() => {

        if (isInValidateAccess()) {
            redirectToDetailPage();
        }
    }, [postId, state]);

    // ========= 취소 / 매칭 메시지 보내기
    // 취소 버튼 누르기
    const handleRequestCancel = () => {
        setConfirmModalMessage(
            '메시지 작성을 취소하시겠습니까?'
        );
        setConfirmModalOpen(true);
        setRequestConfirmHandler(() => () => {navigate(-1)});
        setRequestCancelHandler(() => () => {setConfirmModalMessage(''); setConfirmModalOpen(false)});
    }

    // 수락 버튼 누르기
    const handleRequestConfirm = () => {
        setConfirmModalMessage(
            '정말 메시지를 전송하시겠습니까?'
        );
        setConfirmModalOpen(true);
        setRequestCancelHandler(() => () => {setConfirmModalMessage(''); setConfirmModalOpen(false)});
        setRequestConfirmHandler(() => () => {setIsSuccessModalOpen(true); setConfirmModalOpen(false)});
    }


    return (
        <div className={styles.mainWrapper}>

            {/* 상세페이지로 옮기는 모달 */}
            {redirectModalOpen && (
                <AlertModal
                    title={redirectModalMessage}
                    onClose={() => navigate(`/exchanges/${postId}`)}
                    onPressEscape={() => navigate(`/exchanges/${postId}`)}
                />
            )}


            <div className={styles.fileSection}>
                {/* 이미지 업로드 */}
                <ImageUploadSection
                    ref={fileInputRef}
                    onFileSelect={handleFileSelect}
                />

                {/* 파일 이름 목록을 표시하는 컴포넌트 */}
                <FileListDisplay
                    uploadedFiles={uploadedFile}
                    setUploadedFile={setUploadedFile}
                />


            </div>



            {/* 일반 모달 */}
            {modalOpen && (
                <AlertModal
                    title={modalMessage}
                    onClose={() => {setModalMessage(''); setModalOpen(false)}}
                    onPressEscape={() => {setModalMessage(''); setModalOpen(false)}}
                />
            )}

            <div className={styles.categoriesSection}>
                {/* 주는 카테고리 */}
                <div className={`${styles.sectionBox} ${styles.half}`}>
                    <span className={styles.title}><span className={styles.highlight}>{username}</span>님이 알려주실 재능</span>
                    <div className={styles.contentBox}>
                        <Categories
                            mainCategory={post?.offerCategoryMain || '정보 없음'}
                            subCategory={post?.offerCategorySub || '정보 없음'}
                            subCategoryId={post?.offerCategorySubId || 'unknown'}
                            theme={'give'}
                            className={'column'}
                            size={'large'}
                        />
                    </div>
                </div>
                {/* 받는 카테고리 */}
                <div className={`${styles.sectionBox} ${styles.half}`}>
                    <span className={styles.title}><span className={styles.highlight}>{post?.username}</span>님께 배우고 싶은 재능</span>
                    <div className={styles.contentBox}>
                        <Categories
                            mainCategory={post?.offerCategoryMain || '정보 없음'}
                            subCategory={post?.offerCategorySub || '정보 없음'}
                            subCategoryId={post?.offerCategorySubId || 'unknown'}
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
                        <MapPinnedIcon size={16}/>{post?.locationSmall ? `   ${post?.locationSub} ${post?.locationSmall}` : '정보없음'}
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

            <div className={styles.buttonsContainer}>
                <Button
                    theme={'whiteTheme'}
                    fontSize={'medium'}
                    className={'fill'}
                    onClick={handleRequestCancel}
                    // ref={ref}
                >취소하기</Button>

                <Button
                    theme={'blueTheme'}
                    fontSize={'medium'}
                    className={'fill'}
                    onClick={handleRequestConfirm}
                    // ref={ref}
                >제출하기</Button>

                {confirmModalOpen &&
                    <ConfirmModal
                        title={confirmModalMessage}
                        onConfirm={requestConfirmHandler}
                        onClose={requestCancelHandler}
                        onPressEscape={requestCancelHandler}
                    />
                }

                {/*  메시지 전송 알림 */}
                {isSuccessModalOpen && <MiniAlert message={'매칭 요청이 정상적으로 발송되었습니다.'} onClose={() => {navigate(-1)}}/>}
            </div>

        </div>
    );
};

export default ExchangeRequestPage;

