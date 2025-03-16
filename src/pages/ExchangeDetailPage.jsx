import React, {useEffect, useState} from 'react';
import styles from './ExchangeDetailPage.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import {usePostDetailFetchWithUseQuery, useUseQueryErrorHandler} from "../hooks/useQueryHooks.js";
import { MessageCircleIcon, Trash2} from "lucide-react";
import ImageCarouselWithThumbNail from "../components/common/ImageCarouselWithThumbNail.jsx";
import Categories from "../components/common/Categories.jsx";
import {increasePostViewCount} from "../services/postService.js";
import ProfileCard from "../components/common/ProfileCard.jsx";
import PostDate from "../components/common/PostDate.jsx";
import ViewCount from "../components/common/ViewCount.jsx";
import Button from "../components/common/Button.jsx";
import DetailPageDescription from "../components/ExchangeDetailPage/DetailPageDescription.jsx";
import AlertModal from "../components/common/AlertModal.jsx";
import {checkMatchingRequestValidity} from "../services/matchingService.js";
import {usePostData} from "../hooks/ExchangeDetailPage/usePostData.js";
import {useSelector} from "react-redux";

const ExchangeDetailPage = () => {

    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name); // 매칭 요청 버튼 숨기는 용

    // =============== useQuery를 이용한 fetch ====================== //
    const {exchangeId:postId} = useParams();  // postId 가져오기

    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data, isLoading, isError, error } = usePostDetailFetchWithUseQuery(postId);

    // useQuery로 받아온 데이터를 상태값으로 관리
    const { post, relatedPosts, userPosts, isPostUploaded, isMyPost } = usePostData(postId, data, isLoading, error);

    // useQuery 작업 완료되었고, 에러 메시지의 status가 500이면 : 서버 오류 페이지로 이동
    useUseQueryErrorHandler(isError, error, navigate);

    // ============== fetching 끝 ============= //

    // 모달 관련
    const [isOpenModal, setIsOpenModal ] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    // 로딩 완료되어서 post 까지 불러왔으면, 조회 수 올려주기
    useEffect(() => {
        if (!isLoading && post) {
            const increaseView = async () => {
                const result = await increasePostViewCount();
                console.log('조회수 증가 결과:', result);
            };
            increaseView();
        }
    }, [post]);

    // 카테고리 분류 찾기
    console.log('post server data', data);

    // 매칭 요청 했을 때 로직
    //  - 본인 게시글인 경우, 버튼 자체가 안뜸
    //  - 따라서, 여기에서는 그 사람에게 보낸 매칭 요청이 있는지랑 로그인 했는지만 확인
    const handleRequestMatching = async () => {
        if (!myUsername) {
            return navigate("/login"); // 로그인 안했으면 바로 이동
        }

        // 이미 수락되거나 대기 중인 매칭 요청 메시지가 있는지 확인
        // const { available: isMatchingRequestValid } = checkMatchingRequestValidity(postId);
        const {available:isMatchingRequestValid} = await checkMatchingRequestValidity(postId);

        if (!isMatchingRequestValid) {
            setModalTitle("이미 대기 중이거나 수락된 매칭이 있습니다.");
            setIsOpenModal(true);
            setTimeout(() => setIsOpenModal(false), 3000); // 자동 닫힘 처리
            return;
        }

        return navigate("request"); // 매칭 요청이 이미 있으면 이동
    };


    return (
        // 전체에 대한 wrapper
        <div className={styles.talentExchangeDetail}>

            { isOpenModal &&
                <>
                 <AlertModal
                     title={modalTitle}
                     message={modalMessage}
                     onClose={() => {setIsOpenModal(false)}}
                 />
                </>
            }

            {/* 상단 섹션 (이미지 갤러리 + 상세 정보) */}
            <div className={styles.mainSection}>
                {/* 왼쪽: 이미지 갤러리 */}
                <ImageCarouselWithThumbNail
                    imagesObject={post.images}
                    isLoading={isLoading}
                    isPostUploaded={isPostUploaded}
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
                            viewCount={post.views}
                        />
                    </div>

                    {/* 액션 버튼(재능교환 신청 + 수정+지우기) */}
                    <div className={styles.actionButtons}>
                        { (!isMyPost && !isLoading && isPostUploaded) &&
                            <Button
                                theme={'blueTheme'}
                                fontSize={'large'}
                                className={'fill'}
                                onClick={handleRequestMatching}
                            >
                                <MessageCircleIcon size={23}/>재능교환 요청하기
                            </Button>
                        }

                        {/*{ (isMyPost && !isLoading && isPostUploaded) &&*/}
                        {/*    <EditButton onClick={()=>{alert('수정 버튼 클릭')}}/>}*/}

                        {/*{ (isMyPost && !isLoading && isPostUploaded) &&*/}
                        {/*    <DeleteButton onClick={()=>{alert('삭제 버튼 클릭')}}/>}*/}


                    </div>
                </div>
            </div>

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
                        content={`${post.locationSub} ${post.locationSmall}`}
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
        </div>
        );
        };


export default ExchangeDetailPage;

