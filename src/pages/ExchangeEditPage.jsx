import React, {useEffect, useRef, useState} from 'react';
import styles from './ExchangeEditPage.module.scss';
import {useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useFileUpload} from "../hooks/exchangesCreatePageHook/fileUploadHooks.js";
import fetchWithAuth from "../services/fetchWithAuth.js";
import {messageApi} from "../services/api.js";
import AlertModal from "../components/common/AlertModal.jsx";
import ImageUploadSection from "../components/common/imagesAndFiles/ImageUploadSection.jsx";
import FileListDisplay from "../components/common/imagesAndFiles/FileListDisplay.jsx";
import Categories from "../components/common/categories/Categories.jsx";
import {MapPinnedIcon} from "lucide-react";
import ToolTip from "../components/common/ToolTip.jsx";
import ContentInputSection from "../components/ExchangeCreatePage/ContentInputSecition.jsx";
import Button from "../components/common/Button.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";
import {usePostDetailFetchWithUseQuery, useUseQueryErrorHandler} from "../hooks/useQueryHooks.js";
import {usePostData} from "../hooks/ExchangeDetailPage/usePostData.js";

const ExchangeEditPage = () => {

    // ===== 전역 관리
    const username = useSelector((state) => state.auth.user.name); // 내 글이 아니면 이 페이지에 접근 불가하도록

    // === 경로 관련
    const { exchangeId: postId } = useParams(); // 없는 게시물 번호면 404 페이지로 이동
    const navigate = useNavigate();

    //  =========== 모달 상태값

    // ======= 내용 값 상태관리

    // ======== 캐싱 게시글 상세내용 데이터 불러오기
    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data:postDetail, isLoading:isPostDetailLoading, isError:isPostDetailError, error: postDetailError } = usePostDetailFetchWithUseQuery(postId);

    // 캐싱 데이터를 불러오고 나면, 데이터를에 대해 아래 내용 진행
    // - isPostUploaded : 캐싱된 데이터를 transformPostData()를 통해 필요한 형태로 가공하는 것까지 완료되었는지 확인
    // - post : transformPostDate()로 필요한 형태로 가공된 데이터
    // - isMyPost : 내 게시글인지 확인
    const { post, isPostUploaded, isMyPost } = usePostData(postId, postDetail, isPostDetailLoading, postDetailError);

    // 500, 404 에러 처리
    useUseQueryErrorHandler(isPostDetailError, postDetailError, navigate);

    // 내 포스트 아니면 접근 못하게
    useEffect(() => {

        const redirectIfNotMyPost = () => {
            // useQuery에서 데이터를 다 불러온 후에 내 게시물 인지 확인해야 함
            if (isPostUploaded && !isMyPost) {
                navigate('/error', {
                    state: {
                        errorPageUrl: window.location.pathname,
                        message: "내 게시글만 수정 가능합니다."
                    }
                });
            }
        }
        redirectIfNotMyPost();
    }, [navigate, isMyPost, isPostUploaded]); // useQuery에서 데이터를 다 불러온 후에 내 게시물 인지 확인해야 함


    console.log('============================')
    console.log('isLoading', isPostDetailLoading);
    console.log('isError', isPostDetailError);
    console.log('error', postDetailError);
    console.log('post', post);
    console.log('isPostUploaded', isPostUploaded);
    console.log('isMyPost', isMyPost);
    console.log('post id', postId);
    console.log('============================')


    // // ========= 취소 / 매칭 메시지 보내기
    // // 취소 버튼 누르기
    // const handleRequestCancel = () => {
    //
    //     // 버튼 포커스 제거
    //     document.activeElement.blur();
    //
    //     setConfirmModalMessage(
    //         '메시지 작성을 취소하시겠습니까?'
    //     );
    //
    //     setConfirmModalOpen(true);
    //     setRequestConfirmHandler(() => () => {
    //         setIsMiniModalOpen(true);
    //         setMiniModalMessage('메시지 작성이 취소되었습니다.');
    //         navigate(-1);
    //     });
    //     setRequestCancelHandler(() => () => {
    //         setConfirmModalMessage('');
    //         setConfirmModalOpen(false);
    //     });
    // }
    //
    // // 수락 버튼 누르기
    // const handleSubmit = async () => {
    //
    //     // 버튼 포커스 제거
    //     document.activeElement.blur();
    //
    //     // 먼저 유효성 검사 먼저 해야 함
    //     const content = contentInputRef.current.value;
    //     try {
    //         await validationSchema.validate({content, uploadedFile}, {abortEarly: true});
    //         const formData = new FormData();
    //         // 텍스트 데이터 추가
    //         const message = JSON.stringify({ content: content, postId: postId });
    //         formData.append("message", new Blob([message], { type: "application/json" }));
    //
    //         // 여러 파일이 있는 경우 파일 배열을 반복문으로 추가
    //         if (uploadedFile && uploadedFile.length > 0) {
    //             uploadedFile.forEach(file => {
    //                 formData.append('images', file); // 'uploadedFiles'는 서버에서 받을 파일 필드명
    //             });
    //         }
    //
    //         const response = await fetchWithAuth(messageApi.sendMatchingRequest, {
    //             method: 'POST',
    //             body: formData
    //         });
    //         const data = await response.json();
    //
    //         // 서버 응답 :
    //         if (response.status === 500) {
    //
    //             navigate("/error", {
    //                 state: {
    //                     errorPageUrl: window.location.pathname,
    //                     status: 500,
    //                     message: "서버 오류가 발생했습니다.",
    //                 },
    //             });
    //         } if (response.status === 200) {
    //             setIsMiniModalOpen(true);
    //             setMiniModalMessage('매칭 요청이 정상적으로 발송되었습니다.');
    //             setTimeout(() => {
    //                 navigate(`/exchanges/${postId}`);
    //             }, 2000)
    //         } else {
    //             throw new Error(data.message);
    //         }
    //     } catch (error)  {
    //         // validate 오류
    //         console.log(error);
    //         setModalMessage(error.errors ? error.errors.join(',') : error.message);
    //         setModalOpen(true);
    //
    //         // 기존 타이머가 있다면 취소
    //
    //         if (closeTimeoutRef.current) {
    //             clearTimeout(closeTimeoutRef.current);
    //         }
    //
    //         // 2초 뒤에 모달 닫기
    //         closeTimeoutRef.current = setTimeout(() => {
    //             setModalOpen(false);
    //         }, 2000);
    //
    //     }
    // };

    return (
        <div className={styles.mainWrapper}>
            {/*/!* 상세페이지로 옮기는 모달 *!/*/}
            {/*{redirectModalOpen && (*/}
            {/*    <AlertModal*/}
            {/*        title={redirectModalMessage}*/}
            {/*        onClose={() => {*/}
            {/*            navigate(`/exchanges/${postId}`);*/}
            {/*        }}*/}
            {/*        onPressEscapeOrEnter={() => {*/}
            {/*            navigate(`/exchanges/${postId}`);*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}

            {/*<div className={styles.fileSection}>*/}
            {/*    /!* 이미지 업로드 *!/*/}
            {/*    <ImageUploadSection*/}
            {/*        ref={fileInputRef}*/}
            {/*        onFileSelect={handleFileSelect}*/}
            {/*    />*/}

            {/*    /!* 파일 이름 목록을 표시하는 컴포넌트 *!/*/}
            {/*    <FileListDisplay*/}
            {/*        uploadedFiles={uploadedFile}*/}
            {/*        setUploadedFile={setUploadedFile}*/}
            {/*    />*/}


            {/*</div>*/}



            {/*/!* 일반 모달 *!/*/}
            {/*{modalOpen && (*/}
            {/*    <AlertModal*/}
            {/*        title={modalMessage}*/}
            {/*        onClose={() => {*/}
            {/*            setModalMessage('');*/}
            {/*            setModalOpen(false)}}*/}
            {/*        onPressEscapeOrEnter={() => {setModalMessage(''); setModalOpen(false)}}*/}
            {/*    />*/}
            {/*)}*/}

            {/*<div className={styles.categoriesSection}>*/}
            {/*    /!* 주는 카테고리 *!/*/}
            {/*    <div className={`${styles.sectionBox} ${styles.half}`}>*/}
            {/*        <span className={styles.title}><span className={styles.highlight}>{username}</span>님이 알려주실 재능</span>*/}
            {/*        <div className={styles.contentBox}>*/}
            {/*            <Categories*/}
            {/*                mainCategory={post?.offerCategoryMain || '정보 없음'}*/}
            {/*                subCategory={post?.offerCategorySub || '정보 없음'}*/}
            {/*                subCategoryId={post?.offerCategorySubId || 'unknown'}*/}
            {/*                theme={'give'}*/}
            {/*                className={'column'}*/}
            {/*                size={'large'}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    /!* 받는 카테고리 *!/*/}
            {/*    <div className={`${styles.sectionBox} ${styles.half}`}>*/}
            {/*        <span className={styles.title}><span className={styles.highlight}>{post?.username}</span>님께 배우고 싶은 재능</span>*/}
            {/*        <div className={styles.contentBox}>*/}
            {/*            <Categories*/}
            {/*                mainCategory={post?.offerCategoryMain || '정보 없음'}*/}
            {/*                subCategory={post?.offerCategorySub || '정보 없음'}*/}
            {/*                subCategoryId={post?.offerCategorySubId || 'unknown'}*/}
            {/*                theme={'want'}*/}
            {/*                className={'column'}*/}
            {/*                size={'large'}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*{   /*  end of 재능  *!/*/}

            {/*/!* 지역 *!/*/}
            {/*<div className={`${styles.sectionBox} ${styles.half}`}>*/}
            {/*    <span className={styles.title}>여기서 만날 수 있어요</span>*/}
            {/*    <div className={styles.contentBox}>*/}
            {/*        <span className={styles.contentText}>*/}
            {/*            <MapPinnedIcon size={16}/>{post?.locationSmall ? `   ${post?.locationSub} ${post?.locationSmall}` : '정보없음'}*/}
            {/*        </span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*/!* 지역 *!/*/}
            {/*<div className={`${styles.sectionBox}`}>*/}
            {/*    <span className={styles.title}>{username}님의 재능을 어필해보세요</span>*/}
            {/*    <ToolTip content={post?.content} title={`${post?.username}님은 이런 사람을 찾고 있어요`} />*/}
            {/*    <ContentInputSection*/}
            {/*        placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"*/}
            {/*        isTitleNecessary={false}*/}
            {/*        name={'content'}*/}
            {/*        ref={contentInputRef}*/}
            {/*    />*/}
            {/*</div>*/}

            {/*<div className={styles.buttonsContainer}>*/}
            {/*    <Button*/}
            {/*        theme={'whiteTheme'}*/}
            {/*        fontSize={'medium'}*/}
            {/*        className={'fill'}*/}
            {/*        onClick={handleRequestCancel}*/}
            {/*    >취소하기</Button>*/}

            {/*    <Button*/}
            {/*        theme={'blueTheme'}*/}
            {/*        fontSize={'medium'}*/}
            {/*        className={'fill'}*/}
            {/*        onClick={handleSubmit}*/}
            {/*        type={'button'}*/}
            {/*    >제출하기</Button>*/}

            {/*    {confirmModalOpen &&*/}
            {/*        <ConfirmModal*/}
            {/*            title={confirmModalMessage}*/}
            {/*            onConfirm={requestConfirmHandler}*/}
            {/*            onClose={requestCancelHandler}*/}
            {/*            onPressEscape={requestCancelHandler}*/}
            {/*            onPressEnter={requestCancelHandler}*/}
            {/*        />*/}
            {/*    }*/}

            {/*    /!*  메시지 전송 알림 *!/*/}
            {/*    {isMiniModalOpen &&*/}
            {/*        <MiniAlert*/}
            {/*            message={miniModalMessage}*/}
            {/*            onClose={() => {*/}
            {/*                navigate(-1);*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    }*/}
            {/*</div>*/}

        </div>
    );
};

export default ExchangeEditPage;