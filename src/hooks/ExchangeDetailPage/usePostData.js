// 데이터 불러오기
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {increasePostViewCount} from "../../services/postService.js";
import {dummyRelatedPosts, dummyUserPosts} from "../../dummyData/forPostDetailPage/dummyData.js";
import {getRegionDetailsBySubRegionId, getTalentDetailsBySubTalentId} from "../../utils/sortAndGetCategories.js";
import nullProfileImage from "../../assets/images/profile.png";

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

    useEffect(() => {
        if (!isLoading && !isError && data) {
            const transformedPost = transformPostData(data, regionList, talentList);
            setPost(transformedPost);
            setIsPostUploaded(true);
            setRelatedPosts(dummyRelatedPosts); // 추후 실제 API로 변경 필요
            setUserPosts(dummyUserPosts); // 추후 실제 API로 변경 필요
            setIsMyPost(data.name === myUsername);

            // 조회수 증가 로직
            const increaseView = async () => {
                const result = await increasePostViewCount(postId);
                console.log('조회수 증가 결과:', result);
            };
            increaseView();
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
        profileImage: serverResponse.profileImage || nullProfileImage,
        locationMain: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).majorCategory : getRegionDetailsBySubRegionId(101, regionList).majorCategory,
        locationSub: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).subCategory : getRegionDetailsBySubRegionId(101, regionList).subCategory,
        locationSmall: serverResponse.location ? getRegionDetailsBySubRegionId(serverResponse.location, regionList).smallCategory : getRegionDetailsBySubRegionId(101, regionList).smallCategory,
        offerCategoryMain: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.offerCategory, talentList).majorCategory : '',
        offerCategorySub: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.offerCategory, talentList).subCategory : getTalentDetailsBySubTalentId(11, talentList).subCategory,
        offerCategorySubId: serverResponse.offerCategory ? serverResponse.offerCategory : 14,
        wantCategoryMain: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.wantCategory, talentList).majorCategory : getTalentDetailsBySubTalentId(11, talentList).majorCategory,
        wantCategorySub: serverResponse.offerCategory ? getTalentDetailsBySubTalentId(serverResponse.wantCategory, talentList).subCategory : getTalentDetailsBySubTalentId(11, talentList).subCategory,
        wantCategorySubId: serverResponse.offerCategory ? serverResponse.wantCategory : 11,
    };
};