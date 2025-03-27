import React, { useEffect, useState } from 'react';
import Card from "../components/common/Card";
import styles from './SearchTestPage.module.scss';
import { searchExchanges } from '../services/searchApi.js';
import { API_URL } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const SearchTestPage = () => {
    const [sdfResults, setSdfResults] = useState([]);
    const [kin1Results, setKin1Results] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // const handleSearch = async () => {
    //     try {
    //         // 'sdf' 검색
    //         const sdfResponse = await searchExchanges('sdasdfasdfdsfdsf', 0, 3);
    //         if (sdfResponse?.postList?.content) {
    //             const mappedSdfData = sdfResponse.postList.content.map(mapPostToCardData);
    //             setSdfResults(mappedSdfData);
    //         }
    //
    //         // 'kin1' 검색
    //         const kin1Response = await searchExchanges('kiㅁㅇㄴㄻㄴㅇㄹㄴㅇㄹn1', 0, 3);
    //         if (kin1Response?.postList?.content) {
    //             const mappedKin1Data = kin1Response.postList.content.map(mapPostToCardData);
    //             setKin1Results(mappedKin1Data);
    //         }
    //
    //         setError(null);
    //     } catch (err) {
    //         console.error('검색 중 오류가 발생했습니다:', err);
    //         setError("검색 중 오류가 발생했습니다.");
    //     }
    // };

    // // 포스트 데이터를 카드 데이터로 매핑하는 함수
    // const mapPostToCardData = (post) => ({
    //     id: post["post-id"],
    //     title: post.title,
    //     talentGive: post["talent-g-name"],
    //     talentTake: post["talent-t-name"],
    //     lessonLocation: post["region-name"],
    //     imageSrc: post.images && post.images.length > 0
    //         ? `${API_URL}${post.images[0].imageUrl}`
    //         : undefined,
    //     profile: {
    //         name: post.name,
    //         imageSrc: post.profileImage,
    //         size: 'xs',
    //         username: post.name,
    //     }
    // });

    useEffect(() => {
        handleSearch();
    }, []);

    const renderCards = (results, searchTerm) => {
        if (!results || results.length === 0) {
            return (
                <div className={styles.searchSection}>
                    <h2>{searchTerm}</h2>
                    <div className={styles.emptyState}>
                        {searchTerm === "관련 게시글" ? (
                            <>
                                <p>해당 재능 카테고리의 다른 게시글이 없어요</p>
                                <Button 
                                    theme="blueTheme"
                                    onClick={() => navigate('/exchanges')}
                                >
                                    한 번 다른 재능들을 둘러보세요. 예상치 못한 새로운 취미를 시작할 기회가 될지도 몰라요💡
                                </Button>
                            </>
                        ) : (
                            <p>이 작성자의 다른 게시글이 없습니다.</p>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.searchSection}>
                <h2>{searchTerm}</h2>
                <div className={styles.cardContainer}>
                    {results.map(result => (
                        <div key={result.id} className={styles.cardItem}>
                            <Card
                                title={result.title}
                                talentGive={result.talentGive}
                                talentTake={result.talentTake}
                                lessonLocation={result.lessonLocation}
                                lessonImageSrc={result.imageSrc}
                                profile={result.profile}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            {renderCards(sdfResults, "관련 게시글")}
            {renderCards(kin1Results, "이 작성자의 다른 게시글")}
        </div>
    );
};

export default SearchTestPage;