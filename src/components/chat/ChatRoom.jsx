import React, { useState, useEffect, useRef } from "react";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "./websocket";
import fetchWithAuth from "../../services/fetchWithAuth.js";
import { useSelector } from "react-redux";
import styles from "./ChatRoom.module.scss";
import { API_URL } from "../../services/api.js";
import profilePlaceholder from "../../assets/images/profile.png";

const ChatRoom = ({ user1, user2 }) => {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userProfiles, setUserProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const wsClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const isInitialRender = useRef(true);

  const currentUserProfile = useSelector((state) => state.auth.user);
  const currentUserName = currentUserProfile.name;
  const otherUserName = user1 === currentUserName ? user2 : user1;

  useEffect(() => {
    if (messageListRef.current) {
      if (isInitialRender.current) {
        messageListRef.current.scrollTop = 0;
        isInitialRender.current = false;
      } else if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [messages]);

  useEffect(() => {
    const initializeChatRoom = async () => {
      try {
        setIsLoading(true);

        const sendData = { user1Name: currentUserName, user2Name: otherUserName };
        const roomResponse = await fetchWithAuth(`${API_URL}/api/joayong/chat/chatroom`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendData),
        });
        if (!roomResponse.ok) throw new Error("Failed to create chat room");
        const { id } = await roomResponse.json();
        setRoomId(id);

        const profileResponse = await fetchWithAuth(
          `${API_URL}/api/joayong/user/profile/${otherUserName}`
        );
        if (!profileResponse.ok) throw new Error("Failed to load other user profile");
        const otherUserProfile = await profileResponse.json();

        const newUserProfiles = {
          [currentUserProfile.id]: {
            username: currentUserProfile.name,
            profileImageUrl: currentUserProfile.profileImageUrl
              ? `${API_URL}${currentUserProfile.profileImageUrl}`
              : profilePlaceholder,
          },
          [otherUserProfile.id]: {
            username: otherUserProfile.name,
            profileImageUrl: otherUserProfile.profileImageUrl
              ? `${API_URL}${otherUserProfile.profileImageUrl}`
              : profilePlaceholder,
          },
        };
        setUserProfiles(newUserProfiles);

        const historyResponse = await fetchWithAuth(
          `${API_URL}/api/joayong/chat/chatroom/${id}/history`
        );
        if (!historyResponse.ok) throw new Error("Failed to load chat history");
        const historyData = await historyResponse.json();
        setMessages(historyData);

        if (!wsClientRef.current) {
          wsClientRef.current = connectWebSocket(id, (msg) => {
            setMessages((prev) => [...prev, msg]);
          });
        }
      } catch (error) {
        console.error("Failed to initialize chat room:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChatRoom();

    return () => {
      if (wsClientRef.current) {
        disconnectWebSocket();
        wsClientRef.current = null;
      }
    };
  }, [currentUserName, otherUserName]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    const message = { senderId: currentUserProfile.id, content: input };
    sendMessage(roomId, message);
    setInput("");
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>{otherUserName}님과의 채팅</h3>
      </div>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((msg, idx) => {
          const sender = userProfiles[msg.senderId] || {
            username: "Unknown",
            profileImageUrl: profilePlaceholder,
          };
          const isCurrentUser = msg.senderId === currentUserProfile.id;
          return (
            <div
              key={idx}
              className={`${styles.message} ${isCurrentUser ? styles.sent : styles.received}`}
            >
              <img
                src={sender.profileImageUrl}
                alt={`${sender.username}의 프로필 이미지`}
                className={styles.profileImage}
                onError={(e) => {
                  e.target.src = profilePlaceholder;
                }}
              />
              <div className={styles.messageContent}>
                <span className={styles.username}>{sender.username}</span>
                <p className={styles.text}>
                  {msg.content}{" "}
                  <span className={styles.timestamp}>
                    {new Date(msg.sentAt).toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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