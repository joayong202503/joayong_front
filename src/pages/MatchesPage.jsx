import React, {useEffect, useState, useMemo} from 'react';
import styles from './MatchesPage.module.scss';
import Button from "../components/common/Button.jsx";
import SegmentControl from "../components/common/SegmentControl.jsx";
import {useNavigate} from "react-router-dom";
import MatchingMessageThumbnail from "../components/MatchesPage/MatchingMessageThumbnail.jsx";
import Spinner from "../components/common/Spinner.jsx";
import {fetchUserInfo} from "../services/userService.js";
import getCompleteImagePath from "../utils/getCompleteImagePath.js";
import Tabs from "../components/common/Tabs.jsx";
import {fetchMatchingRequestsWithFilters} from "../services/matchingService.js";
import InputBox from "../components/common/InputBox.jsx";
import {useSelector} from "react-redux";

const MatchesPage = () => {

    useEffect(() => {
        window.scrollTo(0, 0); // 페이지의 최상단으로 이동
    }, []);

    // ### matchingRequests vs FilteredRequests
    //  - matchingReques는 fetch 된 값, filteredRequests는 fetch된 검색어로 필터링한 값

    // ======== 일반 변수 ======== //
    // 세그먼트 컨트롤의 메뉴 목록
    const menuOptions = ['전체보기', '보낸 요청', '받은 요청'];
    // tabs button 식 메뉴의 선택 옵션 (데이터 조회 시 status로 줄 값)
    const statusOptions = [
        { value: 'ALL', label: '전체보기' },
        { value: 'N', label: '대기 중' },
        { value: 'M', label: '수락됨' },
        { value: 'D', label: '거절됨' },
        // R : 양쪽 리뷰 안함   & RW : 게시글 글쓴이만 리뷰함  & RS : 게시글 본 사람만 리뷰함 & c : 전체 리뷰함,
        { value: 'R+RW+RS+C', label: '완료됨' },
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
    //  검색 관련
    const [searchQuery, setSearchQuery] = useState(''); // 검색어
    const [debouncedQuery, setDebouncedQuery] = useState(''); // 디바운스된 검색어
    const [filteredRequests, setFilteredRequests] = useState([]); // 검색 결과로 필터링한 값
    // 알림 관련
    // 맨 처음에 불러온 값을 계속 보관
    const [initialRequests, setInitialRequests] = useState([]); // 최초 데이터를 보관할 상태
    const [hasPendingRequests, setHasPendingRequests] = useState(false);  // 내가 받은 메시지이며 동시에 status가 N인 메시지가 있는지 확인
    // 내 이름
    const myUsername = useSelector((state) => state.auth.user.name);

    // matchingRequests가 업데이트될 때마다 filteredRequests도 업데이트
    useEffect(() => {
        setFilteredRequests(matchingRequests);
    }, [matchingRequests]);

    // 내가 받은 메시지이며 동시에 status가 N인 메시지가 있는지 확인
    useEffect(() => {
        // 필터링하여 값이 바뀐 경우, status가 r+c, d, m, 이거나, filter가 send인 경우는 initialrequests 업데이트 하면 안됨
        // (그러면 당연히내가 받은 status 가 n인 메시지는 0이 됨)
        if (selectedTabMenu === 'R+RW+RS+C' || selectedTabMenu === 'D' || selectedTabMenu === 'M' || selectedSegmentControlMenu === '보낸 요청') {
            return;
        }

        if (initialRequests.length === 0) return;

        if (matchingRequests.length > 0) {
            setInitialRequests(matchingRequests);
        }

        // matchingRequests를 기준으로 pending 상태 확인
        const flag = matchingRequests.some(request => request.status === 'N' && request.receiverName === myUsername);
        setHasPendingRequests(flag);
    }, [initialRequests, myUsername, matchingRequests, selectedTabMenu, selectedSegmentControlMenu]);


    // ====== 일반 함수 ====== //
    // 게시글의 status 가 변경되었을 시, 성능 최적화를 위해
    // 다시 모든 데이터를 불러오지 않고 useState로 관리하는 값만 바꿈
    const updateMatchingRequest = (messageId, newStatus) => {
        setMatchingRequests(prevRequests => {
            const updatedRequests = prevRequests.map(request =>
                request.messageId === messageId
                    ? { ...request, status: newStatus }
                    : request
            );

            // 현재 선택된 탭에 따라 필터링
            if (selectedTabMenu !== 'ALL') {
                return updatedRequests.filter(request => {
                    switch (selectedTabMenu) {
                        case 'N':
                            return request.status === 'N';
                        case 'M':
                            return request.status === 'M';
                        case 'D':
                            return request.status === 'D';
                        case 'R+RW+RS+C':
                            return request.status === 'R' ||
                                request.status === 'RW' ||
                                request.status === 'RS' ||
                                request.status === 'C';
                        default:
                            return true;
                    }
                });
            }

            return updatedRequests;
        });
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
                const userInfoWithProfileUrl = {
                    // 기존 request 응답 받은 것에 sender의 profile image url 추가하여 반환
                    ...request,
                    profileImage: userInfo.profileImageUrl ?
                        getCompleteImagePath(userInfo).profileImageUrl :
                        null
                };
                return userInfoWithProfileUrl;
            })

        );

        // 날짜순으로 정렬 (최신순)
        const sortedRequests = requestsWithProfiles.sort((a, b) =>
            new Date(b.sentAt) - new Date(a.sentAt)
        );
        return sortedRequests;
    };

    // 세그먼트 컨트롤에서 메뉴를 선택하면 일어나는 일
    const handleSegmentControlMenuChange = async (selectedMenu) => {

        setSelectedSegmentControlMenu(selectedMenu);


        try {
            const filter = getMessageFilterBySender(selectedMenu);

            const responseData = await fetchMatchingRequestsWithFilters(filter, selectedTabMenu);

            const requestsWithProfiles = await addProfileImagesToRequests(responseData);

            // 제일 처음 화면 진입 시 실행될 떄는, 알림 설정용으로 값을 초기 응답값 저장해놓은 상태변수에 저장
            if (initialRequests.length === 0) {
                setInitialRequests(requestsWithProfiles);
            }

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

    // 검색어 처리 : 검색어가 없을때는 filteredRequest는 fetch된 값 그대로
    //             검색값이 있으면 fetch된 데이터를 필터링한 값으로
    const filteredResults = useMemo(() => {
        if (!debouncedQuery.trim()) return matchingRequests;

        return matchingRequests.filter(request =>
            request.content?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            request.senderName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            request.receiverName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            request.talentGive?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            request.talentTake?.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
    }, [debouncedQuery, matchingRequests]);

    // 검색어 디바운스 처리
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 검색어 변경 핸들러
    const handleSearchEvent = (value) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        setFilteredRequests(filteredResults);
    }, [filteredResults]);

    // 검색어가 요청 메시지 내용에 포함되는 경우, 메시지의 앞뒤 긁어서 반환해주는 함수
    const extractMatchingContent = (messageContent, searchQuery) => {

        // 검색어가 없거나 메시지 내용이 없는 경우에는 그대로 반환
        if (!searchQuery || !messageContent) return messageContent;

        // 검색어가 messageContent에서 위치한 위치를 찾아냄
        const index = messageContent.toLowerCase().indexOf(searchQuery.toLowerCase());

        // content substring 기준을 갖기 위해, content에서 검색어가 위치한 위치(index)르 기준으로 앞뒤 substring 기준 설정
        const start = Math.max(0, index - 20);
        const end = Math.min(messageContent.length, index + searchQuery.length + 20);

        // 앞뒤로 잘랐다면 ... 표시
        const prefix = start > 0 ? '...' : '';
        const suffix = end < messageContent.length ? '...' : '';

        return prefix + messageContent.substring(start, end) + suffix;
    };

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


                    {/* 검색 바 */}
                    <div className={styles.searchContainer}>
                        <InputBox
                            type="search"
                            // 값이 변경될때마다 matchespage 재렌더링 되어야 하므로, 상태갑으로 관리
                            value={searchQuery}
                            onChange={(e) => handleSearchEvent(e.target.value)}
                            placeholder="검색어를 입력하세요"
                        />
                    </div>


                    {/* 탭으로 선택하는 메뉴 */}
                    <div className={styles.tabsMenuContainer}>
                        <Tabs
                            isNewPendingReceived={hasPendingRequests} // status ==== n, isRecepient인 메시지 있는지 여부
                            options={statusOptions}
                            defaultFilter={statusOptions[0]}
                            onFilterChange={handleTabMenuChange}
                        />
                    </div>
                </div>
            }

            {/* 로딩 상태일 때 Spinner 표시 */}
            {isLoading && (
                <div className={styles.spinnerContainer}>
                    <Spinner size="small" />
                </div>
            )}

            {/* 조회 값이 없을 때 보여줄 문구 */}
            {!isLoading && filteredRequests.length === 0 && (
                <div className={styles.emptyStateContainer}>
                    <span className={styles.emptyStateIcon}>📫</span>
                    <p className={styles.noResultsMessage}>
                        {/* 검색어 searchQury(검색값)이 없어서, 아니면  */}
                        {searchQuery ? '검색 결과가 없습니다.' : '아직 메시지가 없습니다.'}
                    </p>
                    <Button
                        theme="blueTheme"
                        onClick={() => navigate('/exchanges')}
                    >
                        재능 교환글 둘러보기
                    </Button>
                </div>
            )}

            {/* 필터링 된 매칭 요청 메시지 목록 */}
            {filteredRequests.length > 0 && (
                <div className={styles.matchesList}>
                    {filteredRequests.map(request => (
                        <>
                            <MatchingMessageThumbnail
                                key={request.messageId}
                                request={request}
                                onRequestUpdate={updateMatchingRequest}
                            />

                            {/* 검색어 미리보기도 debouncedQuery 사용 */}
                            {debouncedQuery && request.content &&
                                request.content.toLowerCase().includes(debouncedQuery.toLowerCase()) && (
                                    <div className={styles.searchResultPreview}>
                                        <div className={styles.contentMatch}>
                                            <span className={styles.matchLabel}>내용 일치: </span>
                                            <p>{extractMatchingContent(request.content, debouncedQuery) || request.content}</p>
                                        </div>
                                    </div>
                                )}
                        </>
                    ))}
                </div>
            )}
        </div>
    );

};


export default MatchesPage;
