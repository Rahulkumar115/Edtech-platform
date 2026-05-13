import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';

const FloatingAITutor = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize chat with a welcoming message
  const [messages, setMessages] = useState([
    { 
      role: 'model', 
      text: "👋 Hi there! I'm your Socratic AI Mentor. Looking for course roadmaps, concept explanations, or debugging help? Ask away!" 
    }
  ]);

  // Auto-scroll reference to always show the latest message
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Helper function to translate URL paths into clean context strings for Gemini
  const getPageContext = (path) => {
    if (path === '/') return "Platform Landing Page";
    if (path.includes('/dashboard')) return "Student Dashboard (Viewing enrolled courses)";
    if (path.includes('/student/course/')) return "Course Video Player Interface";
    return `Application Page: ${path}`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 1. Add user's message to the UI state instantly
    const userMsg = { role: 'user', text: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Format history strictly for Gemini SDK:
      // - Exclude the last message (it's sent as newQuestion)
      // - Filter out the initial model greeting so history strictly starts with the user
      const chatHistory = updatedMessages
        .slice(0, -1)
        .filter((m, index) => !(index === 0 && m.role === 'model'))
        .map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      // 3. Resolve dynamic context based on the exact page the student is currently viewing
      const currentPageContext = getPageContext(location.pathname);

      // 4. Make the API call to your local backend
      const res = await axios.post('http://localhost:5000/api/tutor/ask', {
        chatHistory,
        newQuestion: userMsg.text,
        courseTitle: currentPageContext,
        lectureTitle: "Global Platform Assistance"
      });

      // 5. Append the AI's response to the chat window
      setMessages(prev => [...prev, { role: 'model', text: res.data.reply }]);
    } catch (error) {
      console.error("Tutor API Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "⚠️ My connection timed out. If the server was asleep, it might take a moment to wake up. Please try sending your message again!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[480px] bg-[#1e1e2e] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 ease-out">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between text-white shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  Socratic AI Tutor <Sparkles size={12} className="text-yellow-300" />
                </h3>
                <p className="text-[10px] text-purple-100">Context-Aware & Always Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition text-purple-100 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Context Banner */}
          <div className="bg-[#0f1120] px-4 py-1.5 border-b border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Current view:</span>
            <span className="text-purple-400 font-medium truncate max-w-[200px]">
              {getPageContext(location.pathname).split('(')[0]}
            </span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1120]/60 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none shadow-sm' 
                    : 'bg-[#1e1e2e] text-gray-200 border border-gray-800 rounded-bl-none shadow-sm whitespace-pre-line'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1e1e2e] border border-gray-800 text-gray-400 p-3 rounded-xl rounded-bl-none text-xs flex items-center gap-2 animate-pulse">
                  <Bot size={14} className="text-purple-400" /> AI is analyzing context...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#1e1e2e] border-t border-gray-800 flex items-center gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 bg-[#0f1120] text-white placeholder-gray-500 text-sm px-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition flex items-center justify-center shadow-md active:scale-95"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-purple-400/30 group relative"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Subtle prompt bubble when closed */}
        {!isOpen && (
          <span className="absolute right-16 bg-[#1e1e2e] border border-gray-800 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1 font-medium">
            Ask AI Mentor ✨
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingAITutor;