import React, { useState, useRef, useEffect } from 'react';
import './chatbot.css';
import { ChatbotService } from 'frontend/services';

// Pick your favorites!
const chatbotLogoGif = 'https://cdn.dribbble.com/userupload/32122583/file/original-400827bdf243931c8ffd26a268a837ce.gif';  // Cute pulsing one (image 1 above)

const loadingGif = 'https://loading.io/assets/mod/spinner/default/lg.gif';  // Bouncing balls (recommended)

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    type?: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "👋 Hi! I'm your intelligent assistant. I can help you with your tasks, account information, and more. Type 'help' to see what I can do!",
            sender: 'bot',
            timestamp: new Date(),
            type: 'greeting',
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chatbotService = new ChatbotService();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const formatResponse = (text: string) => {
        let formatted = text;

        // Bold **text**
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br/>');

        return formatted;
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setIsTyping(true);

        try {
            const response = await chatbotService.sendQuery(inputValue);

            setIsTyping(false);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data?.response || 'Sorry, I could not process your request.',
                sender: 'bot',
                timestamp: new Date(),
                type: response.data?.type,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setIsTyping(false);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Oops! Something went wrong. Please make sure you are logged in and try again.',
                sender: 'bot',
                timestamp: new Date(),
                type: 'error',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickActions = [
        { label: '📊 My Tasks', query: 'Show me my tasks' },
        { label: '✅ Completed', query: 'Show completed tasks' },
        { label: '⏳ Pending', query: 'Show pending tasks' },
        { label: '❓ Help', query: 'help' },
    ];

    const handleQuickAction = (query: string) => {
        setInputValue(query);
        setTimeout(() => handleSendMessage(), 100);
    };

    return (
        <>
            {/* Chatbot Button */}
            <div
                className={`chatbot-button ${isOpen ? 'active' : ''}`}
                onClick={toggleChatbot}
                title="Chat with AI Assistant"
            >
                <div className="chatbot-button-inner">
                    <img src={chatbotLogoGif} alt="Chatbot" className="chatbot-logo" />
                    {!isOpen && <span className="pulse-ring"></span>}
                </div>
                {!isOpen && (
                    <div className="chat-badge">
                        <span>Ask me anything!</span>
                    </div>
                )}
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-left">
                            <img
                                src={chatbotLogoGif}
                                alt="Chatbot"
                                className="chatbot-header-logo"
                            />
                            <div className="chatbot-header-info">
                                <h3>AI Assistant</h3>
                                <span className="status">
                                    <span className="status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button
                            className="chatbot-close"
                            onClick={toggleChatbot}
                            title="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Quick Actions */}
                    {messages.length <= 1 && (
                        <div className="quick-actions">
                            <p className="quick-actions-label">Quick actions:</p>
                            <div className="quick-actions-grid">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className="quick-action-btn"
                                        onClick={() => handleQuickAction(action.query)}
                                        disabled={isLoading}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                            >
                                {message.sender === 'bot' && (
                                    <img
                                        src={chatbotLogoGif}
                                        alt="Bot"
                                        className="message-avatar"
                                    />
                                )}
                                <div className="message-content">
                                    <div
                                        className="message-text"
                                        dangerouslySetInnerHTML={{
                                            __html: formatResponse(message.text),
                                        }}
                                    />
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="message bot-message typing-indicator">
                                <img
                                    src={chatbotLogoGif}
                                    alt="Bot"
                                    className="message-avatar"
                                />
                                <div className="message-content">
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Spinner */}
                        {isLoading && !isTyping && (
                            <div className="loading-container">
                                <img
                                    src={loadingGif}
                                    alt="Loading"
                                    className="loading-gif"
                                />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="chatbot-input-container">
                        <div className="chatbot-input-wrapper">
                            <input
                                ref={inputRef}
                                type="text"
                                className="chatbot-input"
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />
                            <button
                                className="chatbot-send-btn"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                title="Send message"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;