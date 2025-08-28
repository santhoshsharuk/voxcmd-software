
import React from 'react';
import type { View, Task, Agent } from '../types';
import { QUICK_ACTIONS } from '../constants';
import { AskIcon, LaunchIcon, FindIcon, CreateIcon, FocusIcon, ReminderIcon } from './Icons';
import TaskItem from './TaskItem';
import AgentCard from './AgentCard';


interface MainContentProps {
  view: View;
  tasks: Task[];
  agents: Agent[];
  toggleAgent: (agentName: string) => void;
  openPalette: () => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  ask: <AskIcon className="w-6 h-6" />,
  launch: <LaunchIcon className="w-6 h-6" />,
  find: <FindIcon className="w-6 h-6" />,
  create: <CreateIcon className="w-6 h-6" />,
  focus: <FocusIcon className="w-6 h-6" />,
  reminder: <ReminderIcon className="w-6 h-6" />,
};

const HomeView: React.FC<{ openPalette: () => void }> = ({ openPalette }) => (
  <div>
    <h1 className="text-4xl font-bold text-white">Welcome to VoxCMD</h1>
    <p className="mt-2 text-lg text-gray-400">Your AI-powered command center. Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded-md">Ctrl+Space</kbd> to start.</p>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {QUICK_ACTIONS.map((qa) => (
        <button key={qa.title} onClick={openPalette} className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700/80 rounded-lg p-4 text-left transition-all duration-200 hover:border-blue-500/50 hover:scale-[1.02]">
          <div className="flex items-start">
            <div className="p-2 bg-gray-700/50 rounded-md text-blue-400">
              {iconMap[qa.icon]}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-200">{qa.title}</h3>
              <p className="text-sm text-gray-400 mt-1">e.g., "{qa.action}"</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const TimelineView: React.FC<{ tasks: Task[] }> = ({ tasks }) => (
  <div>
    <h1 className="text-3xl font-bold text-white mb-6">Task Timeline</h1>
    {tasks.length === 0 ? (
      <p className="text-gray-400">No tasks have been run yet. Press Ctrl+Space to start.</p>
    ) : (
      <div className="space-y-4">
        {tasks.map(task => <TaskItem key={task.id} task={task} />)}
      </div>
    )}
  </div>
);

const AgentCenterView: React.FC<{ agents: Agent[], toggleAgent: (name: string) => void }> = ({ agents, toggleAgent }) => (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Agent Center</h1>
      <p className="text-gray-400 mb-8">Enable, disable, and configure your agents.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => <AgentCard key={agent.name} agent={agent} onToggle={toggleAgent} />)}
      </div>
    </div>
);

const SettingsView: React.FC = () => (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
      <p className="text-gray-400">Configuration options will be available here.</p>
    </div>
);


export const MainContent: React.FC<MainContentProps> = ({ view, tasks, agents, toggleAgent, openPalette }) => {
  switch (view) {
    case 'home':
      return <HomeView openPalette={openPalette} />;
    case 'timeline':
      return <TimelineView tasks={tasks} />;
    case 'agents':
        return <AgentCenterView agents={agents} toggleAgent={toggleAgent} />;
    case 'settings':
        return <SettingsView />;
    default:
      return <HomeView openPalette={openPalette} />;
  }
};
