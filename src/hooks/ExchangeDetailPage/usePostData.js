// 데이터 불러오기
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {dummyRelatedPosts, dummyUserPosts} from "../../dummyData/forPostDetailPage/dummyData.js";
import {getRegionDetailsBySubRegionId, getTalentDetailsBySubTalentId} from "../../utils/sortAndGetCategories.js";
import nullProfileImage from "../../assets/images/profile.png";
import getCompleteImagePath from "../../utils/getCompleteImagePath.js";
import searchExchanges from "../../services/searchApi.js";
import {useNavigate} from "react-router-dom";

// 페칭한 post Data 가공 및 상태값 관리
export const usePostData = (postId, data, isLoading, isError) => {

    const talentList = useSelector((state) => state.talentCategory.talentCategories);
    const regionList = useSelector((state) => state.regionCategory.regionCategories);
    const myUsername = useSelector((state) => state.auth.user?.name);

    const [post, setPost] = useState({});
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [isPostUploaded, setIsPostUploaded] = useState(false);
    const [isMyPost, setIsMyPost] = useState(false);
    const navigate = useNavigate();

    // 조회된 포스트들을 카드 데이터로 매핑하는 함수
    const mapPostToCardData = (post) => ({
        id: post["post-id"],
        title: post.title,
        talentGive: post["talent-g-name"],
        talentTake: post["talent-t-name"],
        lessonLocation: post["region-name"],
        imageSrc: post.images && post.images.length > 0
            ? getCompleteImagePath(post.images[0].imageUrl)
            : undefined,
        profile: {
            name: post.name,
            imageSrc: getCompleteImagePath(post['profile-url']),
            size: 'xs',
            username: post.name,
        }
    });

    // 특정 키워드로 게시글 조회하는 함수(12개 조회해서 그 중 랜덤 3개 보여줌)
    const searchAndSetRelatedPosts = async (talent, username, size=12) => {
        try {
            // 재능으로 검색
            const talentResponse = await searchExchanges(talent, 0, size);
            if (talentResponse?.postList?.content) {
                const mappedData = talentResponse.postList.content.map(mapPostToCardData);
                // 게시글이 있는 경우에만 랜덤 선택
                if (mappedData.length > 0) {
                    const randomCount = Math.min(3, mappedData.length); // 3과 실제 게시글 수 중 작은 값 선택
                    const randomRelatedPosts = mappedData
                        .sort(() => Math.random() - 0.5)
                        .slice(0, randomCount);
                    setRelatedPosts(randomRelatedPosts);
                } else {
                    setRelatedPosts([]); // 게시글이 없는 경우 빈 배열 설정
                }
            }

            // 유저로 검색
            const userResponse = await searchExchanges(username, 0, size);
            if (userResponse?.postList?.content) {
                const mappedUserData = userResponse.postList.content.map(mapPostToCardData);
                // 게시글이 있는 경우에만 랜덤 선택
                if (mappedUserData.length > 0) {
                    const randomCount = Math.min(3, mappedUserData.length);
                    const randomUserPosts = mappedUserData
                        .sort(() => Math.random() - 0.5)
                        .slice(0, randomCount);
                    setUserPosts(randomUserPosts);
                } else {
                    setUserPosts([]); // 게시글이 없는 경우 빈 배열 설정
                }
            }
        } catch (err) {
            console.error('검색 중 오류가 발생했습니다:', err);
            setRelatedPosts([]);
            setUserPosts([]);
        }
    };


    useEffect(() => {
        if (!isLoading && !isError && data) {
            searchAndSetRelatedPosts(data['talent-g-name'], data.name, 12);
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        if (!isLoading && !isError && data) {

            const transformedPost = transformPostData(data, regionList, talentList);
            setPost(transformedPost);
            setIsPostUploaded(true);
            setRelatedPosts(dummyRelatedPosts); // 추후 실제 API로 변경 필요
            setUserPosts(dummyUserPosts); // 추후 실제 API로 변경 필요
            setIsMyPost(data.name === myUsername);

        }
    }, [data, isLoading, isError, postId, regionList, talentList, myUsername]);

    return { post, relatedPosts, userPosts, isPostUploaded, isMyPost };
};

const transformPostData = (serverResponse, regionList, talentList) => {

    return {
        title: serverResponse.title,
        content: serverResponse.content,
        username: serverResponse.name,
        images: serverResponse.images || [],
        createdAt: serverResponse.createdAt,
        views: serverResponse.viewCount,
        id: serverResponse['post-id'],
        postItemId: serverResponse['post-item-id'],
        profileImage: serverResponse['profile-url'] || nullProfileImage,

        locationMain: serverResponse['region-id'] && getRegionDetailsBySubRegionId(serverResponse['region-id'], regionList).majorCategory,
        locationSub: serverResponse['region-id'] && getRegionDetailsBySubRegionId(serverResponse['region-id'], regionList).subCategory,
        locationSmall: serverResponse['region-id'] && getRegionDetailsBySubRegionId(serverResponse['region-id'], regionList).smallCategory,

        offerCategoryMain: serverResponse['talent-g-id'] && getTalentDetailsBySubTalentId(serverResponse['talent-g-id'], talentList).majorCategory,
        offerCategorySub: serverResponse['talent-g-id'] && getTalentDetailsBySubTalentId(serverResponse['talent-g-id'], talentList).subCategory,
        offerCategorySubId: serverResponse['talent-g-id'] && serverResponse['talent-g-id'],

        wantCategoryMain: serverResponse['talent-t-id'] && getTalentDetailsBySubTalentId(serverResponse['talent-t-id'], talentList).majorCategory,
        wantCategorySub: serverResponse['talent-t-id'] && getTalentDetailsBySubTalentId(serverResponse['talent-t-id'], talentList).subCategory,
        wantCategorySubId: serverResponse['talent-t-id'] && serverResponse['talent-t-id'],
    };
};

