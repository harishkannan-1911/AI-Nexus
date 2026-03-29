import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { streamMessage } from "../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatWindow = ({ activeChat, updateChat }) => {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef(null);

  // 🛑 STOP
  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // 📋 COPY
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  // 📥 DOWNLOAD CHAT
  const downloadChat = () => {
    const text = activeChat.messages
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.txt";
    a.click();
  };

  // 🚀 SEND
  const handleSend = async () => {
    if (!input) return;

    const userMsg = { text: input, sender: "user" };
    const newMessages = [...activeChat.messages, userMsg];

    updateChat(newMessages);
    setInput("");
    setIsStreaming(true);

    let botText = "";

    updateChat([
      ...newMessages,
      { text: "", sender: "bot", loading: true },
    ]);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await streamMessage(
        input,
        (chunk) => {
          botText += chunk;

          updateChat([
            ...newMessages,
            { text: botText, sender: "bot" },
          ]);
        },
        controller.signal
      );
    } catch (err) {
      console.log("Stopped");
    }

    setIsStreaming(false);
  };

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h2>AI-NEXUS ⚡</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={downloadChat} style={styles.downloadBtn}>
            ⬇️
          </button>

          {isStreaming && (
            <button onClick={stopGeneration} style={styles.stopBtn}>
              🛑
            </button>
          )}
        </div>
      </div>

      {/* CHAT */}
      <div style={styles.chat}>
        {activeChat.messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
              alignItems: "center",
            }}
          >
            {msg.sender === "bot" && <span style={styles.avatar}>🤖</span>}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={msg.sender === "user" ? styles.userMsg : styles.botMsg}
            >
              {msg.loading ? (
                <TypingDots />
              ) : (
                <>
                  {/* 🔥 MARKDOWN RENDER */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

                        return !inline && match ? (
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(children)
                              }
                              style={styles.copyCodeBtn}
                            >
                              📋
                            </button>

                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code style={styles.inlineCode}>{children}</code>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>

                  {/* 📋 COPY MESSAGE */}
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => copyText(msg.text)}
                      style={styles.copyBtn}
                    >
                      📋
                    </button>
                  )}
                </>
              )}
            </motion.div>

            {msg.sender === "user" && <span style={styles.avatar}>🧑</span>}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Ask anything..."
        />

        <button onClick={handleSend} style={styles.sendBtn}>
          ➤
        </button>
      </div>
    </div>
  );
};

// 🔥 TYPING DOTS
const TypingDots = () => (
  <div style={{ display: "flex", gap: "5px" }}>
    <span style={styles.dot}></span>
    <span style={styles.dot}></span>
    <span style={styles.dot}></span>
  </div>
);

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
  },

  header: {
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #333",
  },

  stopBtn: {
    background: "#ff4d6d",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  },

  downloadBtn: {
    background: "#00f5c4",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  chat: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  userMsg: {
    background: "linear-gradient(135deg, #00f5c4, #00c9a7)",
    padding: "12px",
    borderRadius: "18px",
    maxWidth: "60%",
  },

  botMsg: {
    background: "rgba(255,255,255,0.08)",
    padding: "12px",
    borderRadius: "18px",
    maxWidth: "60%",
    position: "relative",
  },

  avatar: {
    margin: "0 8px",
  },

  copyBtn: {
    marginTop: "5px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#00f5c4",
  },

  copyCodeBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "#00f5c4",
    border: "none",
    borderRadius: "5px",
    padding: "5px",
    cursor: "pointer",
    fontSize: "12px",
  },

  inlineCode: {
    background: "#222",
    padding: "3px 6px",
    borderRadius: "5px",
  },

  dot: {
    width: "6px",
    height: "6px",
    background: "#00f5c4",
    borderRadius: "50%",
    animation: "blink 1s infinite",
  },

  inputBox: {
    display: "flex",
    padding: "15px",
    borderTop: "1px solid #333",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1f1f1f",
    color: "white",
  },

  sendBtn: {
    marginLeft: "10px",
    padding: "12px",
    borderRadius: "10px",
    background: "#00f5c4",
    border: "none",
    cursor: "pointer",
  },
};

export default ChatWindow;