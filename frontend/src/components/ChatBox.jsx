import { useState, useRef, useEffect } from "react";
import api from "../services/api";

function formatMessageContent(text) {
    if (!text) return null;

    // Split text into paragraphs/blocks
    const lines = text.split("\n");
    const elements = [];
    let currentList = [];
    let listKey = 0;

    const parseInline = (str) => {
        // Handle bold **text** and *italic*
        const parts = [];
        let remaining = str;
        let key = 0;

        while (remaining.length > 0) {
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            if (boldMatch) {
                const index = boldMatch.index;
                if (index > 0) {
                    parts.push(<span key={key++}>{remaining.slice(0, index)}</span>);
                }
                parts.push(
                    <strong key={key++} className="font-semibold text-gray-900">
                        {boldMatch[1]}
                    </strong>
                );
                remaining = remaining.slice(index + boldMatch[0].length);
            } else {
                parts.push(<span key={key++}>{remaining}</span>);
                break;
            }
        }
        return parts;
    };

    const flushList = () => {
        if (currentList.length > 0) {
            elements.push(
                <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-1 my-2 text-gray-700">
                    {currentList.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">
                            {parseInline(item)}
                        </li>
                    ))}
                </ul>
            );
            currentList = [];
        }
    };

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith("### ")) {
            flushList();
            elements.push(
                <h4 key={idx} className="text-base font-bold text-gray-900 mt-3 mb-1">
                    {trimmed.replace(/^###\s+/, "")}
                </h4>
            );
        } else if (trimmed.startsWith("## ")) {
            flushList();
            elements.push(
                <h3 key={idx} className="text-lg font-bold text-blue-900 mt-4 mb-1">
                    {trimmed.replace(/^##\s+/, "")}
                </h3>
            );
        } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            const content = trimmed.replace(/^[\*\-]\s+/, "");
            currentList.push(content);
        } else if (/^\d+\.\s+/.test(trimmed)) {
            flushList();
            const content = trimmed.replace(/^\d+\.\s+/, "");
            elements.push(
                <div key={idx} className="flex items-start gap-2 my-1 text-gray-800">
                    <span className="font-bold text-blue-600">{trimmed.match(/^\d+\./)[0]}</span>
                    <span>{parseInline(content)}</span>
                </div>
            );
        } else if (trimmed === "***" || trimmed === "---") {
            flushList();
            elements.push(<hr key={idx} className="my-3 border-gray-200" />);
        } else if (trimmed.length > 0) {
            flushList();
            elements.push(
                <p key={idx} className="my-1.5 leading-relaxed text-gray-800">
                    {parseInline(trimmed)}
                </p>
            );
        } else {
            flushList();
        }
    });

    flushList();
    return elements;
}

function ChatBox({ documentText = "", fileName = "" }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I am your AI Contract Assistant. Ask me anything about this contract, such as key clauses, obligations, risks, payment terms, or termination rules.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (messageToSend) => {
        const text = typeof messageToSend === "string" ? messageToSend : input;
        if (!text || !text.trim() || loading) return;

        const userMessage = {
            role: "user",
            content: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        const updatedHistory = [...messages, userMessage];
        setMessages(updatedHistory);
        setInput("");
        setLoading(true);

        try {
            // Build history payload for API
            const historyPayload = updatedHistory
                .filter(m => m.role === "user" || m.role === "assistant")
                .map(m => ({ role: m.role, content: m.content }));

            const response = await api.post("/chat", {
                message: text.trim(),
                document_text: documentText || "",
                history: historyPayload
            });

            const assistantReply = response.data?.reply || "I apologize, but I could not generate a response. Please try again.";

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: assistantReply,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        } catch (err) {
            console.error("Chat error:", err);
            const errorMsg = err.response?.data?.detail || "Sorry, there was an error processing your question. Please check backend connection.";
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: `⚠️ ${errorMsg}`,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                role: "assistant",
                content: documentText
                    ? `Chat history reset. Ask me anything about ${fileName ? `"${fileName}"` : "the uploaded contract"}!`
                    : "Chat history reset. How can I help you with contract analysis today?",
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            }
        ]);
    };

    const handleCopy = (content, index) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const suggestedQuestions = [
        "What are the main risks in this contract?",
        "What are the payment terms and deadlines?",
        "Explain the termination and breach conditions.",
        "What are the key responsibilities of each party?"
    ];

    const hasDocument = Boolean(documentText && documentText.trim().length > 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-8 border border-gray-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-md shadow-blue-200">
                        💬
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            AI Contract Chat Assistant
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {hasDocument ? (
                                <span className="text-blue-700 font-medium">
                                    📄 Context: {fileName ? fileName : "Active Document Loaded"}
                                </span>
                            ) : (
                                <span>🌐 General Legal & Contract Q&A Mode (Upload a document for contract-specific insights)</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                        onClick={handleClearChat}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        title="Clear conversation"
                    >
                        🔄 Reset Chat
                    </button>
                </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="py-3 flex flex-wrap items-center gap-2 border-b border-gray-50">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
                    Suggestions:
                </span>
                {suggestedQuestions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => handleSend(q)}
                        disabled={loading}
                        className="text-xs bg-blue-50/80 hover:bg-blue-100 text-blue-800 hover:text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200/60 transition-all text-left cursor-pointer disabled:opacity-50"
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto my-4 pr-2 space-y-4">
                {messages.map((msg, index) => {
                    const isUser = msg.role === "user";
                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                        >
                            {!isUser && (
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0 shadow-sm mt-0.5">
                                    🤖
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                                    isUser
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs"
                                        : "bg-gray-50/90 border border-gray-200 text-gray-800 rounded-tl-xs"
                                }`}
                            >
                                <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1">
                                    <span className={`text-xs font-semibold ${isUser ? "text-blue-100" : "text-gray-500"}`}>
                                        {isUser ? "You" : "Legal Assistant"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] ${isUser ? "text-blue-200" : "text-gray-400"}`}>
                                            {msg.time}
                                        </span>
                                        {!isUser && (
                                            <button
                                                onClick={() => handleCopy(msg.content, index)}
                                                className="text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer"
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === index ? "✓ Copied" : "📋 Copy"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={`text-sm ${isUser ? "text-white" : "text-gray-800"}`}>
                                    {isUser ? msg.content : formatMessageContent(msg.content)}
                                </div>
                            </div>

                            {isUser && (
                                <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center text-sm shrink-0 shadow-sm mt-0.5">
                                    👤
                                </div>
                            )}
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shrink-0 shadow-sm animate-pulse">
                            🤖
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                <span>AI is analyzing and formulating response</span>
                                <span className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        hasDocument
                            ? `Ask a question about "${fileName || "this contract"}" (e.g. "What is the termination clause?")...`
                            : "Ask a general legal/contract question or upload a document..."
                    }
                    disabled={loading}
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <span>Send</span>
                    <span>➤</span>
                </button>
            </div>
        </div>
    );
}

export default ChatBox;
