import React, { useState } from "react";

const Sidebar = ({ chats, setChats, setActiveChat }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [search, setSearch] = useState("");

  // 🆕 CREATE CHAT
  const createNewChat = () => {
    const newChat = { id: Date.now(), messages: [], pinned: false };
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  // 🗑 DELETE CHAT
  const deleteChat = (id) => {
    const updated = chats.filter((chat) => chat.id !== id);
    setChats(updated);
    if (updated.length > 0) setActiveChat(updated[0]);
  };

  // 📌 PIN CHAT
  const togglePin = (id) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
    );

    // 🔥 pinned chats first
    updated.sort((a, b) => b.pinned - a.pinned);

    setChats(updated);
  };

  // 🔍 SEARCH FILTER
  const filteredChats = chats.filter((chat) =>
    chat.messages.some((msg) =>
      msg.text.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div style={styles.sidebar}>
      
      {/* ➕ NEW CHAT */}
      <button onClick={createNewChat} style={styles.newBtn}>
        + New Chat
      </button>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.searchInput}
      />

      {/* 📂 CHAT LIST */}
      {(search ? filteredChats : chats).map((chat) => (
        <div key={chat.id} style={styles.chatItem}>
          
          {/* 💬 CHAT TITLE */}
          <div
            onClick={() => setActiveChat(chat)}
            style={styles.chatText}
          >
            {chat.pinned ? "📌 " : ""}Chat {chat.id}
          </div>

          {/* ⋮ MENU */}
          <div style={styles.menuWrapper}>
            <button
              onClick={() =>
                setMenuOpen(menuOpen === chat.id ? null : chat.id)
              }
              style={styles.menuBtn}
            >
              ⋮
            </button>

            {menuOpen === chat.id && (
              <div style={styles.dropdown}>
                
                {/* 📌 PIN */}
                <div
                  style={styles.option}
                  onClick={() => togglePin(chat.id)}
                >
                  {chat.pinned ? "❌ Unpin" : "📌 Pin"}
                </div>

                {/* 🗑 DELETE */}
                <div
                  style={styles.option}
                  onClick={() => deleteChat(chat.id)}
                >
                  🗑 Delete
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  sidebar: {
    width: "260px",
    background: "#0f0f0f",
    color: "white",
    padding: "10px",
    overflowY: "auto",
  },

  newBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#00f5c4",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  searchInput: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: "#1f1f1f",
    color: "white",
  },

  chatItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #222",
  },

  chatText: {
    cursor: "pointer",
    flex: 1,
    fontSize: "14px",
  },

  menuWrapper: {
    position: "relative",
  },

  menuBtn: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
  },

  dropdown: {
    position: "absolute",
    right: 0,
    top: "25px",
    background: "#1f1f1f",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.5)",
    zIndex: 10,
  },

  option: {
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #333",
  },
};

export default Sidebar;