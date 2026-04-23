import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { chatService } from "../services/apiService";
import "../styles/chat.css";
import BackgroundEffects from "../components/BackgroundEffects";
import { useNavigate, useLocation } from "react-router-dom";
import { Paperclip, Sun, Moon, Phone, Sparkles } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { motion } from "framer-motion";
import { useCollabCore } from "../context/CollabCoreContext";

export default function ChatPage() {
    const { user } = useAuth();
    const { setHasUnreadMessages } = useCollabCore();
    const { callUser } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // UI State
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        setHasUnreadMessages(false);
    }, [setHasUnreadMessages]);

    // Refs
    const scrollRef = useRef();
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch My Chats
    const fetchChats = async () => {
        try {
            const data = await chatService.fetchChats();
            setChats(data);
        } catch (error) {
            console.error("Failed to load chats", error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const data = await chatService.fetchMessages(selectedChat._id);
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    // AI: Enhance Text (Coming Soon)
    const handleEnhanceText = () => {
        alert("AI Text Enhancement is coming soon! ✨");
    };

    // Send Message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const contentToSend = newMessage;
            setNewMessage("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }

            const data = await chatService.sendMessage(contentToSend, selectedChat._id);
            setMessages([...messages, data]);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleInput = (e) => {
        const value = e.target.value;
        setNewMessage(value);

        // Auto-expand
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }

    const handleFileUpload = () => {
        alert("File Sharing feature is coming soon! 📎");
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    useEffect(() => {
        const init = async () => {
            await fetchChats();
        };
        init();
    }, [user]);

    useEffect(() => {
        const initMessages = async () => {
            await fetchMessages();
        };
        initMessages();
        // Polling for simple real-time effect (every 3s)
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedChat]);


    // Cleanup triggers when chat changes
    useEffect(() => {
        setShowGrowthPathCTA(false);
    }, [selectedChat]);

    // Browser Back Interception to Analytical Dashboard
    useEffect(() => {
        if (!user) return;

        // Push a state into historical stack to catch the back action
        window.history.pushState(null, null, window.location.pathname);

        const handlePopState = (event) => {
            const role = user.role?.toLowerCase();
            const dashboardPath = role === 'influencer' ? '/influencer/overview' : '/brand/overview';

            // Using window.location.replace for a hard redirect to the correct "Analytical Dashboard"
            // This ensures we break out of any potential routing loops or conflicting component-level redirects
            window.location.replace(dashboardPath);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [user]);

    // Helpers to get other user name
    const getSender = (loggedUser, users) => {
        if (!users || users.length < 2) return "Unknown User";
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };

    const getSenderId = (loggedUser, users) => {
        if (!users || users.length < 2) return null;
        return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
    };

    const getSenderImg = (loggedUser, users) => {
        if (!users || users.length < 2) return "https://via.placeholder.com/150";
        return users[0]._id === loggedUser._id ? users[1].profileImg : users[0].profileImg;
    };

    return (
        <div className={`chat-page-container ${isDarkMode ? "dark-theme" : "light-theme"}`}>
            <BackgroundEffects />
            <BackgroundEffects />


            {/* Overlay Gradient */}
            <div className="chat-overlay">
                <div className={`chat-window ${selectedChat ? 'mobile-chat-active' : ''}`}>

                    {/* SIDEBAR (LIST View) */}
                    <div className={`chat-sidebar ${selectedChat ? 'mobile-hidden' : ''}`}>
                        <div className="sidebar-header">
                            <h2>Chats</h2>
                        </div>

                        <div className="chat-list">
                            {chats.map((chat) => (
                                <div
                                    key={chat._id}
                                    className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <img
                                        src={getSenderImg(user, chat.users) || "https://via.placeholder.com/150"}
                                        alt="usr"
                                        className="chat-avatar"
                                    />
                                    <div className="chat-info">
                                        <div className="chat-name">{getSender(user, chat.users)}</div>
                                        <div className="chat-last-msg">
                                            {chat.latestMessage ? (
                                                chat.latestMessage.content.length > 30
                                                    ? chat.latestMessage.content.substring(0, 30) + "..."
                                                    : chat.latestMessage.content
                                            ) : "Start chatting..."}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CHAT AREA (Window View) */}
                    <div className={`chat-main ${!selectedChat ? 'mobile-hidden' : ''}`}>
                        {!selectedChat ? (
                            <div className="welcome-screen">
                                <h1 className="welcome-title">Welcome, {user?.name}</h1>
                                <p className="welcome-quote">"Collaboration is the key to unlocking potential."</p>
                                <div className="start-prompt">Select a chat to start messaging</div>
                            </div>
                        ) : (
                            <>
                                <div className="chat-header">
                                    <div className="header-left">
                                        <img
                                            src={getSenderImg(user, selectedChat.users) || "https://via.placeholder.com/150"}
                                            alt="Current"
                                            className="header-avatar"
                                        />
                                        <div className="header-details">
                                            <h3>{getSender(user, selectedChat.users)}</h3>
                                        </div>

                                        {/* Call Button */}
                                        <button
                                            className="icon-btn highlight-call-btn"
                                            title="Start Voice Call"
                                            onClick={() => {
                                                const targetId = getSenderId(user, selectedChat.users);
                                                const targetName = getSender(user, selectedChat.users);
                                                const targetPic = getSenderImg(user, selectedChat.users);

                                                // Find the actual user object to get details
                                                const targetUser = selectedChat.users.find(u => u._id !== user._id);
                                                const targetContext = {
                                                    role: targetUser?.role || "User",
                                                    isVerified: targetUser?.isVerified || false,
                                                    matchScore: selectedChat.matchScore || null
                                                };

                                                if (targetId) {
                                                    callUser(targetId, targetName, targetPic, targetContext);
                                                }
                                            }}
                                            style={{ marginLeft: 'auto', marginRight: '10px' }}
                                        >
                                            <Phone size={20} />
                                        </button>
                                    </div>

                                    {/* Toggle Check */}
                                    <button
                                        className="theme-toggle-btn"
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        title="Toggle Theme"
                                    >
                                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                                    </button>
                                </div>

                                <div className="messages-box">
                                    {messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`message-row ${m.sender._id === user._id ? "my-message" : "other-message"}`}
                                        >
                                            <div className="message-bubble">
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef}></div>
                                </div>

                                <div className="input-area-container">
                                    <div className="input-area-wrapper">
                                        {/* File Upload Icon */}
                                        <button
                                            className="icon-btn upload-btn"
                                            title="Upload File"
                                            onClick={handleFileUpload}
                                        >
                                            <Paperclip size={20} />
                                        </button>

                                        {/* Magic Sparkles Enhance */}
                                        <button
                                            className={`icon-btn magic-btn ${isThinking ? "thinking" : ""}`}
                                            title="Enhance Text w/ AI"
                                            onClick={handleEnhanceText}
                                            disabled={!newMessage.trim()}
                                        >
                                            <Sparkles size={20} color={newMessage.trim() ? "#8b5cf6" : "currentColor"} />
                                        </button>

                                        {/* Auto-expanding Input */}
                                        <textarea
                                            ref={textareaRef}
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={handleInput}
                                            onKeyDown={handleKeyDown}
                                            rows={1}
                                            className="chat-textarea"
                                        />

                                        {/* Send Button */}
                                        <button className="icon-btn send-btn" onClick={sendMessage}>➤</button>
                                    </div>

                                    <button
                                        className="the-end-btn"
                                        onClick={() => navigate('/collab-conclusion', { state: { chatId: selectedChat._id } })}
                                    >
                                        The END
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}





