
import React, {useEffect, useRef, useState} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AlertModal from "../components/common/AlertModal.jsx";
import Categories from "../components/common/categories/Categories.jsx";
import styles from "./ExchangeRequestPage.module.scss";
import {useSelector} from "react-redux";
import {MapPinnedIcon} from "lucide-react";
import ContentInputSection from "../components/ExchangeCreatePage/ContentInputSecition.jsx";
import Button from "../components/common/Button.jsx";
import ImageUploadSection from "../components/common/imagesAndFiles/ImageUploadSection.jsx";
import FileListDisplay from "../components/common/imagesAndFiles/FileListDisplay.jsx";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";
import ToolTip from "../components/common/ToolTip.jsx";
import * as Yup from 'yup';
import fetchWithAuth from "../services/fetchWithAuth.js";
import {messageApi} from "../services/api.js";

const ExchangeRequestPage = () => {

    // Yup으로 유효성 검사
    const validationSchema = Yup.object({
        content: Yup.string()
            .trim("내용을 입력해 주세요") // 이건 직접적 처리가 필요할 경우에만 사용하세요
            .required("내용을 입력해주세요")
            .max(2200, "내용은 2200자 이내로 입력해주세요"),

        uploadedFiles: Yup.array()
            .of(
                Yup.mixed()
                    // 파일 형식 검증 (JPEG, PNG, GIF만 허용)
                    .test("fileFormat", "이미지는 JPEG, PNG, GIF 형식만 허용됩니다.", (value) => {
                        if (!value) return true; // 파일이 없으면 통과
                        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
                        return allowedTypes.includes(value.type);
                    })
                    // 파일 크기 검증 (5MB 이하)
                    .test("fileSize", "파일 크기는 5MB 이하이어야 합니다.", (value) => {
                        if (!value) return true; // 파일이 없으면 통과
                        return value.size <= 5 * 1024 * 1024; // 5MB = 5 * 1024 * 1024 bytes
                    })
            )
    });


    // ===== 전역 관리
    const username = useSelector((state) => state.auth.user.name);
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
    const [isMiniModalOpen, setIsMiniModalOpen] = useState(false); // 성공 알림 미니 모달
    const [miniModalMessage, setMiniModalMessage] = useState(false); // 성공 알림 미니 모달
    const closeTimeoutRef = useRef(null); // 타이머를 저장할 ref

    // ======== 파일 업로드 상태값
    const { fileUploadErrorMessage, uploadedFile, handleFileSelect, setUploadedFile } = useFileUpload();
    const fileInputRef = useRef();

    // 파일 업로드 과정 중 오류 발생하면 모달 띄우기
    useEffect(() => {
        if (fileUploadErrorMessage) {
            setModalMessage(fileUploadErrorMessage);
            setModalOpen(true); // 짧은 딜레이 후 다시 열기

            // 기존 타이머가 있다면 취소
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }

            // 2초 뒤에 모달 닫기
            closeTimeoutRef.current = setTimeout(() => {
                setModalOpen(false);
            }, 2000);

        }
    }, [fileUploadErrorMessage])

    // 내용 값 상태관리
    const contentInputRef = useRef();

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

        // 기존 타이머가 있다면 취소
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }

        // 3초 뒤에 페이지 이동
        setTimeout(() => {
            navigate(`/exchanges/${postId}`);
        }, 3000);
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

        // 버튼 포커스 제거
        document.activeElement.blur();

        setConfirmModalMessage(
            '메시지 작성을 취소하시겠습니까?'
        );

        setConfirmModalOpen(true);
        setRequestConfirmHandler(() => () => {
            setIsMiniModalOpen(true);
            setMiniModalMessage('메시지 작성이 취소되었습니다.');
            navigate(-1);
        });
        setRequestCancelHandler(() => () => {
            setConfirmModalMessage('');
            setConfirmModalOpen(false);
        });
    }

    // 수락 버튼 누르기
    const handleSubmit = async () => {

        // 버튼 포커스 제거
        document.activeElement.blur();

        // 먼저 유효성 검사 먼저 해야 함
        const content = contentInputRef.current.value;
        try {
            await validationSchema.validate({content, uploadedFile}, {abortEarly: true});
            const formData = new FormData();
            // 텍스트 데이터 추가
            const message = JSON.stringify({ content: content, postId: postId });
            formData.append("message", new Blob([message], { type: "application/json" }));

            // 여러 파일이 있는 경우 파일 배열을 반복문으로 추가
            if (uploadedFile && uploadedFile.length > 0) {
                uploadedFile.forEach(file => {
                    formData.append('images', file); // 'uploadedFiles'는 서버에서 받을 파일 필드명
                });
            }

            const response = await fetchWithAuth(messageApi.sendMatchingRequest, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            // 서버 응답 :
            if (response.status === 500) {

                navigate("/error", {
                    state: {
                        errorPageUrl: window.location.pathname,
                        status: 500,
                        message: "서버 오류가 발생했습니다.",
                    },
                });
            } if (response.status === 200) {
                setIsMiniModalOpen(true);
                setMiniModalMessage('매칭 요청이 정상적으로 발송되었습니다.');
                setTimeout(() => {
                    navigate(`/exchanges/${postId}`);
                    }, 2000)
            } else {
                throw new Error(data.message);
            }
        } catch (error)  {
            // validate 오류
            console.log(error);
            setModalMessage(error.errors ? error.errors.join(',') : error.message);
            setModalOpen(true);

            // 기존 타이머가 있다면 취소

            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }

            // 2초 뒤에 모달 닫기
            closeTimeoutRef.current = setTimeout(() => {
                setModalOpen(false);
            }, 2000);

        }
     };

    return (
        <div className={styles.mainWrapper}>
            {/* 상세페이지로 옮기는 모달 */}
            {redirectModalOpen && (
                <AlertModal
                    title={redirectModalMessage}
                    onClose={() => {
                        navigate(`/exchanges/${postId}`);
                     }}
                    onPressEscapeOrEnter={() => {
                        navigate(`/exchanges/${postId}`);
                    }}
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
                    onClose={() => {
                        setModalMessage('');
                        setModalOpen(false)}}
                    onPressEscapeOrEnter={() => {setModalMessage(''); setModalOpen(false)}}
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
                <ToolTip content={post?.content} title={`${post?.username}님은 이런 사람을 찾고 있어요`} />
                <ContentInputSection
                    placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"
                    isTitleNecessary={false}
                    name={'content'}
                    ref={contentInputRef}
                />
            </div>

            <div className={styles.buttonsContainer}>
                <Button
                    theme={'whiteTheme'}
                    fontSize={'medium'}
                    className={'fill'}
                    onClick={handleRequestCancel}
                >취소하기</Button>

                <Button
                    theme={'blueTheme'}
                    fontSize={'medium'}
                    className={'fill'}
                    onClick={handleSubmit}
                    type={'button'}
                >제출하기</Button>

                {confirmModalOpen &&
                    <ConfirmModal
                        title={confirmModalMessage}
                        onConfirm={requestConfirmHandler}
                        onClose={requestCancelHandler}
                        onPressEscape={requestCancelHandler}
                        onPressEnter={requestCancelHandler}
                    />
                }

                {/*  메시지 전송 알림 */}
                {isMiniModalOpen &&
                    <MiniAlert
                        message={miniModalMessage}
                        onClose={() => {
                            navigate(-1);
                        }}
                    />
                }
            </div>

        </div>
    );
};

export default ExchangeRequestPage;

