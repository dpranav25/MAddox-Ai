
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { AppMode, Message, Role, ModeConfig } from '../types';
import { createChatSession } from '../services/geminiService';
import MessageDisplay from './MessageDisplay';
import ChatIcon from './icons/ChatIcon';
import ProjectIcon from './icons/ProjectIcon';
import CodeIcon from './icons/CodeIcon';
import WriteIcon from './icons/WriteIcon';

interface ChatWindowProps {
  mode: AppMode;
}

const modeConfigs: Record<AppMode, ModeConfig> = {
  [AppMode.GENERAL]: {
    icon: ChatIcon,
    systemInstruction: "You are a helpful and knowledgeable AI assistant. Answer the user's questions clearly and concisely.",
    placeholder: "Ask me anything...",
  },
  [AppMode.PLANNER]: {
    icon: ProjectIcon,
    systemInstruction: "You are a world-class project management assistant. Help the user break down tasks, set timelines, and organize their projects. Respond in a structured format, using markdown for lists, tables, and headings.",
    placeholder: "Describe a project to plan...",
  },
  [AppMode.CODER]: {
    icon: CodeIcon,
    systemInstruction: "You are an expert programmer and code assistant. Provide clean, efficient, and well-explained code snippets. Use markdown code blocks with language identifiers.",
    placeholder: "What code do you need help with?",
  },
  [AppMode.WRITER]: {
    icon: WriteIcon,
    systemInstruction: "You are a creative writing assistant. Help the user brainstorm ideas, write stories, poems, or any other creative text. Be imaginative and inspiring.",
    placeholder: "What story do you want to write?",
  },
};

const ChatWindow: React.FC<ChatWindowProps> = ({ mode }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = modeConfigs[mode];

  useEffect(() => {
    const newChat = createChatSession(config.systemInstruction, []);
    setChat(newChat);
    setMessages([]);
  }, [mode, config.systemInstruction]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = useCallback(async (message: string) => {
    if (!chat || !message.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: Role.USER, content: message };
    setMessages((prev) => [...prev, userMessage]);
    
    try {
        const stream = await chat.sendMessageStream({ message });
        
        let modelResponse = '';
        setMessages((prev) => [...prev, { role: Role.MODEL, content: '' }]);

        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = modelResponse;
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
            ...prev,
            { role: Role.MODEL, content: "Sorry, something went wrong. Please try again." },
        ]);
    } finally {
        setIsLoading(false);
    }
  }, [chat]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const ModeIcon = config.icon;

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ModeIcon className="w-24 h-24 mb-4" />
            <h2 className="text-3xl font-bold text-gray-300">Nexus {mode}</h2>
            <p className="mt-2 text-lg">Start a conversation to get started.</p>
          </div>
        ) : (
          messages.map((msg, index) => <MessageDisplay key={index} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'Generating response...' : config.placeholder}
            disabled={isLoading}
            className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
