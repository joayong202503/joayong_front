import React, {useEffect, useState, useRef} from 'react';
import styles from './ExchangeDetailPage.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import {usePostDetailFetchWithUseQuery, useUseQueryErrorHandler} from "../hooks/useQueryHooks.js";
import { MessageCircleIcon, Trash2} from "lucide-react";
import ImageCarouselWithThumbNail from "../components/common/imagesAndFiles/ImageCarouselWithThumbNail.jsx";
import Categories from "../components/common/categories/Categories.jsx";
import {getPostViewCount, increasePostViewCount, useDeletePost} from "../services/postService.js";
import ProfileCard from "../components/common/ProfileCard.jsx";
import PostDate from "../components/common/icons/PostDate.jsx";
import ViewCount from "../components/common/icons/ViewCount.jsx";
import Button from "../components/common/Button.jsx";
import DetailPageDescription from "../components/ExchangeDetailPage/DetailPageDescription.jsx";
import MiniAlert from "../components/common/MiniAlert.jsx";
import {checkMatchingRequestValidity} from "../services/matchingService.js";
import {usePostData} from "../hooks/ExchangeDetailPage/usePostData.js";
import {useSelector} from "react-redux";
import DeleteButton from "../components/common/icons/DeleteButton.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import AlertModal from "../components/common/AlertModal.jsx";
import EditButton from "../components/common/icons/EditButton.jsx";
import Card from "../components/common/Card.jsx";

