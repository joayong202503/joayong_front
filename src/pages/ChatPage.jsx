import React, { useEffect, useReducer, useState } from "react";
import RtcRoom from "../components/ChatPage/RtcRoom";
import { Provider, useSelector } from "react-redux";
import { store } from "../store/index.js";
import { useParams } from "react-router-dom";
import { fetchRtcRoomId } from "../services/rtcApi.js";

const ChatPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { messageId } = useParams();
  const [roomId, setRoomId] = useState(null);
  const [error, setError] = useState(null);

  console.log("messageId : ", messageId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRtcRoomId(messageId);
        console.log("data : ", data);
        setRoomId(data);  // 상태에 데이터 저장
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
    if (roomId === null) {
      return <div>Loading...</div>;  // roomId가 없을 때 로딩 표시
    }

  return (
    <>
      <Provider store={store}>
        <div className="wrap">
          <div className="video-container">
            <RtcRoom roomCode={roomId} username={username} />
          </div>
          <div className="chat-container">{/* <Chat /> */}</div>
        </div>
      </Provider>
    </>
  );
};

export default ChatPage;
