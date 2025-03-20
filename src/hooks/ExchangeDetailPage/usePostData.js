// 데이터 불러오기
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
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