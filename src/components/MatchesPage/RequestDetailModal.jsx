import React, {useCallback, useEffect, useState} from 'react';
import styles from './RequestDetailModal.module.scss';
import {useNavigate} from "react-router-dom";
import Categories from "../common/categories/Categories.jsx";
import {MapPinnedIcon} from "lucide-react";
import ToolTip from "../common/ToolTip.jsx";
import ContentInputSection from "../ExchangeCreatePage/ContentInputSecition.jsx";
import Button from "../common/Button.jsx";
import {fetchMatchingRequestMessageImages} from "../../services/matchingService.js";
import ImageCarouselWithThumbNail from "../common/imagesAndFiles/ImageCarouselWithThumbNail.jsx";
import {fetchPostDetailById} from "../../services/postService.js";
import {getRegionDetailsBySubRegionId} from "../../utils/sortAndGetCategories.js";
import {useSelector} from "react-redux";

const RequestDetailModal = ({
                                // 이 모달이 열리는 매칭 관리 페이지에서 전달
                                request, onClose
                            }) => {

    const navigate = useNavigate();

    // ========= 상태값 관리 =========== //
    // 이미지 캐러셀 관련 상태값
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // request에 이미지와 장소 추가하고 나면 반영하여 재 렌더링 될 수 있도록 상태값으로 request 관리
    const [requestDetail, setRequestDetail] = useState(request);

    // 지역 조회용
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories);


    // ========== fetch 함수 ============ //
    // messageId로 메시지에 첨부된 이미지 조회하고, requestDetail에 반영해주는 함수
    const fetchAndSetImages = async (messageId) => {
        try {
            const images = await fetchMatchingRequestMessageImages(messageId);
            setRequestDetail(prevState => ({
                ...prevState,
                images: images?.messageUrlList?.map(image => image.imageUrl) ?? []
            }));
        } catch (error) {
            handleError(error, "이미지 조회 중 오류가 발생했습니다.");
        }
    };

    // postId로 지역 정보를 조회하고, requestDetail 상태갑셍 업데이트
    const fetchAndSetLocation = async (postId) => {
        try {
            const response = await fetchPostDetailById(postId);
            const locationObject = getRegionDetailsBySubRegionId(response['region-id'], regionCategories);
            const location = `${locationObject?.subCategory} ${locationObject?.smallCategory}`;
            setRequestDetail(prevState => ({
                ...prevState,
                location: location || '정보 없음'
            }));
        } catch (error) {
            handleError(error, "위치 정보 조회 중 오류가 발생했습니다.");
        }
    };

    // fetch 후 에러 처리 함수
    const handleError = (error, defaultMessage) => {
        console.error(defaultMessage, error);
        navigate('/error', {
            state: {
                message: error.message || defaultMessage,
                status: error.status || '기타 오류',
                errorPageUrl: window.location.pathname,
            }
        });
    };

    // 메시지 리스트 api에서는 반환되지 않은 메시지에 첨부된 이미지 파일과 location 정보를 가져오기
    useEffect(() => {
        fetchAndSetImages(request.messageId);
        fetchAndSetLocation(request.postId);
    }, [request.messageId, request.postId]);


    // ============= 모달 여닫기 관련 ============= //
    // ESC 키 누르면 모달 닫기
    const handleEnterKeyPress = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // 모달 외부 클릭시 모달 닫기
    const handleOverlayClick = (e) => {
        if (e.target.className === styles.modalOverlay) {
            onClose();
        }
    };

    useEffect(() => {
        // ESC 누르면 모달 닫히는 이벤트를 이벤트 리스너 등록
        document.addEventListener('keydown', handleEnterKeyPress);
        // body 스크롤 안 되게
        document.body.style.overflow = 'hidden';

        return () => {
            // 이벤트 리스너 제거 및 스크롤 복구
            document.removeEventListener('keydown', handleEnterKeyPress);
            document.body.style.overflow = 'unset';
        };
    }, [handleEnterKeyPress]);
    // 모달 여닫기 관련 끝

    // '게시물 보기' 클릭하면 해당 게시물로 이동
    const handlePostClick = (e) => {
        e.preventDefault(); // 기본 동작 방지
        window.open(`/exchanges/${request.postId}`, '_blank'); // 새 창으로 열기
    };

    return (<div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                    <h2 onClick={handlePostClick}>관련 재능 교환 게시글 보기 → </h2>
                </div>

                <div className={styles.divider}/>

                {/* 내용 */}
                <div className={styles.requestContent}>
                    {/* 이미지 갤러리 */}
                    {requestDetail.images?.length > 0 && (<div className={styles.imageGallery}>
                        <ImageCarouselWithThumbNail
                            imagesObject={requestDetail.images.map(url => ({imageUrl: url}))}
                            isLoading={false}
                            isPostUploaded={true}
                            isOpenModal={showImageModal}
                            setIsOpenModal={setShowImageModal}
                            initialIndex={currentImageIndex}
                            setCurrentIndex={setCurrentImageIndex}
                        />
                    </div>)}

                    {/*재능*/}
                    <div className={styles.categoriesSection}>
                        {/* 메시지 보낸 사람이 주는 카테고리 */}
                        <div className={`${styles.sectionBox} ${styles.half}`}>
                            <span className={styles.title}><span
                                className={styles.highlight}>{requestDetail.senderName}</span>님이 알려줄 수 있어요</span>
                            <div className={styles.contentBox}>
                                <Categories
                                    subCategory={requestDetail.talentGive || '정보 없음'}
                                    theme={'give'}
                                    className={'column'}
                                    size={'large'}
                                />
                            </div>
                        </div>
                        {/* 받는 카테고리 */}
                        <div className={`${styles.sectionBox} ${styles.half}`}>
                            <span className={styles.title}><span
                                className={styles.highlight}>{requestDetail.receiverName}</span>님이 알려줄 수 있어요</span>
                            <div className={styles.contentBox}>
                                <Categories
                                    subCategory={requestDetail.talentTake || '정보 없음'}
                                    theme={'want'}
                                    className={'column'}
                                    size={'large'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 지역 */}
                    <div className={`${styles.sectionBox} ${styles.half}`}>
                        <span className={styles.title}>여기서 만날 수 있어요</span>
                        <div className={styles.contentBox}>
                            <span className={styles.contentText}>
                                <MapPinnedIcon size={16}/>{requestDetail.location || '정보없음'}
                            </span>
                        </div>
                    </div>

                    {/* 지역 */}
                    <div className={`${styles.sectionBox}`}>
                        <span className={styles.title}>{}님의 재능을 어필해보세요</span>
                        <ToolTip content={'DFDDF'} title={'DFDF'} 님은 이런 사람을 찾고 있어요/>
                        <ContentInputSection
                            placeholder="가르칠 내용과 이 재능에 대한 경험을 설명해주세요"
                            // isTitleNecessary={false}
                            name={'content'}
                            // ref={contentInputRef}
                        />
                    </div>


                </div>


            </div>
        </div>

        //
        // {/*                <div className={styles.buttonsContainer}>*/}
        // {/*                    <Button*/}
        // {/*                        theme={'whiteTheme'}*/}
        // {/*                        fontSize={'medium'}*/}
        // {/*                        className={'fill'}*/}
        // {/*                        // onClick={handleRequestCancel}*/}
        // {/*                    >취소하기</Button>*/}
        //
        // {/*                    <Button*/}
        // {/*                        theme={'blueTheme'}*/}
        // {/*                        fontSize={'medium'}*/}
        // {/*                        className={'fill'}*/}
        // {/*                        // onClick={handleSubmit}*/}
        // {/*                        type={'button'}*/}
        // {/*                    >제출하기</Button>*/}
        // {/*                </div>*/}
        //
        // {/*            </div>*/}
        // {/*        </div>*/}


    );
};

export default RequestDetailModal;