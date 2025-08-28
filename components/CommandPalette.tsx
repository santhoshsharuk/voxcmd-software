
import React, { useState, useEffect, useRef } from 'react';
import { MicIcon, SearchIcon } from './Icons';

interface CommandPaletteProps {
  onClose: () => void;
  onCommand: (command: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, onCommand }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onCommand(inputValue.trim());
      setInputValue('');
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex justify-center pt-24"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-gray-800/80 border border-gray-700 rounded-xl shadow-2xl h-min"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center p-2">
            <SearchIcon className="h-6 w-6 mx-3 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask, launch, find, create..."
              className="w-full bg-transparent text-lg text-gray-100 placeholder-gray-500 focus:outline-none py-3"
            />
            <button type="button" className="p-3 text-gray-400 hover:text-white rounded-lg transition-colors">
              <MicIcon className="h-6 w-6" />
            </button>
          </div>
        </form>
         <div className="border-t border-gray-700 p-3 text-xs text-gray-500">
           Pro Tip: Use natural language. Try "Create a new note titled 'Meeting Ideas'".
         </div>
      </div>
    </div>
  );
};
