import React, {useEffect, useState} from 'react';
import styles from './ExchangeEditPage.module.scss';
import AdvancedImageCarousel from "../components/common/imagesAndFiles/AdvancedImageCarousel.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchPostDetail} from "../services/postService.js";
import {useSelector} from "react-redux";

const ExchangeEditPage = () => {

    const { exchangeId: postId } = useParams();
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name);
    const [post, setPost] = useState(null);

    //  ===== 게시글 정보 가져오기
    const getPostDetail = async () => {
        try {
            const response = await fetchPostDetail(postId);
            const data = await response.json();
            setPost(data);
        } catch (error) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    status: error.status,
                    message: error.message,
                }
            });
        }
    }

    // 내 게시글이 아니면 이중으로 막아주기
    useEffect(() => {
        if (!post) return; // post가 아직 없으면 리턴

        if (post.name !== myUsername) {
            navigate('/error', {
                state: {
                    errorPageUrl: window.location.pathname,
                    message: "내 게시글만 수정 가능합니다."
                }
            });
        }
    }, [post, myUsername, navigate]); // post가 업데이트될 때마다 체크

    // 초기 데이터 로드
    useEffect(() => {
        getPostDetail();
    }, [postId]);
    // ==== 게시글 정보 불러오기 끝 ====== //

    console.log('post', post);

    // 이미지 관련
    const handleFeaturedImageChange = (featuredImageId) => {
        console.log('부모가 받은 대표사진 id', featuredImageId);
    }




    // // 이미지 모달 관련 상태
    // const [showImageModal, setShowImageModal] = useState(false);
    // const [currentImageIndex, setCurrentImageIndex] = useState(0);
    //
    //
    // console.log('============================')
    // console.log('isLoading', isPostDetailLoading);
    // console.log('isError', isPostDetailError);
    // console.log('error', postDetailError);
    // console.log('post', post);
    // console.log('isPostUploaded', isPostUploaded);
    // console.log('isMyPost', isMyPost);
    // console.log('post id', postId);
    // console.log('============================')
    //
    // // 이미지 순서 변경(대표사진 설정용)
    // const handleFeaturedImageChange = (featuredImageId) => {
    //     console.log('부모가 받은 대표사진 id', featuredImageId);
    // }

    return (
        post && (
            <div className={styles.postEditPage}>
                <div className={styles.imageSection}>
                    {/*이미지 캐러셀*/}
                    <AdvancedImageCarousel
                        maxLength={5}
                        onFeaturedImageChange={handleFeaturedImageChange}
                        images={post?.images}
                    />
                </div>
                <div className={styles.uploadSection}>
                </div>
            </div>
        )
    );
    }

    export default ExchangeEditPage;