import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [chats, setChats] = useState([{ id: 1, messages: [] }]);
  const [activeChat, setActiveChat] = useState(chats[0]);

  // 🔥 SIDEBAR TOGGLE (NEW)
  const [showSidebar, setShowSidebar] = useState(true);
  

  // ✅ UPDATE CHAT
  const updateChat = (messages) => {
    const updatedChats = chats.map((chat) =>
      chat.id === activeChat.id ? { ...chat, messages } : chat
    );

    setChats(updatedChats);
    setActiveChat({ ...activeChat, messages });
  };

  // 🔥 DELETE CHAT
  const deleteChat = () => {
    const newChat = { id: Date.now(), messages: [] };

    const updatedChats = chats.filter(
      (chat) => chat.id !== activeChat.id
    );

    setChats([newChat, ...updatedChats]);
    setActiveChat(newChat);
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>

      {/* ☰ SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#00f5c4",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* 🧠 SIDEBAR */}
      {showSidebar && (
        <Sidebar
          chats={chats}
          setChats={setChats}
          setActiveChat={setActiveChat}
        />
      )}

      {/* 💬 CHAT WINDOW */}
      <ChatWindow
        activeChat={activeChat}
        updateChat={updateChat}
        deleteChat={deleteChat}
      />
    </div>
  );
}

export default App;