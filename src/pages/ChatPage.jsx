import React, { useEffect, useReducer, useState } from "react";
import RtcRoom from "../components/ChatPage/RtcRoom";
import { Provider, useSelector } from "react-redux";
import { store } from "../store/index.js";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchRtcRoomId, fetchPostInfo } from "../services/rtcApi.js";
import styles from "./ChatPage.module.scss";
import ChatRoom from "../components/chat/ChatRoom.jsx";
import { CircleArrowRight } from "lucide-react";

const ChatPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { messageId } = useParams();
  const [roomId, setRoomId] = useState(null);
  const [isNew, setIsNew] = useState(null);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const location = useLocation();
  const user1 = location.state?.name1 || "알 수 없음";
  const user2 = location.state?.name2 || "알 수 없음";

  const navigate = useNavigate();

  console.log("messageId : ", messageId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRtcRoomId(messageId);
        console.log("data : ", data);
        setRoomId(data.roomId); // 상태에 데이터 저장
        setIsNew(data.new);
      } catch (error) {
        console.error("Error fetching RTC room ID:", error);
        setError(error); // 에러 상태 처리
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPostInfo(messageId);
        console.log("data2 : ", data);
        setPostData(data);
      } catch (error) {
        console.error("Error fetching RTC room ID:", error);
        setError(error); // 에러 상태 처리
      }
    };

    fetchData();
  }, [messageId]);

  // rtc 서버에 접근하는 이름은 abc@aaa.com 일때 abcaaa로 (영어/숫자로만 가능해서)
  const parts = user.email.split("@");
  const username = parts[0] + parts[1].split(".")[0];

  // roomId가 로딩 중이면 로딩 화면을 표시
  if (roomId === null && isNew === null && postData === null) {
    return <div>Loading...</div>; // roomId가 없을 때 로딩 표시
  }

  const handleClick = () => {
    if (postData && postData.postId) {
      // 그냥이동
      // navigate(`/exchanges/${postData.postId}`);

      // 새창열기
      window.open(
        `/exchanges/${postData.postId}`,
        "_blank",
        "width=800,height=600,noopener,noreferrer"
      );
    }
  };

  return (
    <>
      <Provider store={store}>
        {postData && (
          <div className={styles.linkBox}>
            <div className={styles.linkText}>
              <div className={styles.textContainer}>
                <div className={styles.writer}>{postData.writer} ({postData.talentTName})</div>
                <div>🔁</div>
                <div className={styles.sender}>{postData.sender} ({postData.talentGName})</div>
              </div>
                <div
                  onClick={() =>
                    window.open(`/exchanges/${postData.postId}`, "_blank")
                  }
                  className={styles.linkContainer}
                >
                  {`새 탭으로 열기`} <CircleArrowRight />
              </div>
            </div>
          </div>
        )}
        <div className={styles.wrap}>
          <div className={styles.videoContainer}>
            <RtcRoom roomCode={roomId} username={username} isNew={isNew} />
          </div>
          <div className={styles.chatContainer}>
            <ChatRoom user1={user1} user2={user2} />
          </div>
        </div>
      </Provider>
    </>
  );
};

export default ChatPage;
