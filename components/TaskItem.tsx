import React from 'react';
import type { Task, TaskStatus } from '../types';
import { SpinnerIcon, CheckCircleIcon, XCircleIcon, PendingIcon, ChevronRightIcon } from './Icons';

const StatusIcon: React.FC<{ status: TaskStatus }> = ({ status }) => {
  switch (status) {
    case 'running':
      return <SpinnerIcon className="w-5 h-5 text-blue-400 animate-spin" />;
    case 'completed':
      return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    case 'failed':
      return <XCircleIcon className="w-5 h-5 text-red-400" />;
    case 'pending':
    default:
      return <PendingIcon className="w-5 h-5 text-gray-500" />;
  }
};

const TaskItem: React.FC<{ task: Task; isSubTask?: boolean }> = ({ task, isSubTask = false }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const hasSubTasks = task.subTasks && task.subTasks.length > 0;

  // The `isSubTask` prop is used to apply different styling for nested tasks.
  // Top-level tasks get a full card treatment, while sub-tasks are simpler.
  const containerClasses = isSubTask 
    ? "bg-gray-800/50"
    : "bg-gray-800/50 border border-gray-700/80 rounded-lg";

  return (
    <div className={containerClasses}>
      <div 
        className={`flex items-start p-3 ${hasSubTasks ? 'cursor-pointer hover:bg-gray-700/20' : ''}`}
        onClick={() => hasSubTasks && setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="mt-1 flex-shrink-0">
          <StatusIcon status={task.status} />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-center">
            <p className="font-medium text-gray-200">{task.goal}</p>
            <div className="flex items-center text-sm text-gray-400 ml-2">
               <span className="bg-gray-700/60 px-2 py-0.5 rounded text-xs mr-4 whitespace-nowrap">{task.agent}</span>
               {hasSubTasks && <ChevronRightIcon className={`w-4 h-4 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />}
            </div>
          </div>
          {task.result && <p className="text-sm text-gray-500 mt-1">{task.result}</p>}
        </div>
      </div>
      
      {/* If the task has sub-tasks and is expanded, they are rendered in an indented container with a vertical guide line. */}
      {hasSubTasks && isExpanded && (
        <div className="ml-5 pl-5 pt-1 pb-2 border-l-2 border-gray-700 space-y-2">
          {task.subTasks?.map(sub => (
            <TaskItem key={sub.id} task={sub} isSubTask={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskItem;