import React, { useState } from "react";
import { sendMessage } from "../services/api";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;

    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(input);

      const botMsg = {
        text: res.data.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("API ERROR:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", background: "#0f0f0f", height: "100vh" }}>
      <div>
        {messages.map((msg, i) => (
          <p key={i} style={{ color: msg.sender === "user" ? "cyan" : "white" }}>
            {msg.text}
          </p>
        ))}
        {loading && <p style={{ color: "yellow" }}>AI is thinking...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBox;