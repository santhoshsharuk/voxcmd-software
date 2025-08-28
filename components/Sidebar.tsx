
import React from 'react';
import type { View, Agent, AgentStatus } from '../types';
import { HomeIcon, TimelineIcon, AgentIcon, SettingsIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  agents: Agent[];
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, currentView, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      currentView === view
        ? 'bg-blue-600/20 text-blue-300'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const AgentStatusIndicator: React.FC<{ status: AgentStatus }> = ({ status }) => {
    const color = {
        active: 'bg-green-500',
        inactive: 'bg-gray-500',
        error: 'bg-red-500'
    }[status];
    return <span className={`w-2 h-2 rounded-full ${color}`}></span>;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, agents }) => {
  return (
    <aside className="w-64 bg-gray-900/70 border-r border-gray-800 p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
        <h1 className="ml-3 text-xl font-bold text-white">VoxCMD</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem view="home" label="Home" icon={<HomeIcon className="w-5 h-5" />} currentView={currentView} onClick={setCurrentView} />
        <NavItem view="timeline" label="Timeline" icon={<TimelineIcon className="w-5 h-5" />} currentView={currentView} onClick={setCurrentView} />
        <NavItem view="agents" label="Agent Center" icon={<AgentIcon className="w-5 h-5" />} currentView={currentView} onClick={setCurrentView} />
        <NavItem view="settings" label="Settings" icon={<SettingsIcon className="w-5 h-5" />} currentView={currentView} onClick={setCurrentView} />
      </nav>
      <div className="mt-auto">
        <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Core Agents</h2>
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.name} className="flex items-center justify-between text-sm px-4">
              <span className="text-gray-300">{agent.name}</span>
              <AgentStatusIndicator status={agent.status} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
