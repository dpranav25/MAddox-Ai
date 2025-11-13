
import React from 'react';
import { AppMode } from '../types';
import ChatIcon from './icons/ChatIcon';
import ProjectIcon from './icons/ProjectIcon';
import CodeIcon from './icons/CodeIcon';
import WriteIcon from './icons/WriteIcon';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: AppMode;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode }) => {
  const navItems = [
    { mode: AppMode.GENERAL, icon: <ChatIcon className="w-6 h-6" />, label: 'General' },
    { mode: AppMode.PLANNER, icon: <ProjectIcon className="w-6 h-6" />, label: 'Planner' },
    { mode: AppMode.CODER, icon: <CodeIcon className="w-6 h-6" />, label: 'Coder' },
    { mode: AppMode.WRITER, icon: <WriteIcon className="w-6 h-6" />, label: 'Writer' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
        </div>
        <h1 className="text-xl font-bold ml-3">Nexus AI</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.mode}
            icon={item.icon}
            label={item.mode}
            isActive={currentMode === item.mode}
            onClick={() => setMode(item.mode)}
          />
        ))}
      </nav>
      <div className="mt-auto text-center text-gray-500 text-xs">
        <p>Powered by Gemini</p>
        <p>&copy; 2024</p>
      </div>
    </aside>
  );
};

export default Sidebar;
