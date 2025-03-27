import React, {useEffect, useRef, useState} from 'react';
import styles from './MatchingMessageThumbnail.module.scss';
import ProfileCircle from "../common/ProfileCircle.jsx";
import Button from "../common/Button.jsx";
import {useNavigate} from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal.jsx";
import MiniAlert from "../common/MiniAlert.jsx";
import {acceptMatchingRequest, fetchCompleteLesson, rejectMatchingRequest} from "../../services/matchingService.js";
import {ApiError} from "../../utils/ApiError.js";
import {useSelector} from "react-redux";
import RequestDetailModal from './RequestDetailModal';
import {Dot} from "lucide-react";

const MatchingMessageThumbnail = ({ request, onRequestUpdate }) => {

    const navigate = useNavigate();

    //  매칭 요청을 내가 보낸 사람인지 받는 사람인지를 확인
    const loggedInUser = useSelector((state) => state.auth.user.name);
    const [isSender, setIsSender] = useState(false);
    const [isReceiver, setIsReceiver] = useState(false);

    useEffect(() => {
        setIsSender(loggedInUser === request.senderName);
        setIsReceiver(loggedInUser === request.receiverName);
    }, [request.senderName, request.receiverName, loggedInUser]);


    // 모달 상태 관리
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [modalConfirmAction, setModalConfirmAction] = useState(null); // 확인 모달에서 컨펌하면 발생한 이벤트 정의
    const [showMiniModal, setShowMiniModal] = useState(false);
    const [miniModalMessage, setMiniModalMessage] = useState('');
    const [isNegativeMiniModalMessage, setIsNegativeMiniModalMessage] = useState(false);
    const [showRequestDetail, setShowRequestDetail] = useState(false); // 요청 메시지 디테일 보여주는 모달

    // 미니 모달 표시 관련 함수
    const showSuccessMiniModal = () => {
        setMiniModalMessage('성공적으로 처리되었습니다.');
        setShowMiniModal(true);
        setTimeout(() => {
            setShowMiniModal(false);
        }, 1500);
    };

    // 미니 오달 에러 묘시 함수
    const showErrorMiniModal = (errorMessage) => {
        setIsNegativeMiniModalMessage(true);
        setMiniModalMessage(errorMessage || '매칭 요청 처리 중 오류가 발생했습니다.');
        setShowMiniModal(true);
        setTimeout(() => {
            setShowMiniModal(false);
            setIsNegativeMiniModalMessage(false);
        }, 1500);
    };

    // 매칭 수락 처리 함수
    const processMatchAccept = async () => {
        try {
            // 1. 서버에 매칭 수락 요청
            await acceptMatchingRequest(request.messageId);

            // 2. 로컬 상태 업데이트
            onRequestUpdate(request.messageId, 'M');

            // 3. 성공 피드백 표시
            showSuccessMiniModal();
            setShowConfirmModal(false);
            setTimeout(() => {
                setShowRequestDetail(false);
            }, 1000);
        } catch (error) {
            console.error("매칭 요청 수락 중 오류 발생:", error);
            showErrorMiniModal(error.message);
        }
    };

    // 매칭 거절 처리 함수
    const processMatchReject = async () => {
        try {
            // 1. 서버에 매칭 거절 요청
            await rejectMatchingRequest(request.messageId);

            // 2. 로컬 상태 업데이트(성능을 위해서 전체  데이터 다시 fetch 하지 않고 일단 local 에서 보이는 것 바꿔줌)
            onRequestUpdate(request.messageId, 'D');

            // 3. 성공했다는 모달 띄우기
            showSuccessMiniModal();
            setShowConfirmModal(false);
            setTimeout(() => {
                setShowRequestDetail(false);
            }, 1000);
        } catch (error) {
            console.error("매칭 요청 거절 중 오류 발생:", error);
            showErrorMiniModal(error.message);
        }
    };

    // 레슨 완료 처리
    const processLessonComplete = async () => {
        try {
            // 1. 서버에 fetch
            await fetchCompleteLesson(request.messageId);

            // 2. 로컬 상태 업데이트(성능을 위해서 전체  데이터 다시 fetch 하지 않고 일단 local 에서 보이는 것 바꿔줌)
            onRequestUpdate(request.messageId, 'R');

            // 3. 성공했다는 모달 띄우기
            setMiniModalMessage('성공적으로 재능 교환이 완료되었습니다. 리뷰 페이지로 이동합니다');
            setShowMiniModal(true);
            setTimeout(() => {
                setShowMiniModal(false);
                handleRedirectToReviewPage();
            }, 2000);
        } catch (error) {
            console.error("레슨 완리 쳐리 중 오류 발생:", error);
            showErrorMiniModal(error.message);
        }
    };


    // 매칭 수락 버튼을 클릭하면 모달 띄우기
    const showAcceptConfirmModal = () => {
        setConfirmModalMessage('매칭 요청을 수락하시겠습니까?');
        setModalConfirmAction(() => processMatchAccept);
        setShowConfirmModal(true);
    };

    // 매칭 거절 버튼을 클릭하면 모달 열기
    const showRejectConfirmModal = () => {
        setConfirmModalMessage('매칭 요청을 거절하시겠습니까?');
        setModalConfirmAction(() => processMatchReject);
        setShowConfirmModal(true);
    };

    // 프로필 사진 클릭하면 프로필 페이지로 이동
    const handleProfileClick = () => {
        navigate(`/profile/${request.senderName}`);
    };


    const handleRedirectToChatRoom = () => {
        console.log("request.senderNmae: "+request.senderName);
        navigate(`/chat/${request.messageId}`, {
            state: { 
                name1: request.senderName, 
                name2: request.receiverName
            }
        });
    };

    const handleRedirectToReviewPage = () => {
        navigate(`/matches/${request.messageId}/rating`);
    };

    // 레슨 완료 버튼 누르면 레슨 완료 등록 후 리뷰 페이지로 이동
    const handleLessonComplete = () => {
        // 정말 완료 하시겠습니까?
        setConfirmModalMessage('레슨을 완료하시겠습니까?');
        setShowConfirmModal(true);
        setModalConfirmAction(() => processLessonComplete);
    };

    // 메시지 리스트를 클릭하면 요청 메시지 상세 내용 있는 모달 뜨도록함
    const handleMessageClick = (e) => {
        // 프로필 영역과 버튼 영역 클릭은 제외
        if (!e.target.closest(`.${styles.profileWithIndicator}`) &&
            !e.target.closest(`.${styles.actionButtons}`)) {
            setShowRequestDetail(true);
        }
    };

    return (
        <>
            <div key={request.messageId} className={styles.divForLine}>
                <div
                    className={styles.matchingMessageThumbnailWrapper}
                    onClick={handleMessageClick}
                >
                    <div className={styles.leftLayout}>
                        <div className={styles.profileWithIndicator} onClick={handleProfileClick}>
                            <ProfileCircle
                                size={'sm'}
                                src={request.profileImage}
                                username={request.senderName}
                            />
                        </div>

                        <div className={styles.messageContent}>
                            <div className={styles.messageHeader}>
                                {/* 내가 수신인이고 status가 N이면 빨간점으로 알람 */}
                                { request.status === 'N' && !isSender && <Dot className={styles.dot} size={14} color={'#ff0000'}/>}
                                <span className={styles.senderName}>{request.senderName}</span>
                                <span className={styles.sentDate}>
                                    {new Date(request.sentAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className={styles.requestSummary}>
                                <span className={styles.user}>{request.receiverName}</span>
                                <span>님, 제가</span>
                                <span className={`${styles.skillText} ${styles.give}`}>{request.talentGive}</span>
                                가르쳐 드릴게요.
                                <span className={`${styles.skillText} ${styles.want}`}>{request.talentTake}</span>
                                배우고 싶어요.
                            </p>
                        </div>
                    </div>



                    <div className={styles.actionButtons}>
                        {/* 펜딩, 거절, 완료 후 리뷰까지 담겼을  시에는 옆에 태그처럼 상태 보여주기 */}
                        { request.status === 'N' && isSender &&
                            <span className={`${styles.messageStatus} ${styles.pending}`}>대기 중</span>}
                        { request.status ===
                            'C' && <span className={`${styles.messageStatus} ${styles.accepted}`}>완료됨</span>}
                        { request.status ===
                            'D' && <span className={`${styles.messageStatus} ${styles.rejected}`}>거절됨</span>}

                        {/* matching status에 따라 버튼 보이게 */}
                        {/* 버튼 status가 n이고 남이 보낸 메시지일때만 보임 */}
                        {request.status === 'N' && isReceiver
                            ? (
                            <>
                                <Button
                                    theme={'blueTheme'}
                                    fontSize={'extrasmall'}
                                    onClick={showAcceptConfirmModal}
                                >수락하기
                                </Button>
                                <Button
                                    fontSize={'extrasmall'}
                                    onClick={showRejectConfirmModal}
                                >거절하기
                                </Button>
                            </>
                        ) : null}
                        {/* 버튼 status가 m일 때만 보임 */}
                        {request.status === 'M' && (
                            <>
                                <Button
                                    theme={'greenTheme'}
                                    fontSize={'extrasmall'}
                                    onClick={handleRedirectToChatRoom}
                                >채팅입장
                                </Button>
                                <Button
                                    fontSize={'extrasmall'}
                                    onClick={handleLessonComplete}
                                >레슨완료
                                </Button>
                            </>
                        )}
                        {/* 버튼 status가 r 일때만 보임*/}
                        {request.status === 'R' && (
                            <Button
                                fontSize={'extrasmall'}
                                onClick={handleRedirectToReviewPage}
                            >리뷰하기
                            </Button>
                        )}

                    </div>
                </div>
            </div>


            {/* 컨펌용 모달 */}
            {showConfirmModal && (
                <ConfirmModal
                    message={confirmModalMessage}
                    onConfirm={modalConfirmAction}
                    onClose={() => {
                        setShowConfirmModal(false);
                    }}
                />
            )}

            {/* 컨펌 모달에서 확인 누르면 처리 완료 알리는 모달 */}
            {showMiniModal && (
                <MiniAlert
                    message={miniModalMessage}
                    isNegative={isNegativeMiniModalMessage}
                    onClose={() => {
                        setShowMiniModal(false);
                        setShowConfirmModal(false);
                        setTimeout(() => {
                            setShowRequestDetail(false);
                        }, 1000);
                    }}
                />
            )}

            {/* 요청 상세 모달 */}
            {showRequestDetail && (
                <RequestDetailModal
                    request={request}
                    onClose={() => setShowRequestDetail(false)}
                    isSender={isSender}
                    isReceiver={isReceiver}
                    onAccept={processMatchAccept}
                    onReject={processMatchReject}
                    onChatEnter={handleRedirectToChatRoom}
                    onLessonComplete={processLessonComplete}
                    onReviewClick={handleRedirectToReviewPage}
                />
            )}

        </>
    );
};

export default MatchingMessageThumbnail;