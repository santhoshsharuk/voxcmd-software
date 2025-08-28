import React from 'react';
import type { Agent } from '../types';
import { AgentIcon } from './Icons';

interface AgentCardProps {
  agent: Agent;
  onToggle: (name: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onToggle }) => {
  const isActive = agent.status === 'active';

  return (
    <div className={`p-5 rounded-lg border transition-all duration-200 ${isActive ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-800/30 border-gray-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AgentIcon className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
          <h3 className="ml-3 font-semibold text-lg text-gray-200">{agent.name}</h3>
        </div>
        <label htmlFor={`toggle-${agent.name}`} className="flex items-center cursor-pointer">
          <div className="relative">
            {/* Fix: Replaced non-standard styled-jsx with Tailwind CSS peer variants to fix TypeScript error and handle toggle switch styling. */}
            <input 
              id={`toggle-${agent.name}`} 
              type="checkbox" 
              className="sr-only peer" 
              checked={isActive}
              onChange={() => onToggle(agent.name)}
            />
            <div className="block w-10 h-6 rounded-full bg-gray-600 peer-checked:bg-blue-600 transition-colors"></div>
            <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
      <p className="mt-3 text-sm text-gray-400 h-10">{agent.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {agent.capabilities.slice(0, 2).map(cap => (
          <span key={cap} className="px-2 py-1 text-xs bg-gray-700/50 text-gray-400 rounded-md">
            {cap}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AgentCard;