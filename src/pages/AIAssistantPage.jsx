import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Bot, User, Trash2, Volume2, VolumeX,
  Mic, MicOff, Sparkles, Copy, Check, RefreshCw, AlertCircle, HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { chatService } from '../services/mockServices';

const QUICK_PROMPTS_EN = [
  { label: '💧 Wheat Irrigation Schedule', query: 'When should I irrigate wheat crop for optimal yield?' },
  { label: '🌿 Rice Blast Control', query: 'How to prevent and treat rice blast disease?' },
  { label: '🥔 Potato Blight Treatment', query: 'What is the recommended treatment for late blight in potato?' },
  { label: '🍅 Tomato Leaf Curl Virus', query: 'How to control whitefly and leaf curl in tomato?' },
  { label: '🌦️ Weather Advisory', query: 'What precautions should I take if heavy rain is forecast?' },
  { label: '💊 Balanced Fertilizer Dose', query: 'What is the recommended fertilizer schedule for wheat and potato?' },
  { label: '🏛️ PM-KISAN Help', query: 'How can I apply for PM-KISAN subsidy scheme and check eKYC?' },
];

const QUICK_PROMPTS_HI = [
  { label: '💧 गेहूं में सिंचाई का सही समय', query: 'गेहूं की फसल में सिंचाई कब और कितनी करनी चाहिए?' },
  { label: '🌾 धान में झुलसा/ब्लास्ट रोग', query: 'धान में झुलसा रोग (Blast) से बचाव के क्या उपाय हैं?' },
  { label: '🥔 आलू में झुलसा रोग', query: 'आलू में पछेती झुलसा का क्या रासायनिक उपचार है?' },
  { label: '🍅 टमाटर पत्ता मरोड़ रोग', query: 'टमाटर में पत्ता मरोड़ और सफेद मक्खी का इलाज बताएं' },
  { label: '🌦️ मौसम एवं बारिश की चेतावनी', query: 'भारी बारिश की चेतावनी में किसान क्या सावधानियां रखें?' },
  { label: '💊 खाद एवं उर्वरक संतुलन', query: 'फसलों में यूरिया, डीएपी और पोटाश डालने का सही नियम क्या है?' },
  { label: '🏛️ पीएम-किसान (PM-KISAN) सहायता', query: 'पीएम किसान योजना में ₹2000 की किस्त पाने के लिए क्या करना होगा?' },
];

export const AIAssistantPage = () => {
  const { showToast, settings } = useApp();
  const [language, setLanguage] = useState(settings?.language || 'en');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
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
          ? 'नमस्ते! मैं **FarmerFriend AI कृषि सलाहकार** हूँ।\n\nमैं फसल योजना, पादप रोग उपचार, संतुलित उर्वरक (यूरिया/डीएपी), सिंचाई प्रबंधन, मौसम संबंधी सावधानियों और सरकारी योजनाओं (जैसे PM-KISAN) में आपकी सहायता कर सकता हूँ।\n\nनीचे दिए गए किसी विषय पर क्लिक करें या अपना प्रश्न टाइप अथवा बोलकर पूछें।'
          : 'Hello! I am your **FarmerFriend AI Agricultural Advisor**.\n\nI can assist you with crop management, plant disease treatments, balanced fertilizer regimens (Urea/DAP/Potash), irrigation scheduling, weather precautions, and government schemes (PM-KISAN).\n\nAsk me any agricultural question or select a prompt below!',
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
      showToast('Error communicating with AI engine. Please retry.', 'error');
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
            ? 'बातचीत रीसेट हो गई है। आप अपनी फसल या खेती से जुड़ा कोई भी नया सवाल पूछ सकते हैं।'
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

    // Clean markdown characters for clear voice articulation
    const cleanText = text.replace(/[*_#•⚠️💡🌾💧🏛️🥔🍅💊🌦️🌱]/g, '').trim();
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

  // Real Web Speech API voice speech recognition
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported by your current browser. You can type your query.', 'warning');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        showToast(language === 'hi' ? 'माइक चालू है, बोलिए...' : 'Listening... Speak your farming question', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage(transcript);
          handleSendMessage(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showToast('Speech recognition encountered an issue. Please try typing.', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const quickPrompts = language === 'hi' ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  return (
    <div className="space-y-6 animate-fade-in">
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
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  Bilingual AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                24/7 intelligent farming guidance supporting English and हिन्दी
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
        {/* Status notice */}
        <div className="px-4 py-2.5 bg-primary-50/70 dark:bg-primary-950/40 border-b border-primary-100 dark:border-primary-900/30 flex items-center justify-between text-xs text-primary-800 dark:text-primary-300">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>AI Agronomic Engine active • Ask about diseases, fertilizers, irrigation, weather, or PM-KISAN</span>
          </div>
          <span className="hidden md:inline font-semibold text-[11px] bg-white/80 dark:bg-gray-800 px-2 py-0.5 rounded border border-primary-200 dark:border-primary-800">
            {language === 'hi' ? 'हिंदी मोड' : 'English Mode'}
          </span>
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.type === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isUser
                      ? 'bg-earth-600 text-white'
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
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-primary-600 transition-colors ml-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        </button>
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className="hover:text-primary-600 transition-colors"
                          title="Listen to response"
                        >
                          {isSpeaking && speakingId === msg.id ? (
                            <VolumeX size={13} className="text-red-500 animate-pulse" />
                          ) : (
                            <Volume2 size={13} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center text-gray-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-primary-700 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>{language === 'hi' ? 'कृषि AI सोच रहा है...' : 'AI is analyzing your farming query...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt pills */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-400 flex-shrink-0">
            {language === 'hi' ? 'सुझाव:' : 'Quick Prompts:'}
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.query)}
              disabled={isTyping}
              className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex-shrink-0 shadow-2xs"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-gray-200 dark:border-gray-700'
              }`}
              title={isListening ? 'Stop Listening' : (language === 'hi' ? 'बोलकर पूछें' : 'Voice Query')}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? (language === 'hi' ? 'सुन रहा हूँ... बोलिए' : 'Listening... Speak now')
                  : (language === 'hi'
                      ? 'अपनी फसल, रोग, खाद या मौसम के बारे में पूछें...'
                      : 'Ask about crops, diseases, fertilizers, irrigation, or schemes...')
              }
              disabled={isTyping}
              className="input flex-1 py-2.5 text-sm"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary p-2.5 rounded-xl disabled:opacity-40"
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
