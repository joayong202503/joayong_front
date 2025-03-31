import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectWebSocket = (roomId, onMessageReceived) => {
  if (stompClient?.connected) {
    console.log("ℹ️ WebSocket already connected. Subscribing to room:", roomId);
    stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
      const msg = JSON.parse(message.body);
      console.log("📩 Received message:", msg);
      onMessageReceived(msg);
    });
    return stompClient;
  }

  console.log("🔄 Opening WebSocket connection to http://localhost:8999/ws...");
  const socket = new SockJS("http://3.34.211.202:8999/ws", null, {
    timeout: 10000, // 타임아웃 10초 설정
    debug: true,    // SockJS 내부 디버깅 활성화
  });

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log("🔍 STOMP Debug:", str), // STOMP 디버깅 로그
  });

  // SockJS 이벤트 핸들러 추가
  socket.onopen = () => console.log("🔗 SockJS socket opened");
  socket.onclose = (event) => console.error("🔒 SockJS socket closed:", event.code, event.reason);
  socket.onerror = (error) => console.error("🚨 SockJS socket error:", error);

  stompClient.onConnect = (frame) => {
    console.log("✅ WebSocket connected successfully. Frame:", frame);
    stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
      const msg = JSON.parse(message.body);
      console.log("📩 Received message from /topic/chat/" + roomId + ":", msg);
      onMessageReceived(msg);
    });
  };

  stompClient.onWebSocketClose = (event) => {
    console.error("🔒 WebSocket closed:", event.code, event.reason);
    console.log("ℹ️ WebSocket close event details:", event);
  };

  stompClient.onStompError = (frame) => {
    console.error("🚨 STOMP error occurred:", frame);
    console.log("🔍 STOMP error headers:", frame.headers);
    console.log("🔍 STOMP error body:", frame.body);
  };

  stompClient.onWebSocketError = (error) => {
    console.error("🚨 WebSocket error:", error);
  };

  console.log("🔄 Activating STOMP client...");
  stompClient.activate();
  return stompClient;
};

export const sendMessage = (roomId, message) => {
  if (stompClient?.connected) {
    console.log("📤 Sending message to /app/chat.send/" + roomId + ":", message);
    stompClient.publish({
      destination: `/app/chat.send/${roomId}`,
      body: JSON.stringify(message),
    });
  } else {
    console.error("❌ Cannot send message: WebSocket is not connected");
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    console.log("🔄 Deactivating WebSocket...");
    stompClient.deactivate().then(() => {
      console.log("❎ WebSocket disconnected successfully");
      stompClient = null;
    }).catch((error) => {
      console.error("🚨 Error during WebSocket disconnection:", error);
    });
  } else {
    console.log("ℹ️ No active WebSocket connection to disconnect");
  }
};

export const sendEnterMessage = (roomId, senderName) => {
  console.log("eeeeeee");
  
  if (stompClient?.connected) {
    const message = {
      roomId: roomId,
      senderName: senderName,
      content: `${senderName}님이 입장하셨습니다.`,
    };

    console.log("🔹 Sending enter message:", message); // 디버깅 로그 추가
    stompClient.publish({
      destination: `/app/chat.enter/${roomId}`,
      body: JSON.stringify(message),
    });
  }
};