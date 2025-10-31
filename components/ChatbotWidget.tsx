'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { useTheme } from '../contexts/ThemeContext';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatbotWidget() {
  const {
    messages,
    isOpen,
    toggleChat,
    addMessage,
    updateLastMessage,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearMessages,
  } = useChatbot();
  const { resolvedTheme } = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDarkMode = resolvedTheme === 'dark';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Create placeholder message for streaming
    addMessage('assistant', '');

    try {
      // Send to API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response reader available');
      }

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                setError(data.error);
                toast.error('Failed to get response from AI');
                return;
              }
              
              if (data.text) {
                accumulatedText += data.text;
                // Update the last assistant message with accumulated text
                updateLastMessage(accumulatedText);
              }
              
              if (data.done) {
                setIsLoading(false);
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      
      console.log('Streaming failed, trying non-streaming fallback');
      
      // Try non-streaming fallback
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.message) {
            updateLastMessage(data.message);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback failed too
      }
      
      setError(errorMessage);
      toast.error('Failed to send message');
      updateLastMessage(
        `Oops! Something went wrong: ${errorMessage}. Please check if your Gemini API key is configured correctly.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Widget Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDarkMode
            ? 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white focus:ring-blue-500 focus:ring-offset-slate-900 shadow-blue-500/50'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-blue-400 focus:ring-offset-white shadow-purple-400/50'
        } animate-pulse-gentle`}
        title={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Popup */}
      <div
        className={`fixed bottom-24 right-6 z-40 transition-all duration-300 ease-out transform origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 pointer-events-auto'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`w-96 h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border ${
            isDarkMode
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700'
              : 'bg-gradient-to-b from-white to-slate-50 border-gray-200'
          }`}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${
              isDarkMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-slate-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                <h3 className="text-white font-bold text-lg">Vizit Bot</h3>
              </div>
              <button
                onClick={clearMessages}
                className="text-white/80 hover:text-white transition-colors duration-200 text-xs px-2 py-1 rounded hover:bg-white/10"
                title="Clear chat"
              >
                Clear
              </button>
            </div>
            <p className="text-white/80 text-xs mt-1">
              Learn algorithms with AI guidance
            </p>
          </div>

          {/* Messages Container */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 ${
              isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50/50'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in slide-in-from-bottom-2 fade-in duration-300`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm leading-relaxed break-words ${
                    msg.role === 'user'
                      ? isDarkMode
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-blue-500 text-white rounded-br-none'
                      : isDarkMode
                      ? 'bg-slate-700 text-slate-100 rounded-bl-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 fade-in duration-300">
                <div
                  className={`px-4 py-3 rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 text-slate-100'
                      : 'bg-gray-200 text-gray-800'
                  } rounded-bl-none`}
                >
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-xs border border-red-500/30">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            className={`px-4 py-3 border-t ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 text-white placeholder-slate-400 focus:ring-blue-500'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-400'
                }`}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white focus:ring-blue-500 focus:ring-offset-slate-800'
                    : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white focus:ring-blue-400 focus:ring-offset-white'
                } disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer */}
          <div
            className={`px-4 py-2 text-center border-t text-xs ${
              isDarkMode
                ? 'bg-slate-900/50 border-slate-700 text-slate-400'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            💡 Powered by Google Gemini • Ask about algorithms & CS concepts
          </div>
        </div>
      </div>
    </>
  );
}
