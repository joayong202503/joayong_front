import React, {useEffect, useState} from 'react';
import styles from './ExchangeDetailPage.module.scss';
import {useNavigate, useParams} from "react-router-dom";
import {usePostDetailFetchWithUseQuery} from "../hooks/useQueryHooks.js";
import nullProfileImage from "../assets/images/profile.png";

import {
    BookOpen,
    Calendar1Icon,
    Edit2,
    EyeIcon,
    HeartIcon, Layers, MapPin,
    MessageCircleIcon,
    Share2,
    Trash2,
} from "lucide-react";
import {dummyRelatedPosts, dummyUserPosts} from "../dummyData/forPostDetailPage/dummyData.js";
import {
    getRegionDetailsBySubRegionId,
    getTalentDetailsBySubTalentId
} from "../utils/sortAndGetCategories.js";
import ImageCarouselWithThumbNail from "../components/common/ImageCarouselWithThumbNail.jsx";
import {useSelector} from "react-redux";
import Categories from "../components/common/Categories.jsx";
import fetchWithAuth from "../services/fetchWithAuth.js";
import {postApi} from "../services/api.js";
import {increasePostViewCount} from "../services/postService.js";
import ProfileCircle from "../components/common/ProfileCircle.jsx";
import ProfileCard from "../components/common/ProfileCard.jsx";
import formatDate from "../utils/formatDate.js";

function PostDate(props) {
    return null;
}

