import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, ChevronDown, ExternalLink } from "lucide-react";
import API_URL from "./config";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey! 👋 I'm the **AI Team Finder**. Type a skill or tech stack and I'll find matching teammates for you!\n\nTry: **React**, **Python**, **Machine Learning**, etc.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAuthHeaders = () => {
    const token =
      sessionStorage.getItem("token") || sessionStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/genai/recommend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: userMsg }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: data.reply,
            profiles: data.matchedProfiles || [],
            skills: data.extractedSkills || [],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Oops! Something went wrong. Please try again.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Connection error. Is the backend running?" },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like bold rendering
  const renderText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color: "#A259FF" }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Handle newlines
      return part.split("\n").map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {j > 0 && <br />}
          {line}
        </React.Fragment>
      ));
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #A259FF, #6C3FC7)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 24px rgba(162, 89, 255, 0.4)",
            zIndex: 9999,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0 6px 32px rgba(162, 89, 255, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 24px rgba(162, 89, 255, 0.4)";
          }}
          id="ai-assistant-toggle"
        >
          <Sparkles size={28} color="white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "400px",
            maxWidth: "calc(100vw - 48px)",
            height: "560px",
            maxHeight: "calc(100vh - 100px)",
            borderRadius: "16px",
            background: "#1A1A1A",
            border: "1px solid #333",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            overflow: "hidden",
          }}
          id="ai-assistant-window"
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #A259FF20, #1A1A1A)",
              borderBottom: "1px solid #333",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #A259FF, #6C3FC7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={18} color="white" />
              </div>
              <div>
                <div
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  AI Team Finder
                </div>
                <div style={{ color: "#888", fontSize: "11px" }}>
                  Powered by Gemini AI
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
                padding: "4px",
                display: "flex",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "14px 14px 4px 14px"
                        : "14px 14px 14px 4px",
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, #A259FF, #8B3EF2)"
                        : "#2A2A2A",
                    color: "white",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    wordBreak: "break-word",
                  }}
                >
                  {renderText(msg.text)}

                  {/* Show profile cards if any */}
                  {msg.profiles && msg.profiles.length > 0 && (
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {msg.profiles.slice(0, 5).map((profile, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            background: "#1A1A1A",
                            border: "1px solid #444",
                            borderRadius: "10px",
                            padding: "10px 12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg, #A259FF, #6C3FC7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "white",
                                flexShrink: 0,
                              }}
                            >
                              {profile.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 600,
                                  fontSize: "13px",
                                  color: "#fff",
                                }}
                              >
                                {profile.name}
                              </div>
                              <div style={{ fontSize: "10px", color: "#888" }}>
                                {profile.year || ""}
                                {profile.year && profile.roles?.length > 0
                                  ? " · "
                                  : ""}
                                {profile.roles?.slice(0, 2).join(", ") || ""}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                              marginTop: "6px",
                            }}
                          >
                            {profile.techStacks
                              ?.slice(0, 6)
                              .map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  style={{
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    fontSize: "10px",
                                    fontWeight: 500,
                                    background:
                                      profile.matchedSkills?.some(
                                        (ms) =>
                                          ms.toLowerCase() ===
                                          skill.toLowerCase()
                                      )
                                        ? "#A259FF30"
                                        : "#333",
                                    color:
                                      profile.matchedSkills?.some(
                                        (ms) =>
                                          ms.toLowerCase() ===
                                          skill.toLowerCase()
                                      )
                                        ? "#A259FF"
                                        : "#999",
                                    border: `1px solid ${
                                      profile.matchedSkills?.some(
                                        (ms) =>
                                          ms.toLowerCase() ===
                                          skill.toLowerCase()
                                      )
                                        ? "#A259FF50"
                                        : "#444"
                                    }`,
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: "14px 14px 14px 4px",
                    background: "#2A2A2A",
                    color: "#888",
                    fontSize: "13px",
                  }}
                >
                  <span className="animate-pulse">Searching profiles...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #333",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
              background: "#1A1A1A",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill... e.g. React, Python"
              disabled={loading}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #333",
                background: "#0D0D0D",
                color: "white",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#A259FF")}
              onBlur={(e) => (e.target.style.borderColor = "#333")}
              id="ai-chat-input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background:
                  loading || !input.trim()
                    ? "#333"
                    : "linear-gradient(135deg, #A259FF, #8B3EF2)",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "opacity 0.2s",
              }}
              id="ai-chat-send"
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
