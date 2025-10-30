'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  toggleChat: () => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(
  undefined
);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-1',
      role: 'assistant',
      content:
        "👋 Hey there! I'm Vizit Bot, your AI assistant for learning algorithms! I can help you understand how algorithms work, explain complexity analysis, guide you through the Vizit platform, and answer any CS questions. What would you like to learn today?",
      timestamp: Date.now(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique ID with timestamp + random component + counter
  const generateUniqueId = useCallback(() => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const counter = Math.floor(Math.random() * 1000);
    return `msg-${timestamp}-${random}-${counter}`;
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const addMessage = useCallback(
    (role: 'user' | 'assistant', content: string) => {
      const newMessage: Message = {
        id: generateUniqueId(),
        role,
        content,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    [generateUniqueId]
  );

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const updatedMessages = [...prev];
      const lastIndex = updatedMessages.length - 1;
      if (updatedMessages[lastIndex].role === 'assistant') {
        updatedMessages[lastIndex] = {
          ...updatedMessages[lastIndex],
          content,
        };
      }
      return updatedMessages;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: generateUniqueId(),
        role: 'assistant',
        content:
          "👋 Chat cleared! I'm Vizit Bot, your AI assistant for learning algorithms. What would you like to learn today?",
        timestamp: Date.now(),
      },
    ]);
    setError(null);
  }, [generateUniqueId]);

  const value: ChatbotContextType = {
    messages,
    isOpen,
    isLoading,
    error,
    toggleChat,
    addMessage,
    updateLastMessage,
    clearMessages,
    setError,
    setIsLoading,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