const ExchangeDetailPage = () => {

    const navigate = useNavigate();
    const talentList = useSelector((state) => state.talentCategory.talentCategories);
    const regionList = useSelector((state) => state.regionCategory.regionCategories);

    // =============== useQuery를 이용한 fetch ====================== //
    const {exchangeId:postId} = useParams();  // postId 가져오기
    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data, isLoading, isError, error } = usePostDetailFetchWithUseQuery(postId);

    // fetch 로딩 다 된 후에 업데이트 되므로, 상태값으로 관리
    const [post, setPost] = useState({});
    const [relatedPosts, setRelatedPosts] = useState([]); // 추후 구현
    const [userPosts, setUserPosts] = useState([]); // 추후 구현
    const [isPostUploaded, setIsPostUploaded] = useState(false);

    // useQuery 작업 완료되었고, 에러 메시지의 status가 500이면 : 서버 오류 페이지로 이동
    // 에러 발생 시, 페이지 이동을 useEffect로 처리
    useEffect(() => {
        if (isError && error) {
            console.log("Error object:", error);
            const errorDetails = JSON.parse(error.message); // 에러는 error 객체이고, 그 안에 response 담아두었음
            if (errorDetails.status === 500 ) {
                // navigate로 에러 페이지로 이동하면서 메시지 전달
                navigate('/error', {state: { errorPageUrl: window.location.pathname, status: errorDetails.status, message: errorDetails.message }});
            } else if (errorDetails.status === 404) {
                navigate('/error', {state: { errorPageUrl: window.location.pathname, status: errorDetails.status, message: "존재하지 않는 게시물입니다." }});
            }
        }
    }, [isError, error, navigate]);

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

    // ============ fetch 된 정보를 바탕으로 내용 업데이트 ============== //

    // useQuery에서 완료되면 data 값이 바뀜 -> data 값이 바뀌면 useEffect로 데이터 값 수정
    //  - 이 때, data 값은 useQuery에서 알아서 상태관리 해주므로 useState로 상태값 관리 따로 할 필요 없음
    useEffect(() => {

        const serverResponse = data;

        // useQuery에서 데이터 업데이트 진행 data 로딩이 완료되고, 에러가 나지 않았을 때만 진행
        if (!isLoading && !isError && data) {
            // post 업데이트 : !! 누락된 데이터 : 위치, 재능, 프로필 이미지
            setPost({
                title: serverResponse.title,
                content: serverResponse.content,
                username: serverResponse.name,
                images: serverResponse.images || [],
                createdAt: serverResponse.createdAt, // updatedAt는 mvp는 구현 생략
                views: serverResponse.viewCount,
                id: serverResponse['post-id'], // postId랑 postItemId랑 다름
                postItemId: serverResponse['post-item-id'],
                profileImage: serverResponse.profileImage || nullProfileImage,
                locationMain: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).majorCategory : getRegionDetailsBySubRegionId(101, regionList).majorCategory, // !! 백엔드 구현 전
                locationSub: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).subCategory : getRegionDetailsBySubRegionId(101, regionList).subCategory, // !! 백엔드 구현 전
                locationSmall: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).smallCategory : getRegionDetailsBySubRegionId(101, regionList).smallCategory, // !! 백엔드 구현 전
                offerCategoryMain: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.offerCategory, talentList).majorCategory : '', // !! 백엔드 구현 전
                offerCategorySub: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.offerCategory, talentList).subCategory : getTalentDetailsBySubTalentId(11, talentList).subCategory, // !! 백엔드 구현 전
                offerCategorySubId: serverResponse.offerCategory ? serverResponse.offerCategory : 14, // !! 백엔드 구현 전
                wantCategoryMain: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.wantCategory, talentList).majorCategory : getTalentDetailsBySubTalentId(11, talentList).majorCategory, // !! 백엔드 구현 전
                wantCategorySub: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.wantCategory, talentList).subCategory : getTalentDetailsBySubTalentId(11, talentList).subCategory, // !! 백엔드 구현 전
                wantCategorySubId: serverResponse.offerCategory ? serverResponse.wantCategory : 11, // !! 백엔드 구현 전
            });

            setIsPostUploaded(true);

            //relatedPosts 업데이트
            setRelatedPosts(dummyRelatedPosts);

            // 사용자 다른 게시글
            setUserPosts(dummyUserPosts);
        } // end of If
    }, [data]); // end of UseEffect

    return (
        // 전체에 대한 wrapper
        <div className={styles.talentExchangeDetail}>
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
                        <PostDate
                            isLoading={isLoading}
                            isPostUploaded={isPostUploaded}
                            date={post.createdAt}
                        />

                                    <div className={styles.postMetaItem}>
                            <EyeIcon size={16}/>
                            조회 {!isLoading && post.views}
                        </div>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className={styles.actionButtons}>
                        <button className={styles.primaryButton}>
                            <MessageCircleIcon size={18}/>
                            재능 교환 요청하기
                        </button>
                        <button
                            className={styles.iconButton}
                            onClick={() => {
                            }}
                        >
                            <HeartIcon size={20} className={styles.favoriteActive}/>
                        </button>
                        <button className={styles.iconButton} onClick={() => {
                        }}>
                            <Share2 size={20}/>
                        </button>
                        <button className={styles.iconButton} onClick={() => {
                        }}>
                            <Edit2 size={18}/>
                        </button>
                        <button className={styles.iconButton} onClick={() => {
                        }}>
                            <Trash2 size={18}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* 모든 컨텐츠 섹션 */}
            <div className={styles.contentSections}>
                {/* 상세 설명 섹션 */}
                <div>
                    <h2 className={styles.sectionTitle}>
                        <BookOpen size={20}/>
                        상세 설명
                    </h2>
                    <div className={styles.contentBox}>
                        <div className={styles.content}>
                            {post.content}
                        </div>
                    </div>
                </div>

                {/* 재능 + 지역 */}
                <div className={styles.flexBox}>
                {/* 재능 섹션 */}
                    <div className={styles.half}>
                        <h2 className={styles.sectionTitle}>
                            <MapPin size={20} className={styles.locationIcon}/>
                            재능
                        </h2>
                        {/* 카테고리 */}
                        <div className={styles.contentBox}>
                            <div className={styles.content}>
                                <div className={`${styles.categories}`}>
                                    <div className={styles.categoryGroup}>
                                        <span className={styles.categoryLabel}>제공:</span>
                                        <div className={`${styles.categoryTag} ${styles.offerCategory}`}>
                                            {/*{ isLoading && post.offerCategory}*/}
                                        </div>
                                        <div className={`${styles.categoryTag} ${styles.offerCategory}`}>
                                            { isLoading && post.offerCategoryMain }
                                        </div>
                                    </div>
                                    <div className={styles.categoryGroup}>
                                        <span className={styles.categoryLabel}>원하는:</span>
                                        <div className={`${styles.categoryTag} ${styles.wantCategory}`}>
                                            {/*/!*{ isLoading && post.wantCategory.main}*!/ // 리스트에서 조회해야 함*/}
                                        </div>
                                        <div className={`${styles.categoryTag} ${styles.wantCategory}`}>
                                            { isLoading && post.wantCategoryMain }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 지역 섹션 */}
                    <div className={styles.half}>
                        <h2 className={styles.sectionTitle}>
                            <MapPin size={20} className={styles.locationIcon}/>
                            지역
                        </h2>
                        <div className={styles.contentBox}>
                            <div className={`${styles.content}`}>
                                <span className={styles.locationText}>
                                    { isLoading && post?.locationSmall }
                                </span>
                            </div>
                        </div>
                    </div>
                </div> {/*  end of 재능 + 지역  */}


            </div>
        </div>
    );
};


export default ExchangeDetailPage;

