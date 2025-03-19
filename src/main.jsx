import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 스타일 적용

const root = document.getElementById("root");

// #root가 존재하는지 확인
if (!root) {
  console.error("Error: #root element not found!");
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