const ExchangeDetailPage = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [viewCount, setViewCount] = useState(0);
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name); // 매칭 요청 버튼 숨기는 용

    // useMutation을 통해 삭제 후 캐싱 데이터 반환한 결과를 반환
    const { mutate, isLoading:isMutationLoading, error:deletePostError } = useDeletePost();

    useEffect(() => {
        if (shouldNavigate) {
            navigate("/");
        }
    }, [shouldNavigate]);


    // 페이지 진입 시 스크롤 최상단으로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    // =============== useQuery를 이용한 fetch ====================== //
    // 검색 후 mappedData를 parameter로 전달하면 Card로 반환해주는 함수
    const relatedPostsRef = useRef(null);
    const userPostsRef = useRef(null);

    // 애니메이션용
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(styles.animate);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        // 두 섹션 모두 관찰
        if (relatedPostsRef.current) {
            observer.observe(relatedPostsRef.current);
        }
        if (userPostsRef.current) {
            observer.observe(userPostsRef.current);
        }

        return () => {
            if (relatedPostsRef.current) {
                observer.unobserve(relatedPostsRef.current);
            }
            if (userPostsRef.current) {
                observer.unobserve(userPostsRef.current);
            }
        };
    }, []);

    const renderCards = (results, searchTerm) => {
        if (!results || results.length === 0) {
            return (
                <div className={styles.searchSection} ref={searchTerm === "관련 게시글" ? relatedPostsRef : userPostsRef}>
                    <h2>{searchTerm}</h2>
                    <div className={styles.emptyState}>
                        {searchTerm === "관련 게시글" ? (
                            <>
                                <p>해당 재능 카테고리의 다른 게시글이 없어요</p>
                                <Button
                                    theme="blueTheme"
                                    onClick={() => navigate('/exchanges')}
                                >
                                    한 번 다른 재능들을 둘러보세요. 예상치 못한 새로운 취미를 시작할 기회가 될지도 몰라요💡
                                </Button>
                            </>
                        ) : (
                            <p>이 작성자의 다른 게시글이 없습니다.</p>
                        )}
                    </div>
                </div>
            );
        }

        // 결과가 있을 때의 반환값 추가
        return (
            <div className={styles.searchSection} ref={searchTerm === "관련 게시글" ? relatedPostsRef : userPostsRef}>
                <h2>{searchTerm}</h2>
                <div className={styles.cardContainer}>
                    {results.map(result => (
                        <div key={result.id} className={styles.cardItem}>
                            <Card
                                title={result.title}
                                talentGive={result.talentGive}
                                talentTake={result.talentTake}
                                lessonLocation={result.lessonLocation}
                                lessonImageSrc={result.imageSrc}
                                profile={result.profile}
                                onDetailClick={() => handleDetailClick(result.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const {exchangeId:postId} = useParams();  // postId 가져오기

    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data, isLoading, isError, error } = usePostDetailFetchWithUseQuery(postId);

    // useQuery로 받아온 데이터를 상태값으로 관리
    const { post, relatedPosts, userPosts, isPostUploaded, isMyPost } = usePostData(postId, data, isLoading, error);

    // useQuery 작업 완료되었고, 에러 메시지의 status가 500이면 : 서버 오류 페이지로 이동
    useUseQueryErrorHandler(isError, error, navigate);

    // 조회수 fetch
    useEffect(() => {
        const fetchViewCount = async (postId) => {
            try {
                const response = await getPostViewCount(postId);
                if (!response.ok) {
                    setViewCount('정보 없음');
                    return;
                }
                const result = await response.json();
                setViewCount(result.viewCount); // 조회수 업데이트
            } catch (error) {
                setViewCount('정보 없음');
                console.error("조회수 가져오기 실패:", error);
            }
        };

        fetchViewCount(postId); // 조회수 호출
    }, [postId]); // postId가 변경될 때마다 실행

    // ===== delete confirm이 되면, 삭제 fetch
    const [deleteConfirmFlag, setDeleteConfirmFlag] = useState(false);
    useEffect(() => {
        const fetchDelete = (postId) => {

            if(!deleteConfirmFlag) return; // 만약 삭제 컨펌 하지 않았으면 return

            // mutate : useMutation을 통해 게시물 삭제 후 캐싱 데이터까지 업데이트하는 함수
            if (mutate.loading) return; // 이미 진행 중인 요청이 있다면 중단

            // postId를 첫 번째 인자로만 전달
            mutate(postId, {
                onSuccess: () => {
                    setIsConfirmModalOpen(false); // 컨펌 모달 지우기
                    setMiniAlertMessage("게시글이 정상적으로 삭제되었습니다.");
                    setIsMiniAlertOpen(true);

                    // 2초 후 메인 페이지로 이동
                    setTimeout(() => {
                        setIsMiniAlertOpen(false);
                        setShouldNavigate(true);  // 페이지 이동
                    }, 2000);
                },

                onError: (error) => {
                    // 요청 실패 시 수행할 작업
                    console.error("에러 발생:", error);
                    navigate("/error", {
                        state: {
                            errorPageUrl: window.location.pathname,
                            status: error.status,
                            message: error.message,
                        },
                    });
                },
            });
        }

       fetchDelete(postId);

    }, [deleteConfirmFlag, postId]);

    // ============== fetching 끝 ============= //
    // 상세보기 페이지로 이동
    const handleDetailClick = (exchangeId) => {
        navigate(`/exchanges/${exchangeId}`);
        // 동 페이지내 이동이므로 스크롤 제일 위로 한번 올려주기
        window.scrollTo(0, 0);
    };

    // 모달 관련
    const [isOpenModal, setIsOpenModal ] = useState(false); // 매칭 요청
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('')
    const [isOpenImageModal, setIsOpenImageModal ] = useState(false); // 이미지 캐러셀
    const [isOpenDeleteModal, setIsOpenDeleteModal ] = useState(false); // 게시글 삭제
    const [deleteModalTitle, setDeleteModalTitle] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // 게시굴 삭제 컨펌 모달
    const [isMiniAlertOpen, setIsMiniAlertOpen] = useState(false);
    const [miniAlertMessage, setMiniAlertMessage] = useState('');

    // 로딩 완료되어서 post 까지 불러왔으면, 조회 수 올려주기
    useEffect(() => {
        if (!isLoading && post && isPostUploaded) {
            const increaseView = async (postId) => {
                const result = await increasePostViewCount(postId);
            };
            increaseView(postId);
        }
    }, [isLoading, post, isPostUploaded, postId]);

    // 매칭 요청 했을 때 로직
    //  - 본인 게시글인 경우, 버튼 자체가 안뜸
    //  - 따라서, 여기에서는 그 사람에게 보낸 매칭 요청이 있는지랑 로그인 했는지만 확인
    const handleRequestMatching = async () => {
        if (!myUsername) {
            return navigate("/login"); // 로그인 안했으면 바로 이동
        }

        // 이미 수락되거나 대기 중인 매칭 요청 메시지가 있는지 확인
        const {available:isMatchingRequestValid} = await checkMatchingRequestValidity(postId);

        if (!isMatchingRequestValid) {
            setModalTitle("이미 대기 중이거나 수락된 매칭이 있습니다.");
            setIsOpenModal(true);
            setTimeout(() => setIsOpenModal(false), 3000); // 자동 닫힘 처리
            return;
        }

        return navigate("request", { state: { postDetail: post } }); // 매칭 요청이 이미 있으면 이동하면서 post 정보 전달
    };

    // 게시물 진짜로 삭제할 것인지 다시 한 번 물어보는 창 띄우기
    const confirmDeletePost = () => {
        setIsConfirmModalOpen(true);
    }

    // 게시물 삭제
    const handleDeletePostRequest = async (postId) => {
        // 정말 삭제할 것인지 컨펌 창 뜸
        confirmDeletePost();
    }

    return (
        // 전체에 대한 wrapper
        <div className={styles.talentExchangeDetail}>
            {isMiniAlertOpen && (
                <MiniAlert
                    message={miniAlertMessage}
                    onClose={() => {
                        setIsMiniAlertOpen(false);
                        navigate("/");
                    }}/>
            )}

            {isOpenModal &&
                <AlertModal
                    title={modalTitle}
                    message={modalMessage}
                    onClose={() => setIsOpenModal(false)}
                />
            }

            {isOpenDeleteModal &&
                <AlertModal
                    title={deleteModalTitle}
                    onClose={() => {
                        setIsOpenDeleteModal(false);
                        navigate("/");
                    }}/>
            }

            {/* 상단 섹션 (이미지 갤러리 + 상세 정보) */}
            <div className={styles.mainSection}>
                {/* 왼쪽: 이미지 갤러리 */}
                <ImageCarouselWithThumbNail
                    imagesObject={post.images}
                    isLoading={isLoading}
                    isPostUploaded={isPostUploaded}
                    isOpenModal={isOpenImageModal}
                    setIsOpenModal={setIsOpenImageModal}
                    initialIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />

                {/* 오른쪽: 상세 정보 */}
                <div className={styles.detailContainer}>
                    {/* 카테고리 박스 */}
                    <div className={styles.categories}>
                        {/* 가르쳐 줄 것 */}
                        <Categories
                            key={'giveCategory'}
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            mainCategory={post.offerCategoryMain}
                            subCategory={post.offerCategorySub}
                            subCategoryId={post.offerCategorySubId}
                            theme={'give'}
                            label={'가르칠 수 있어요'}
                        />
                        {/* 배울 것 */}
                        <Categories
                            key={'wantCategory'}
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            mainCategory={post.wantCategoryMain}
                            subCategory={post.wantCategorySub}
                            subCategoryId={post.wantCategorySubId}
                            theme={'want'}
                            label={'배우고 싶어요'}
                        />
                    </div>
                    {/* 카테고리 박스 끝*/}

                    {/* 제목 */}
                    <h1 className={styles.title}>{post.title}</h1>

                    {/* 프로필 카드 */}
                    <ProfileCard
                        imageSrc={post.profileImage}
                        username={post.username}
                        isLoading={isLoading}
                        isPostUploaded={isPostUploaded}
                        onClick={() => {
                            navigate(`/profile/${post.username}`);
                        }}
                    />

                    {/* 게시글 정보 */}
                    <div className={styles.postMeta}>
                        {/* 생성 시간 */}
                        <PostDate
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            date={post.createdAt}
                        />
                        {/* 조회 수 */}
                        <ViewCount
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            viewCount={viewCount} // 이것만 실시간 fetch하여 가져옴
                        />
                    </div>

                    {/* 액션 버튼(재능교환 신청 + 수정+지우기) */}
                    <div className={styles.actionButtons}>
                        {(!isMyPost && !isLoading && isPostUploaded) &&
                            <Button
                                theme={'blueTheme'}
                                fontSize={'medium'}
                                className={'fill'}
                                onClick={handleRequestMatching}
                            >
                                <MessageCircleIcon size={20}/>재능교환 요청하기
                            </Button>
                        }

                        {/*{ (isMyPost && !isLoading && isPostUploaded) &&*/}

                        {(isMyPost && !isLoading && isPostUploaded) && (
                            <div className={styles.actionButtons}>
                                <EditButton onClick={() => {
                                    navigate(`/exchanges/${postId}/edit`)
                                }}/>
                                <DeleteButton onClick={() => handleDeletePostRequest(postId)}/>
                            </div>
                        )}


                    </div>
                </div>
            </div>

            {/* 게시글 정말 삭제할 것인지 컨펌 받는 모달창 */}
            {isConfirmModalOpen &&
                <ConfirmModal
                    title={"정말 삭제하시겠습니까?"}
                    onConfirm={() => {
                        setDeleteConfirmFlag(true);
                    }}
                    onClose={() => {
                        setIsConfirmModalOpen(false)
                    }}
                    isOpenModal={isOpenModal}
                />}

            {/* 모든 컨텐츠 섹션 */}
            <div className={styles.contentSections}>

                {/* 재능 섹션 */}
                <DetailPageDescription
                    section={'talent'}
                    title={'재능'}
                    content={undefined}
                    isLoading={isLoading}
                    isPostUploaded={isPostUploaded}
                >
                    {/* 카테고리 박스 */}
                    <div className={`${styles.categories} ${styles.column}`}>
                        {/* 가르쳐 줄 것 */}
                        <Categories
                            key={'giveCategory'}
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            mainCategory={post.offerCategoryMain}
                            subCategory={post.offerCategorySub}
                            subCategoryId={post.offerCategorySubId}
                            theme={'give'}
                            label={'가르칠 수 있어요'}
                        />
                        {/* 배울 것 */}
                        <Categories
                            key={'wantCategory'}
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            mainCategory={post.wantCategoryMain}
                            subCategory={post.wantCategorySub}
                            subCategoryId={post.wantCategorySubId}
                            theme={'want'}
                            label={'배우고 싶어요'}
                        />
                    </div>
                </DetailPageDescription>

                {/* 지역 섹션 */}
                <div className={styles.half}>
                    <DetailPageDescription
                        section={'location'}
                        title={'지역'}
                        isLoading={isLoading}
                        content={post.locationSub ? `${post.locationSub} ${post.locationSmall}` : ''}
                        isPostUploaded={isPostUploaded}
                    />
                </div>

                {/* 상세 설명 섹션 */}
                <DetailPageDescription
                    section={'description'}
                    title={'상세 설명'}
                    content={post.content}
                    isLoading={isLoading}
                    isPostUploaded={isPostUploaded}
                />
            </div>

            <div className={styles.container}>
                {renderCards(relatedPosts, "관련 게시글")}
                {renderCards(userPosts, "이 작성자의 다른 게시글")}
            </div>

        </div>
    );
};


export default ExchangeDetailPage;

