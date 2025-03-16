import React, {useEffect, useState} from 'react';
import Card from "../components/common/Card.jsx"
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchRecentExchanges} from "../services/exchangeApi.js";
import profileImage from '../assets/images/profile.png';
import InputBox from "../components/common/InputBox.jsx";
import styles from "./ExchangeListPage.module.scss";

const ExchangeListPage = () => {
    const navigate = useNavigate();
    const [recentExchanges, setRecentExchanges] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 한페이지에 12개씩
    const itemsPerPage = 12;

    // redux에서 카테고리 데이터 가져오기
    const talentCategories = useSelector(state => state.talentCategory.talentCategories);
    const regionCategories = useSelector(state => state.regionCategory.regionCategories);

    // 카테고리 ID로 카테고리 이름 찾기
    const getTalentName = (categoryId) => {
        if (!talentCategories || talentCategories.length === 0) return " 카테고리 로딩중";
        const allSubCategories = talentCategories.flatMap(main => main.subTalentList || []);
        // 소분류에서 해당 ID 찾기
        const category = allSubCategories.find(sub => sub.id === categoryId);
        return category ? category.name : " 카테고리 없음 ";
    };


    const getRegionName = (regionId) => {
        if (!regionCategories || regionCategories.length === 0) return "지역 로딩중";
        const allSubRegions = regionCategories.flatMap(main => main.subRegionList || []);
        // 소분류에서 해당 ID 찾기
        const region = allSubRegions.find(sub => sub.id === regionId);
        return region ? region.name : "지역없음";
    };

    useEffect(() => {
        const getRecentExchanges = async () => {
            try {
                // 현재페이지의 교환 게시물 가져오기
                const response = await fetchRecentExchanges(itemsPerPage, currentPage);
                console.log('API 응답:', response);

                if (response && response.postList && response.postList.content) {
                    const mappedData = response.postList.content.map(post => {
                        const talentGive = post[`talent-g-id`] ? getTalentName(post[`talent-g-id`]) : "정보없음";
                        const talentTake = post[`talent-t-id`] ? getTalentName(post[`talent-t-id`]) : "정보없음";
                        const lessonLocation = post[`region-id`] ? getRegionName(post[`region-id`]) : "정보없음";

                        return {
                            id: post["post-id"],
                            title: post.title,
                            talentGive: talentGive,
                            talentTake: talentTake,
                            lessonLocation: lessonLocation,
                            imageSrc: post.images && post.images.length > 0
                                ? `http://localhost:8999${post.images[0].imageUrl}` : undefined,
                            profile: {
                                name: post.name,
                                imageSrc: profileImage,
                                size: 'xs'
                            },
                            content: post.content,
                            createdAt: post.createdAt
                        };
                    });
                    setRecentExchanges(mappedData);
                    // 현재 페이지 번호와 마지막 페이지 여부를 이용하여 총 페이지 수 계산
                    let calculatedTotalPages = 0;

                    if (response.postList.last) {
                        // 현재 페이지가 마지막 페이지라면, 현재 페이지 번호 + 1이 총 페이지 수
                        calculatedTotalPages = response.postList.number + 1;
                } else {
                        // 마지막 페이지가 아니라면, 최소한 현재 페이지보다 더 많은 페이지가 있음
                        calculatedTotalPages = response.postList.number + 2; // 최소한 다음 페이지는 존재
                }
                    console.log('계산된 총 페이지 수:', calculatedTotalPages);
                    setTotalPages(calculatedTotalPages);
                } else {
                    setRecentExchanges([]);
                    setTotalPages(0);
                }
            } catch (err) {
                console.error('재능 교환 목록을 가져오는데 실패했습니다:', err);
                setError('데이터를 불러오는데 실패했습니다. 잠시후 다시 시도해주세요.');
            }
        };

        if (talentCategories.length > 0 && regionCategories.length > 0) {
            getRecentExchanges();
        }
    }, [talentCategories, regionCategories, currentPage]);

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
            <InputBox searchIcon="true" height="30" width="85%"/>
            {error ? (
                <div className={styles.error}>{error}</div>
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
                                    imageSrc={exchange.imageSrc}
                                    profile={exchange.profile}
                                    onDetailClick={handleDetailClick}
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
                                    imageSrc={exchange.imageSrc}
                                    profile={exchange.profile}
                                    onDetailClick={handleDetailClick}
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
                                    imageSrc={exchange.imageSrc}
                                    profile={exchange.profile}
                                    onDetailClick={handleDetailClick}
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

                    {Array.from({length: Math.min(5, totalPages)}).map((_, index) => {
                        const pageNumber = currentPage <= 2
                            ? index
                            : currentPage + index - 2;

                        if (pageNumber >= totalPages) return null;

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`${styles.pageButton} ${currentPage === pageNumber ? styles.active : ''}`}
                            >
                                {pageNumber + 1}
                            </button>
                        );
                    })}

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