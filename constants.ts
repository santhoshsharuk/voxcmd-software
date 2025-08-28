
import type { Agent } from './types';

export const INITIAL_AGENTS: Agent[] = [
  { name: 'Orchestrator', description: 'Core AI Logic', status: 'active', capabilities: ['task_routing', 'state_management'] },
  { name: 'Think Agent', description: 'Task decomposition and planning', status: 'active', capabilities: ['planning', 'decomposition'] },
  { name: 'LLM Agent', description: 'Pluggable large language model', status: 'active', capabilities: ['text_generation', 'reasoning'] },
  { name: 'Memory', description: 'Short & long-term memory', status: 'active', capabilities: ['recall', 'remember'] },
  { name: 'Voice Agent', description: 'STT and TTS processing', status: 'active', capabilities: ['speech_to_text', 'text_to_speech'] },
  { name: 'Terminal Agent', description: 'Sandboxed command execution', status: 'inactive', capabilities: ['exec', 'read_stdout'] },
  { name: 'App Launcher', description: 'Finds and opens applications', status: 'active', capabilities: ['launch_app'] },
  { name: 'File Finder', description: 'Locates files on the system', status: 'active', capabilities: ['find_file'] },
  { name: 'Log & Report Agent', description: 'Traces and logs every run', status: 'active', capabilities: ['logging', 'reporting'] },
  { name: 'Focus Mode', description: 'Manages focus timers', status: 'inactive', capabilities: ['timer_start', 'dnd_toggle'] },
  { name: 'Water Reminder', description: 'Sends hydration notifications', status: 'inactive', capabilities: ['schedule_notification'] },
  { name: 'Reminder Agent', description: 'Manages personal reminders', status: 'inactive', capabilities: ['set_reminder', 'list_reminders'] },
  { name: 'Calendar Agent', description: 'Interacts with calendar events', status: 'inactive', capabilities: ['read_events', 'create_event'] },
  { name: 'Weather Agent', description: 'Fetches weather information', status: 'inactive', capabilities: ['get_forecast'] },
];

export const AGENT_NAMES = INITIAL_AGENTS.map(a => a.name);

export const QUICK_ACTIONS = [
    { title: 'Ask a question', action: 'Ask "What is the capital of France?"', icon: 'ask' },
    { title: 'Launch an app', action: 'Launch VS Code', icon: 'launch' },
    { title: 'Find a file', action: 'Find my presentation slides', icon: 'find' },
    { title: 'Create a project', action: 'Create a new React project called "my-app"', icon: 'create' },
    { title: 'Start Focus Timer', action: 'Focus for 25 minutes', icon: 'focus' },
    { title: 'Set a reminder', action: 'Remind me to call John in 1 hour', icon: 'reminder' }
];