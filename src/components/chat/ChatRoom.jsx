import React, { useState, useEffect } from "react";
import { connectWebSocket, sendMessage } from "./websocket";
import fetchWithAuth from "../../services/fetchWithAuth.js";
import { useSelector } from "react-redux";
import styles from "./ChatRoom.module.scss"; // SCSS 모듈 임포트

const ChatRoom = ({ otherUserName = "조아용2" }) => {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfiles, setUserProfiles] = useState({});

  const currentUserProfile = useSelector((state) => state.auth.user);
  const currentUserName = currentUserProfile.name;

  console.log(currentUserProfile)
  useEffect(() => {
    const initializeChatRoom = async () => {
      const sendData = {
        user1Name: currentUserName,
        user2Name: otherUserName,
      };
      try {
        const roomResponse = await fetchWithAuth("http://localhost:8999/api/joayong/chat/chatroom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendData),
        });
        if (!roomResponse.ok) throw new Error("Failed to create chat room");
        const { id, user1Id, user2Id } = await roomResponse.json();
        setRoomId(id);
        console.log("생성된 방번호: " + id);

        const profileResponse = await fetchWithAuth(
          `http://localhost:8999/api/joayong/user/profile/${otherUserName}`
        );
        if (!profileResponse.ok) throw new Error("Failed to load other user profile");
        const otherUserProfile = await profileResponse.json();

        setUserProfiles({
          [currentUserProfile.id]: {
            username: currentUserProfile.name,
            profileImageUrl: 'http://localhost:8999'+currentUserProfile.profileImageUrl,
          },
          [otherUserProfile.id]: {
            username: otherUserProfile.name,
            profileImageUrl: 'http://localhost:8999'+otherUserProfile.profileImageUrl,
          },
        });

        const historyResponse = await fetchWithAuth(
          `http://localhost:8999/api/joayong/chat/chatroom/${id}/history`
        );
        if (!historyResponse.ok) throw new Error("Failed to load chat history");
        const historyData = await historyResponse.json();
        setMessages(historyData);

        connectWebSocket(id, (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (error) {
        console.error("Failed to initialize chat room:", error);
      }
    };

    initializeChatRoom();
  }, [currentUserName, otherUserName, currentUserProfile]);

  const handleSend = () => {
    const message = { senderId: currentUserProfile.id, content: input };
    sendMessage(roomId, message);
    setInput("");
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList}>
        {messages.map((msg, idx) => {
          const sender = userProfiles[msg.senderId] || {
            username: "Unknown",
            profileImageUrl: null,
          };
          const isCurrentUser = msg.senderId === currentUserProfile.id;
          return (
            <div
              key={idx}
              className={`${styles.message} ${isCurrentUser ? styles.sent : styles.received}`}
            >
              <img
                src={sender.profileImageUrl || "src/assets/images/profile.png"}
                alt="profile"
                className={styles.profileImage}
              />
              <div className={styles.messageContent}>
                <span className={styles.username}>{sender.username}</span>
                <p className={styles.text}>{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSend} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;