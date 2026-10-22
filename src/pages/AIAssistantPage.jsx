import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Bot, User, Trash2, Volume2, VolumeX,
  Mic, Sparkles, Copy, Check, RefreshCw, AlertCircle, HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatService } from '../services/mockServices';

const QUICK_PROMPTS_EN = [
  { label: '💧 Irrigation Advice', query: 'When should I irrigate wheat crop for optimal yield?' },
  { label: '🌿 Disease Prevention', query: 'How to prevent and treat rice blast disease?' },
  { label: '🌦️ Weather Advisory', query: 'What precautions should I take if heavy rain is forecast?' },
  { label: '💊 Fertilizer Guide', query: 'What is the recommended fertilizer schedule for potato?' },
  { label: '🌱 Crop Sowing', query: 'When is the best sowing time for Rabi season crops?' },
  { label: '📜 PM-KISAN Help', query: 'How can I apply for PM-KISAN subsidy scheme?' },
];

const QUICK_PROMPTS_HI = [
  { label: '💧 सिंचाई सलाह', query: 'गेहूं की फसल में सिंचाई कब और कितनी करनी चाहिए?' },
  { label: '🌿 रोग नियंत्रण', query: 'धान में झुलसा रोग (Blast) से बचाव के क्या उपाय हैं?' },
  { label: '🌦️ मौसम सावधानी', query: 'भारी बारिश की चेतावनी में किसान क्या करें?' },
  { label: '💊 खाद और उर्वरक', query: 'आलू की बुवाई में कौन सी खाद डालनी चाहिए?' },
];

export const AIAssistantPage = () => {
  const { showToast, settings } = useApp();
  const [language, setLanguage] = useState(settings?.language || 'en');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize or load messages
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem('ff_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'msg-welcome',
        type: 'assistant',
        text: language === 'hi'
          ? 'नमस्ते! मैं **FarmerFriend AI सहायक** हूँ। मैं फसल योजना, रोग निवारण, मौसम सावधानियों और खाद-पानी से जुड़े आपके सवालों में मदद कर सकता हूँ। नीचे दिए गए किसी विषय पर क्लिक करें या अपना सवाल टाइप करें।'
          : 'Hello! I am your **FarmerFriend AI Assistant** (Demo Mode). I can assist you with crop planning, disease control, weather alerts, fertilizer guidance, and government schemes. Ask me anything or click a quick prompt below!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ff_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputMessage).trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      type: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatService.getResponse(text, language);
      const assistantMsg = {
        id: 'msg-' + (Date.now() + 1),
        type: 'assistant',
        text: response.data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      showToast('Error getting AI response. Please try again.', 'error');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initial = [
        {
          id: 'msg-welcome-reset',
          type: 'assistant',
          text: language === 'hi'
            ? 'बातचीत रीसेट हो गई है। आप नया सवाल पूछ सकते हैं।'
            : 'Conversation cleared. How can I assist you today with your farming?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(initial);
      localStorage.setItem('ff_chat_history', JSON.stringify(initial));
      showToast('Chat history cleared', 'info');
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech not supported in this browser', 'warning');
      return;
    }

    if (isSpeaking && speakingId === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown characters for speech
    const cleanText = text.replace(/[*_#•⚠️]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
    };

    setIsSpeaking(true);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleMicClick = () => {
    showToast('Voice input listening simulated (Demo Mode)', 'info');
    const sampleQueries = language === 'hi'
      ? ['धान में कौन सा उर्वरक डालें?', 'गेहूं में पानी कब लगाएं?', 'मौसम का हाल क्या है?']
      : ['How to control wheat rust?', 'Best time to irrigate crops?', 'Tell me about PM-KISAN benefits'];
    const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
    setInputMessage(randomQuery);
  };

  const quickPrompts = language === 'hi' ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-400">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Kisan AI Assistant
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Demo AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                24/7 intelligent farming guidance powered by agricultural knowledge base
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                language === 'hi'
                  ? 'bg-primary-700 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Clear chat button */}
          <button
            onClick={handleClearHistory}
            title="Clear Chat History"
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="card flex flex-col h-[calc(100vh-250px)] min-h-[520px] max-h-[750px] overflow-hidden border border-gray-200/80 dark:border-gray-800 shadow-card">
        {/* Chat disclaimer notice */}
        <div className="px-4 py-2.5 bg-primary-50/70 dark:bg-primary-950/40 border-b border-primary-100 dark:border-primary-900/30 flex items-center justify-between text-xs text-primary-800 dark:text-primary-300">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>Interactive farming advisor with simulated natural language responses.</span>
          </div>
          <span className="hidden md:inline font-medium text-[11px] bg-white/70 dark:bg-gray-800 px-2 py-0.5 rounded border border-primary-200 dark:border-primary-800">
            Offline Mock Engine
          </span>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.type === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-earth-500 text-white'
                      : 'bg-primary-700 text-white'
                  }`}
                >
                  {isUser ? <User size={18} /> : <Bot size={18} />}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-primary-700 text-white rounded-tr-none shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/60 dark:border-gray-700/60 shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line prose dark:prose-invert max-w-none text-sm">
                      {msg.text}
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div
                    className={`flex items-center gap-2 px-1 text-[11px] text-gray-400 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
                            speakingId === msg.id ? 'text-primary-600 font-bold' : ''
                          }`}
                          title={speakingId === msg.id ? 'Stop audio' : 'Listen with TTS'}
                        >
                          {speakingId === msg.id ? <VolumeX size={12} className="text-red-500" /> : <Volume2 size={12} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto max-w-[80%] animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-primary-700 text-white flex items-center justify-center flex-shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-200/60 dark:border-gray-700 flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-gray-400 ml-2 font-medium">Assistant is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50">
          <p className="text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
            <Sparkles size={12} className="text-primary-500" />
            {language === 'hi' ? 'त्वरित सुझाव:' : 'Quick Questions:'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={isTyping}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 border border-gray-200/60 dark:border-gray-700 transition-all flex-shrink-0 active:scale-95 disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMicClick}
              type="button"
              title="Voice Input (Demo)"
              className="p-2.5 rounded-xl text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0 border border-gray-200 dark:border-gray-700"
            >
              <Mic size={18} />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === 'hi'
                    ? 'खेती से संबंधित कोई भी सवाल पूछें...'
                    : 'Ask any farming, weather, disease, or crop question...'
                }
                disabled={isTyping}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-900 transition-all"
              />
              <span className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-white dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600">
                ↵ Enter
              </span>
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-3 rounded-xl bg-primary-700 hover:bg-primary-800 active:scale-95 text-white font-medium text-sm transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
