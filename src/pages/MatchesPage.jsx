import React, {useEffect, useState} from 'react';
import styles from './MatchesPage.module.scss';
import Button from "../components/common/Button.jsx";
import SegmentControl from "../components/common/SegmentControl.jsx";
import {messageApi} from "../services/api.js";
import fetchWithAuth from "../services/fetchWithAuth.js";
import {useNavigate} from "react-router-dom";
import MatchingMessageThumbnail from "../components/MatchesPage/MatchingMessageThumbnail.jsx";
import Spinner from "../components/common/Spinner.jsx";
import {fetchUserInfo} from "../services/userService.js";
import getCompleteImagePath from "../utils/getCompleteImagePath.js";
import Tabs from "../components/common/Tabs.jsx";
import {fetchMatchingRequestsWithFilters} from "../services/matchingService.js";

const MatchesPage = () => {

//     // 전체 메시지 가져오기
//     const [searchQuery, setSearchQuery] = useState('');
//     const [matchingRequests, setMatchingRequests] = useState([
//         {
//             id: 1,
//             type: '받은 요청',
//             sender: 'SY',
//             profileImage: 'https://sitem.ssgcdn.com/39/66/61/item/0000007616639_i1_750.jpg',
//             giveSkill: '스페인어',
//             wantSkill: '인싸 되는 법',
//             content: '안녕하세요, 스페인어를 배우고 싶어요. 인싸 되는 법을 알려드릴게요. 서울 지역에서 만나면 좋겠어요.'
//         },
//         {
//             id: 2,
//             type: '보낸 요청',
//             sender: 'JH',
//             profileImage: 'https://via.placeholder.com/150',
//             giveSkill: '프로그래밍',
//             wantSkill: '요리',
//             content: '프로그래밍을 알려드릴게요. 대신 요리를 배우고 싶어요. 지역은 상관없어요.'
//         },
//         {
//             id: 3,
//             type: '받은 요청',
//             sender: 'MK',
//             profileImage: 'https://via.placeholder.com/150',
//             giveSkill: '영어',
//             wantSkill: '그림',
//             content: '영어 회화를 도와드릴 수 있어요. 그림 그리는 법을 배우고 싶어요. 부산 지역입니다.'
//         }
//     ]);
//
//     const handleSearch = (query) => {
//         setSearchQuery(query);
//     };
//
//     const highlightText = (text, query) => {
//         if (!query || query.trim() === '') return text;
//
//         const parts = text.split(new RegExp(`(${query})`, 'gi'));
//         return parts.map((part, index) =>
//             part.toLowerCase() === query.toLowerCase()
//                 ? <span key={index} className={styles.highlight}>{part}</span>
//                 : part
//         );
//     };
//
//     // 검색어와 일치하는 내용이 있는지 확인하는 함수
//     const hasMatchingContent = (request, query) => {
//         if (!query || query.trim() === '') return false;
//
//         // 제목(스킬), 내용, 이름 등에서 검색어 포함 여부 확인
//         return (
//             request.giveSkill.toLowerCase().includes(query.toLowerCase()) ||
//             request.wantSkill.toLowerCase().includes(query.toLowerCase()) ||
//             request.sender.toLowerCase().includes(query.toLowerCase()) ||
//             request.content.toLowerCase().includes(query.toLowerCase())
//         );
//     };
//
//     // 검색어가 포함된 내용 부분 추출하는 함수
//     const extractMatchingContent = (content, query) => {
//         if (!query || query.trim() === '' || !content.toLowerCase().includes(query.toLowerCase())) {
//             return null;
//         }
//
//         // 검색어를 포함한 문장 추출 로직
//         const sentences = content.split(/[.!?]+/).filter(s => s.trim() !== '');
//         const matchingSentences = sentences.filter(s =>
//             s.toLowerCase().includes(query.toLowerCase())
//         );
//
//         if (matchingSentences.length === 0) return null;
//
//         // 검색어를 포함한 문장들을 ... 으로 연결
//         return matchingSentences.join('. ') + '.';
//     };
//
//     return (
//         <div className={styles.matchesContainer}>
//
//             <div className={styles.searchContainer}>
//                 <SearchBar onSearch={handleSearch} />
//             </div>
//
//             <div className={styles.matchesList}>
//
//
//
//                         {/* 검색어가 있고, 검색 결과가 있을 때 검색 결과 프리뷰 표시 */}
//                         {searchQuery && hasMatchingContent(request, searchQuery) && (
//                             <div className={styles.searchResultPreview}>
//                                 {/* 내용에서 검색어가 있는 경우에는 문장 추출하여 표시 */}
//                                 {request.content.toLowerCase().includes(searchQuery.toLowerCase()) && (
//                                     <div className={styles.contentMatch}>
//                                         <span className={styles.matchLabel}>내용 일치: </span>
//                                         <p>{highlightText(extractMatchingContent(request.content, searchQuery) || request.content, searchQuery)}</p>
//                                     </div>
//                                 )}
//
//                                 {/* 제목이나 이름에서만 검색어가 있는 경우에는 전체 내용 일부 표시 */}
//                                 {!request.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
//                                     (request.giveSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                         request.wantSkill.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                                         request.sender.toLowerCase().includes(searchQuery.toLowerCase())) && (
//                                         <div className={styles.titleMatch}>
//                                             <span className={styles.matchLabel}>제목 일치: </span>
//                                             <p className={styles.contentPreview}>{request.content.substring(0, 50)}...</p>
//                                         </div>
//                                     )}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };


    // ======== 일반 변수 ======== //
    // 세그먼트 컨트롤의 메뉴 목록
    const menuOptions = ['전체보기', '보낸 요청', '받은 요청'];
    // tabs button 식 메뉴의 선택 옵션 (데이터 조회 시 status로 줄 값)
    const statusOptions = [
        { value: 'ALL', label: '전체보기' },
        { value: 'N', label: '대기 중' },
        { value: 'M', label: '수락됨' },
        { value: 'D', label: '거절됨' },
        { value: 'R+C', label: '완료됨' }, // 리뷰 안한 R + 리뷰 한 c,
    ];

    // ========= 상태값 관리 ========= //
    // 세그먼트에서 선택된 값
    const [selectedSegmentControlMenu, setSelectedSegmentControlMenu] = useState('전체보기')
    // 탭 메뉴에서 선택된 값
    const [selectedTabMenu, setSelectedTabMenu] = useState(statusOptions[0].value); // { value: 'ALL', label: '전체보기' }
    // 요청 메시지들
    const [matchingRequests, setMatchingRequests] = useState([]);
    // 로딩 중
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // ====== 일반 함수 ====== //
    // 게시글의 status 가 변경되었을 시, 성능 최적화를 위해
    // 다시 모든 데이터를 불러오지 않고 useState로 관리하는 값만 바꿈
    const updateMatchingRequest = (messageId, newStatus) => {
        setMatchingRequests(prevRequests =>
            prevRequests.map(request =>
                request.messageId === messageId
                    ? { ...request, status: newStatus }
                    : request
            )
        );
    };

    // 선택된 세크먼트 컨트롤 메뉴에 따라 메시지 조회 시 filter 값을 정의하는 함수
    const getMessageFilterBySender = (selectedSegmentControlMenu) => {
        switch(selectedSegmentControlMenu) {
            case '전체보기':
                return 'ALL';
            case '보낸 요청':
                return 'SEND';
            case '받은 요청':
                return 'RECEIVE';
            default:
                return 'ALL';
        }
    };

    // 매칭 요청들에 프로필 이미지 정보를 추가하는 함수
    const addProfileImagesToRequests = async (requests) => {
        // 각 요청에 대해 프로필 이미지 정보 추가(이미지 정보는 별도로 fetch하여야 함)
        const requestsWithProfiles = await Promise.all(
            requests.map(async (request) => {
                const userInfo = await fetchUserInfo(request.senderName);
                return {
                    // 기존 request 응답 받은 것에 sender의 profile image url 추가하여 반환
                    ...request,
                    profileImage: userInfo.profileImageUrl ? 
                        getCompleteImagePath(userInfo.profileImageUrl).imageUrl : 
                        null
                };
            })

        );

        // 날짜순으로 정렬 (최신순)
        const sortedRequests = requestsWithProfiles.sort((a, b) =>
            new Date(b.sentAt) - new Date(a.sentAt)
        );
        console.log('프로필 이미지 추가 fetch한 후 최신순으로 데이터 정렬',sortedRequests);
        return sortedRequests;
    };

    // 세그먼트 컨트롤에서 메뉴를 선택하면 일어나는 일
    const handleSegmentControlMenuChange = async (selectedMenu) => {

        setSelectedSegmentControlMenu(selectedMenu);


        try {
            const filter = getMessageFilterBySender(selectedMenu);

            console.log('필터링 조건 : filter', filter, 'status', selectedTabMenu);
            const responseData = await fetchMatchingRequestsWithFilters(filter, selectedTabMenu);

            const requestsWithProfiles = await addProfileImagesToRequests(responseData);
            setMatchingRequests(requestsWithProfiles);
            setIsLoading(false);
        } catch (error) {
            console.error("매칭 요청 조회 중 오류 발생:", error);
            navigate('/error', {
                state: {
                    errorMessage: error.message || '매칭 요청 조회 중 오류가 발생했습니다.',
                    errorCode: error.status || 500,
                    errorPageUrl: window.location.pathname,
                }
            });
        }
    };


    // 탭 메뉴에서 필터링을 하면 일어나는 일
    const handleTabMenuChange = async (selectedStatus) => {

        try {
            const filter = getMessageFilterBySender(selectedSegmentControlMenu);
            const status = selectedStatus;
            setSelectedTabMenu(status);
//
            console.log('필터링 조건 : filter', filter, 'status', status);

            const responseData = await fetchMatchingRequestsWithFilters(filter, status);

            const requestsWithProfiles = await addProfileImagesToRequests(responseData);
            setMatchingRequests(requestsWithProfiles);
            setIsLoading(false);
        } catch (error) {
            console.error("매칭 요청 조회 중 오류 발생:", error);
            navigate('/error', {
                state: {
                    message: error.message || '매칭 요청 조회 중 오류가 발생했습니다.',
                    status: error.status || 500,
                    errorPageUrl: window.location.pathname,
                }
            });
        }
    }

    // ========= use 함수 ======= //
    // 페이지 진입 시 전체보기 데이터 로드
    useEffect(() => {
        setIsLoading(true);
        
        const timer = setTimeout(() => {
            handleSegmentControlMenuChange('전체보기');
        }, 1000); // 로딩 중 보여주는 용으로 1초 지연

        return () => clearTimeout(timer);
    }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 1회만 실행


    return (

        <div className={styles.matchesContainer}>

            {!isLoading &&
                // 컨트롤 영역
                <div className={styles.controlsContainer}>
                    {/* 세그먼트 컨틀트롤 */}
                    <div className={styles.segmentControlContainer}>
                        <SegmentControl
                            menuOptions={menuOptions}
                            defaultSelected={selectedSegmentControlMenu}
                            onSelect={handleSegmentControlMenuChange}
                        />
                    </div>

                    {/* 탭으로 선택하는 메뉴 */}
                    <div className={styles.tabsMenuContainer}>
                        <Tabs
                            options={statusOptions}
                            defaultFilter={statusOptions[0]}
                            onFilterChange={handleTabMenuChange}
                        />
                    </div>
                </div>
            }


            {/*/!* 나머지 컨텐츠 *!/*/}
            {/*{isLoading ? null :*/}
            {/*    <div className={styles.searchContainer}>*/}
            {/*        /!*<SearchBar onSearch={handleSearch} />*!/*/}
            {/*    </div>*/}
            {/*}*/}

            {/* 로딩 상태일 때 Spinner 표시 */}
            {isLoading && (
                <div className={styles.spinnerContainer}>
                    <Spinner size="small" />
                </div>
            )}

            {/* 조회 값이 없을 때 보여줄 문구 */}
            {!isLoading && matchingRequests.length === 0 && (
                <div className={styles.emptyStateContainer}>
                    <span className={styles.emptyStateIcon}>📫</span>
                    <p className={styles.noResultsMessage}>아직 메시지가 없습니다.</p>
                    <Button 
                        theme="blueTheme"
                        onClick={() => navigate('/exchanges')}
                    >
                        재능 교환글 둘러보기
                    </Button>
                </div>
            )}

            {/* 매칭 요청 메시지 목록 */}
            {matchingRequests.length > 0 && (
                <div className={styles.matchesList}>
                    {matchingRequests.map(request => (
                        <MatchingMessageThumbnail
                            key={request.messageId}
                            request={request}
                            onRequestUpdate={updateMatchingRequest}
                        />
                    ))}
                </div>
            )}
        </div>
    );

};


export default MatchesPage;
