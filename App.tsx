
import React, { useState } from 'react';
import { AppMode } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERAL);

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white">
      <Sidebar currentMode={mode} setMode={setMode} />
      <main className="flex-1 flex flex-col h-screen">
        <ChatWindow mode={mode} key={mode} />
      </main>
    </div>
  );
};

export default App;
