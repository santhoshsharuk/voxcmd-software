
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { CommandPalette } from './components/CommandPalette';
import { useOrchestrator } from './hooks/useOrchestrator';
import type { View, Agent } from './types';
import { INITIAL_AGENTS } from './constants';
import NotificationToast from './components/NotificationToast';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);

  const { tasks, notifications, clearNotifications, handleUserCommand } = useOrchestrator();

  const toggleAgent = (agentName: string) => {
    setAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.name === agentName
          ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
          : agent
      )
    );
  };

  const openPalette = useCallback(() => setPaletteOpen(true), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ' ' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        openPalette();
      }
      if (event.key === 'Escape' && isPaletteOpen) {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaletteOpen, openPalette]);
  
  return (
    <div className="flex h-screen w-full bg-gray-900/50 backdrop-blur-xl font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        agents={agents.filter(a => ['LLM Agent', 'Voice Agent', 'Terminal Agent', 'Memory'].includes(a.name))}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <MainContent 
            view={currentView} 
            tasks={tasks}
            agents={agents}
            toggleAgent={toggleAgent}
            openPalette={openPalette}
          />
        </div>
      </main>
      {isPaletteOpen && (
        <CommandPalette 
          onClose={() => setPaletteOpen(false)}
          onCommand={handleUserCommand}
        />
      )}
      <div className="absolute top-4 right-4 z-50">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={() => clearNotifications(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
