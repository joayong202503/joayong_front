import React, {useEffect, useRef, useState} from 'react';
import styles from './ExchangeEditPage.module.scss';
import AdvancedImageCarousel from "../components/common/imagesAndFiles/AdvancedImageCarousel.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {fetchPostDetail} from "../services/postService.js";
import {useSelector} from "react-redux";
import TitleInputSection from "../components/ExchangeCreatePage/TitleInputSection.jsx";
import DropDownBasic from "../components/common/DropDownBasic.jsx";
import {
    getRegionDetailsBySubRegionId,
} from "../utils/sortAndGetCategories.js";

const ExchangeEditPage = () => {


    // ref
    const secondRegionDropDownRef = useRef();
    const thirdRegionDropDownRef = useRef();

    const {exchangeId: postId} = useParams();
    const navigate = useNavigate();
    const myUsername = useSelector((state) => state.auth.user?.name);
    const [post, setPost] = useState(null);

    //  ===== 게시글 정보 가져오기 ================ //
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
        // useRef 적용되고 난 후, 제목 란에 focus
        if (!titleInputRef.current) return;
        titleInputRef.current.focus();
    }, [postId]);

    // ==== 게시글 정보 불러오기 끝 ====== //

    // 제목
    const titleInputRef = useRef();

    // ######  지역 ############# //
    // 원본 데이터에서 전체
    const regionCategories = useSelector((state) => state.regionCategory.regionCategories); // Redux에서 카테고리 값 가져오기
    // 대분류 : 필터링 하지 않음(항상 선택 가능해야 함)
    const [regionBigCategories, setRegionBigCategories] = useState([]); // 필터링 옵션
    // 중분류 : 대분류 선택에 따라 필터링된 내용 보여주기
    const [filteredRegionMiddleCategories, setFilteredMiddleCategories] = useState([]);
    // 소분류 :중분류 선택에 따라 필터링된 내용 보여주기
    const [filteredRegionLastCategories, setFilteredLastCategories] = useState([]);
    // 선택 값
    const [selectedBigCategories, setSelectedBigCategories] = useState([]);
    const [selectedRegionMiddleCategories, setSelectedRegionMiddleCategories] = useState([]);
    const [selectedRegionLastCategories, setSelectedRegionLastCategories] = useState([]);

    // default값(초기 게시글 선택 값)
    const [defaultRegionBigCategory, setDefaultRegionBigCategory] = useState(null);
    const [defaultRegionMiddleCategory, setDefaultRegionMiddleCategory] = useState(null);

    // 초기에 선택된 지역 소id를 바탕으로 지역 카테고리별 초기 값 및 필터링 값 가져오기
    const setupDefaultRegionCategories = (majorCategory, subCategory, smallCategory) => {
        if (!regionCategories) return;

        // 대분류
        const mainRegionCategory = regionCategories.find(category => category.name === majorCategory);
        setDefaultRegionBigCategory(mainRegionCategory);

        // 중분류
        const unorderedFilteredMiddleRegionCategories = mainRegionCategory?.subRegionList || [];
        const sortedFilteredMiddleCategories = [...unorderedFilteredMiddleRegionCategories].sort((a, b) => a.name.localeCompare(b.name));
        setFilteredMiddleCategories(sortedFilteredMiddleCategories);
        setDefaultRegionMiddleCategory(sortedFilteredMiddleCategories.find(category => category.name === subCategory));

        // 소분류
        const unorderedFilteredLastRegionCategories = sortedFilteredMiddleCategories.find(category => category.name === subCategory)?.detailRegionList || [];
        const sortedFilteredLastCategories = [...unorderedFilteredLastRegionCategories].sort((a, b) => a.name.localeCompare(b.name));
        setFilteredLastCategories(sortedFilteredLastCategories);
        setSelectedRegionLastCategories(sortedFilteredLastCategories.find(category => category.name === smallCategory));
    }
    console.log('##################################################selected 지역###', selectedRegionLastCategories);

    // 대분류 카테고리 선택하면 중분류/소불뉴 값도 변경
    const handleRegionMainCategoryChange = (selectedItem) => {

        if (selectedItem)

            // 기존 선택 값 초기화
            setSelectedBigCategories(selectedItem);
            setSelectedRegionMiddleCategories(null);
            setSelectedRegionLastCategories(null);
            // 필터링 값 변경
            const unorderedFilteredMiddleRegionCategories = selectedItem.subRegionList || []; // 중분류 sort
            const sortedFilteredMiddleCategories = [...unorderedFilteredMiddleRegionCategories].sort((a, b) => a.name.localeCompare(b.name));
            setFilteredMiddleCategories(sortedFilteredMiddleCategories);
            // 소분류 sort
            const unorderedFilteredLastRegionCategories = sortedFilteredMiddleCategories.map(category => category.detailRegionList).flat();
            const sortedFilteredLastCategories = [...unorderedFilteredLastRegionCategories].sort((a, b) => a.name.localeCompare(b.name));
            setFilteredLastCategories(sortedFilteredLastCategories);
            // 중분류 드롭다운으로 포커스 이동
            setTimeout(() => {
                secondRegionDropDownRef.current?.focus();
            }, 0);
    };

    // 중분류 정카테고리 선택하면 소분류 값도 변경
    const handleRegionMiddleCategoryChange = (selectedOptionObject) => {
        if (selectedOptionObject) {
            // 기존 선택 값 초기화
            setSelectedRegionMiddleCategories(selectedOptionObject);
            setSelectedRegionLastCategories(null);
            // 필터링 값 변경
            const unorderedFilteredLastRegionCategories = selectedOptionObject.detailRegionList;
            // 정렬
            const sortedFilteredLastCategories = [...unorderedFilteredLastRegionCategories].sort((a, b) => a.name.localeCompare(b.name));
            setFilteredLastCategories(sortedFilteredLastCategories);

            // 소분류 드롭다운으로 포커스 이동
            setTimeout(() => {
                thirdRegionDropDownRef.current?.focus();
            }, 0);
        }
    };

    // 소분류 값 변하면, 부모에게 최종 선택 값 전달
    const handleRegionLastCategoryChange = (selectedOptionObject) => {
        setSelectedRegionLastCategories(selectedOptionObject);
    console.log('최종 선택값', selectedRegionLastCategories);
    };

    // 처음 렌더링 할 때에는, 소분류는 fetch 값 가져오고, 이를 바탕으로 시작 선택 값을 넣어줘야 함
    useEffect(() => {
        if (post) {
            const {majorCategory, subCategory, smallCategory} = getRegionDetailsBySubRegionId(post['region-id'], regionCategories);
            // default 값 설정
            setupDefaultRegionCategories(majorCategory, subCategory, smallCategory);
        }
    }, [post, regionCategories]);

    // 처음 데이터 불러올 시 이에 상응하는 카테고리만 가져오기
    // const {regionMiddleCategoreisdfdfdf, regionLastCategoriesdfdfdf} = getRegionDetailsBySubRegionId(post?.['regionId'], regionCategories);
    // 윗 분류 선택에 따른 아랫 분류 필터링
    // const handleRegionMainCategoryChange = (value) => {
    //     const selectedItem = regionCategories.find(category => category.name === value);
    //     if (selectedItem) {
    //         changeMiddleCategories(selectedItem.subRegionList);
    //     }
    // };
    // console.log(regionMiddleCategoreis);


    console.log('post', post);

    // 이미지 관련
    const handleFeaturedImageChange = (featuredImageId) => {
        console.log('부모가 받은 대표사진 id', featuredImageId);
    }




    return (
        post && (

            <dlv className={styles.postEditPage}>
                {/*제목 입력 */}
                <TitleInputSection
                    label="제목"
                    placeholder="제목을 입력하세요"
                    ref={titleInputRef}
                    id="title"
                    maxLength={50}
                    defaultValue={post.title}
                />

                {/*지역 선택*/}
                <div className={`${styles.locationSection} ${styles.contentBox}`}>
                    <span className={`${styles.title}`}>여기서 만날 수 있어요</span>
                    <div className={styles.locationContainer}>
                        <DropDownBasic
                            options={regionCategories}
                            defaultOption={defaultRegionBigCategory}
                            onChange={handleRegionMainCategoryChange}
                            selectedOption={selectedBigCategories}
                            width={135}
                            placeholder={'대분류'}
                        />
                        <DropDownBasic
                            options={filteredRegionMiddleCategories}
                            defaultOption={defaultRegionMiddleCategory}
                            onChange={handleRegionMiddleCategoryChange}
                            selectedOption={selectedRegionMiddleCategories}
                            width={135}
                            ref={secondRegionDropDownRef}
                            disabled={!selectedBigCategories} // 첫번째가 선택되지 않으면 비활성화
                            placeholder={'중분류'}
                        />
                        <DropDownBasic
                            options={filteredRegionLastCategories}
                            defaultOption={selectedRegionLastCategories}
                            onChange={handleRegionLastCategoryChange}
                            selectedOption={selectedRegionLastCategories}
                            width={135}
                            ref={thirdRegionDropDownRef}
                            disabled={!selectedRegionMiddleCategories} // 두번째가 선택되지 않으면 비활성화
                            placeholder={'소분류'}
                        />
                    </div>
                </div>
                {/*{* end of location container *}*/}

            </dlv>
        )
        );
    }

    export default ExchangeEditPage;