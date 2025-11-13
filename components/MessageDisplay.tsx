
import React from 'react';
import { Message, Role } from '../types';

interface MessageDisplayProps {
  message: Message;
}

// Simple component to render code blocks with basic styling
const CodeBlock: React.FC<{ content: string, language: string }> = ({ content, language }) => (
    <div className="bg-gray-900 rounded-md my-2">
        <div className="text-xs text-gray-400 px-4 py-1 border-b border-gray-700">{language || 'code'}</div>
        <pre className="p-4 text-sm text-white overflow-x-auto">
            <code>{content}</code>
        </pre>
    </div>
);

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || '';
        const code = codeBlockMatch[2];
        return <CodeBlock key={index} content={code} language={language} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 3l-2.286 6.857L5 12l5.714 2.143L13 21l2.286-6.857L21 12l-5.714-2.143L13 3z"/></svg>
        </div>
      )}
      <div
        className={`max-w-xl p-4 rounded-lg prose prose-invert prose-p:my-0 prose-headings:my-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700'
        }`}
      >
        <div className="whitespace-pre-wrap">{renderContent(message.content)}</div>
      </div>
    </div>
  );
};

export default MessageDisplay;
