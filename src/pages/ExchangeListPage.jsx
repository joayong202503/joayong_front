import React, {useEffect, useState, useRef} from 'react';
import Card from "../components/common/Card.jsx"
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchRecentExchanges} from "../services/exchangeApi.js";
import {searchExchanges} from "../services/searchApi.js";
import defaultProfileImage from '../assets/images/profile.png';
import InputBox from "../components/common/InputBox.jsx";
import styles from "./ExchangeListPage.module.scss";
import { fetchUserProfile } from "../services/profileApi.js";

const API_URL = 'http://localhost:8999';

const ExchangeListPage = () => {
    const navigate = useNavigate();
    const [recentExchanges, setRecentExchanges] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");
    const searchInputRef = useRef(null);
    const [userProfiles, setUserProfiles] = useState({}); // 사용자 프로필 정보 캐싱

    // 한페이지에 12개씩
    const itemsPerPage = 12;

    // redux에서 카테고리 데이터 가져오기
    const talentCategories = useSelector(state => state.talentCategory.talentCategories);
    const regionCategories = useSelector(state => state.regionCategory.regionCategories);

    // 사용자 프로필 이미지 가져오기
    const fetchUserProfileImage = async (username) => {
        // 이미 캐시된 프로필 정보가 있으면 사용
        if (userProfiles[username]) {
            return userProfiles[username];
        }

        try {
            const userData = await fetchUserProfile(username);

            // 프로필 이미지 URL 처리
            let profileImageUrl = userData.profileImageUrl;
            if (profileImageUrl && !profileImageUrl.startsWith('http')) {
                profileImageUrl = `${API_URL}${profileImageUrl}`;
            }

            // 캐시에 저장
            setUserProfiles(prev => ({
                ...prev,
                [username]: profileImageUrl
            }));

            return profileImageUrl;
        } catch (err) {
            console.error(`사용자 ${username}의 프로필 정보를 가져오는데 실패했습니다:`, err);
            return null;
        }
    };

    // 카테고리 ID로 카테고리 이름 찾기
    const getTalentName = (categoryId) => {
        if (!talentCategories || talentCategories.length === 0) return " 카테고리 로딩중";
        const allSubCategories = talentCategories.flatMap(main => main.subTalentList || []);
        // 소분류에서 해당 ID 찾기
        const category = allSubCategories.find(sub => sub.id === categoryId);
        return category ? category.name : " 카테고리 없음 ";
    };

    // 지역카테고리에서 ID로 for문을 통해 대분류,중분류,소분류 배열을 순회하여 해당 ID와 일치하는 소분류를 찾고,
    // 소분류에 해당되는 중분류와 소분류를 합쳐서 return
    const getRegionName = (regionId) => {
        if (!regionId) return "지역없음";
        if (!regionCategories || regionCategories.length === 0) return "지역 로딩중";

        for (const region of regionCategories) {
            if (!region.subRegionList) continue;

            for (const subRegion of region.subRegionList) {
                if (!subRegion.detailRegionList) continue;

                const detailRegion = subRegion.detailRegionList.find(detail => detail.id === regionId);
                if (detailRegion) {
                    return `${subRegion.name} ${detailRegion.name}`;
                }
            }
        }

        return "지역없음";
    };

    // 검색기능
    const handleSearch = async () => {
        //1. 입력창이 존재하는지 확인
        if (!searchInputRef.current) return;

        //2. 검색어 가져오기 및 공백제거
        const keyword = searchInputRef.current.value.trim();

        //3. 상태업데이트: 검색어 저장, 페이지 초기화
        setSearchKeyword(keyword);
        setCurrentPage(0); // 검색할 때 첫 페이지로 초기화

        try {
            // 4. 검색어 유무에 따라 분기
            if (keyword) {
                // 4-1. 검색어가 있으면 검색 API 호출
                const searchResult = await searchExchanges(keyword, 0, itemsPerPage);
                await processExchangeData(searchResult);
            } else {
                // 4-2. 검색어가 없으면 모든 교환 게시물 가져오기
                await getRecentExchanges();
            }
        } catch (err) {
            setError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    };

    // 엔터키 검색 핸들러
    const handleEnterKeySearch = () => {
        handleSearch();
    };

    // 응답 데이터 처리 함수
    const processExchangeData = async (response) => {
        if (response && response.postList && response.postList.content) {
            setTotalPages(response.postList.totalPages);
            // Promise.all을 사용하여 모든 프로필 이미지를 비동기적으로 가져옴
            const mappedData = await Promise.all(response.postList.content.map(async post => {
                // 카테고리 ID를 이름으로 변환
                const talentGive = post[`talent-g-id`] ? getTalentName(post[`talent-g-id`]) : "정보없음";
                const talentTake = post[`talent-t-id`] ? getTalentName(post[`talent-t-id`]) : "정보없음";
                const lessonLocation = post[`region-id`] ? getRegionName(post[`region-id`]) : "정보없음";

                // 사용자 프로필 이미지 가져오기
                const profileImageUrl = await fetchUserProfileImage(post.name);

                return {
                    id: post["post-id"],
                    title: post.title,
                    talentGive: talentGive,
                    talentTake: talentTake,
                    lessonLocation: lessonLocation,
                    imageSrc: post.images && post.images.length > 0
                        ? `${API_URL}${post.images[0].imageUrl}` : undefined,
                    profile: {
                        name: post.name,
                        imageSrc: profileImageUrl || defaultProfileImage,
                        size: 'xs',
                        username: post.name,
                    },
                    content: post.content,
                    createdAt: post.createdAt,
                };
            }));
            setRecentExchanges(mappedData);

        } else {
            setRecentExchanges([]);
            setTotalPages(0);
        }
    };

    // 데이터 불러오기
    const getRecentExchanges = async () => {
        try {
            // 검색어가 있는 경우와 없는 경우를 분리
            let response;
            // 검색어가 있을 경우 검색 API 호출
            if (searchKeyword) {
                response = await searchExchanges(searchKeyword, currentPage, itemsPerPage);
            } else {
                // 검색어가 없을 경우 최근 게시글 API 호출
                response = await fetchRecentExchanges(itemsPerPage, currentPage);
            }

            console.log('API 응답:', response);
            // 응답을 가공
            await processExchangeData(response);
        } catch (err) {
            console.error('재능 교환 목록을 가져오는데 실패했습니다:', err);
            setError('데이터를 불러오는데 실패했습니다. 잠시후 다시 시도해주세요.');
        }
    };

    // 초기 데이터 불러오기(재능카테고리, 지역카테고리가 준비되면 getRecentExchanges()를 실행)
    // currentPage나 searchKeyword가 변경되면 다시 데이터를 불러옴
    useEffect(() => {
        if (talentCategories.length > 0 && regionCategories.length > 0) {
            getRecentExchanges();
        }
    }, [talentCategories, regionCategories, currentPage, searchKeyword]);

    // 상세보기 페이지로 이동
    const handleDetailClick = (exchangeId) => {
        navigate(`/exchanges/${exchangeId}`);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const goToPreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // 다음 페이지로 이동
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 3행으로 나누기 위한 배열
    const firstRow = recentExchanges.slice(0, 4);
    const secondRow = recentExchanges.slice(4, 8);
    const thirdRow = recentExchanges.slice(8, 12);


    return (
        <>
            <div className={styles.fullContainer}>
                <InputBox
                    ref={searchInputRef}
                    searchIcon="true"
                    height="30"
                    width="68%"
                    placeHolder="검색어를 입력하세요 (제목/작성자/재능)"
                    onClick={handleSearch}
                    onHandleEnterKey={handleEnterKeySearch}
                />

                {error ? (
                    <div className={styles.error}>{error}</div>
                ) : recentExchanges.length === 0 ? (
                    <div className={styles.noResults}>
                        {searchKeyword ? `"${searchKeyword}" 검색 결과가 없습니다.` : '게시물이 없습니다.'}
                    </div>
                ) : (
                    <div className={styles.cardContainer}>
                        <div className={styles.cardRow}>
                            {firstRow.map(exchange => (
                                <div
                                    key={exchange.id}
                                    className={styles.cardItem}
                                >
                                    <Card
                                        title={exchange.title}
                                        talentGive={exchange.talentGive}
                                        talentTake={exchange.talentTake}
                                        lessonLocation={exchange.lessonLocation}
                                        lessonImageSrc={exchange.imageSrc}
                                        profile={exchange.profile}
                                        onDetailClick={() => handleDetailClick(exchange.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={styles.cardRow}>
                            {secondRow.map(exchange => (
                                <div
                                    key={exchange.id}
                                    className={styles.cardItem}
                                >
                                    <Card
                                        title={exchange.title}
                                        talentGive={exchange.talentGive}
                                        talentTake={exchange.talentTake}
                                        lessonLocation={exchange.lessonLocation}
                                        lessonImageSrc={exchange.imageSrc}
                                        profile={exchange.profile}
                                        onDetailClick={() => handleDetailClick(exchange.id)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className={styles.cardRow}>
                            {thirdRow.map(exchange => (
                                <div
                                    key={exchange.id}
                                    className={styles.cardItem}
                                >
                                    <Card
                                        title={exchange.title}
                                        talentGive={exchange.talentGive}
                                        talentTake={exchange.talentTake}
                                        lessonLocation={exchange.lessonLocation}
                                        lessonImageSrc={exchange.imageSrc}
                                        profile={exchange.profile}
                                        onDetailClick={() => handleDetailClick(exchange.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {totalPages > 0 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 0}
                            className={styles.pageButton}
                        >
                            이전
                        </button>

                        {totalPages <= 5 ? (
                            // 총 페이지가 5개 이하일 때는 모든 페이지 표시
                            Array.from({length: totalPages}).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    className={`${styles.pageButton} ${currentPage === index ? styles.active : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))
                        ) : (
                            // 총 페이지가 5개 초과일 때 로직
                            Array.from({length: 5}).map((_, index) => {
                                let pageNumber;

                                if (currentPage >= totalPages - 2) {
                                    // 마지막 페이지 근처면 마지막 5개 페이지 표시
                                    pageNumber = totalPages - 5 + index;
                                } else if (currentPage <= 2) {
                                    // 처음 페이지 근처면 처음 5개 페이지 표시
                                    pageNumber = index;
                                } else {
                                    // 중간 페이지면 현재 페이지 중심으로 표시
                                    pageNumber = currentPage + index - 2;
                                }

                                if (pageNumber >= totalPages || pageNumber < 0) return null;

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                );
                            })
                        )}

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1}
                            className={styles.pageButton}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default ExchangeListPage;