import React from 'react'
import RtcRoom from "../components/ChatPage/RtcRoom"
import { Provider, useSelector } from "react-redux";
import { store } from "../store/index.js";

const ChatPage = () => {

  const user = useSelector(state => state.auth.user);
  const roomId = 10001;

  // rtc 서버에 접근하는 이름은 abc@aaa.com 일때 abcaaa로 (영어/숫자로만 가능해서)
  const parts = user.email.split('@');
  const username = parts[0] + parts[1].split('.')[0];



  return (
    <>
      <Provider store={store}>
        <div className="wrap">
          <div className="video-container">
            <RtcRoom roomCode={roomId} username={username}/>
          </div>
          <div className="chat-container">
            {/* <Chat /> */}
          </div>
        </div>
      </Provider>
    </>
  )
}

export default ChatPage;