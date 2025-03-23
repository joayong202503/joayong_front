import React, {useEffect, useRef, useState} from 'react';
import styles from './ExchangeEditPage.module.scss';
import {usePostDetailFetchWithUseQuery, useUseQueryErrorHandler} from "../hooks/useQueryHooks.js";
import {usePostData} from "../hooks/ExchangeDetailPage/usePostData.js";
import {useNavigate, useParams} from "react-router-dom";
import AdvancedImageCarousel from "../components/common/imagesAndFiles/AdvancedImageCarousel.jsx";

const ExchangeEditPage = () => {

    const { exchangeId: postId } = useParams();
    const navigate = useNavigate();


    // ======== 캐싱 게시글 상세내용 데이터 불러오기 =============== //
    // useQuery를 통해 5분 간격으로 리패칭하여 fetch. useQuery반환 값 중 data(response), isLoading(useQuery 진행중 여부), isError(에러 발생여부), error(에러값) 반환
    const { data:postDetail, isLoading:isPostDetailLoading, isError:isPostDetailError, error: postDetailError } = usePostDetailFetchWithUseQuery(postId);
    useEffect(() => {
        console.log('postDetail', postDetail);
    }, [postDetail]);

    // 캐싱 데이터를 불러오고 나면, 데이터를에 대해 아래 내용 진행
    // - isPostUploaded : 캐싱된 데이터를 transformPostData()를 통해 필요한 형태로 가공하는 것까지 완료되었는지 확인
    // - post : transformPostDate()로 필요한 형태로 가공된 데이터
    // - isMyPost : 내 게시글인지 확인
    const { post, isPostUploaded, isMyPost } = usePostData(postId, postDetail, isPostDetailLoading, isPostDetailError);

    // post를 수정한 후 업로드 하기 위해, 상태로 관리
    const [postToUpload, setPostToUpload] = useState(post);

    console.log(post);
    console.log(111);
    console.log(111);
    console.log(111);
    useEffect(() => {
        if (!post || !isPostUploaded) return;
        setPostToUpload(post);
    }, [post, isPostUploaded]);

    // 500, 404 에러 처리
    useUseQueryErrorHandler(isPostDetailError, postDetailError, navigate);
    // =============== 캐싱 게시글 상세내용 데이터 불러오기 끝 =============== //

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


    // 이미지 모달 관련 상태
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    console.log('============================')
    console.log('isLoading', isPostDetailLoading);
    console.log('isError', isPostDetailError);
    console.log('error', postDetailError);
    console.log('post', post);
    console.log('isPostUploaded', isPostUploaded);
    console.log('isMyPost', isMyPost);
    console.log('post id', postId);
    console.log('============================')

    // 이미지 순서 변경(대표사진 설정용)
    const handleFeaturedImageChange = (featuredImageId) => {
        console.log('부모가 받은 대표사진 id', featuredImageId);
    }



    return (
        <div className={styles.postEditPage}>
            <div className={styles.imageSection}>
                {/* 이미지 캐러셀 */}
                {/*<AdvancedImageCarousel*/}
                {/*    maxLength={5}*/}
                {/*    onFeaturedImageChange={handleFeaturedImageChange}*/}
                {/*    images={post.images}*/}
                {/*/>*/}
            </div>
            <div className={styles.uploadSection}>
            </div>
        </div>
    );
    }

    export default ExchangeEditPage;