
import { useState, useCallback } from 'react';
import type { Task, Notification, TaskStatus } from '../types';

export const useOrchestrator = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: Notification['type']) => {
    const id = `notif-${Date.now()}`;
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, result?: string) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, status, result } : t));
  }, []);

  const clearNotifications = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleUserCommand = useCallback((command: string) => {
    const rootTaskId = `task-${Date.now()}`;
    const initialTask: Task = {
      id: rootTaskId,
      goal: `User command: "${command}"`,
      status: 'running',
      agent: 'Orchestrator',
      createdAt: Date.now()
    };
    setTasks(prev => [initialTask, ...prev]);
    addNotification('Received command, thinking...', 'info');

    // Simulate Thinking
    setTimeout(() => {
      updateTaskStatus(rootTaskId, 'running', 'Decomposing task into a plan...');
      addNotification('Planning steps...', 'info');

      // Simulate Planning
      setTimeout(() => {
        const plan: Omit<Task, 'id' | 'createdAt' | 'status'>[] = [
          { goal: 'Analyze user intent', agent: 'LLM Agent', result: 'Intent: File Search & Summary' },
          { goal: 'Find relevant files', agent: 'File Finder', result: 'Searching for "Q3_report.pdf"...' },
          { goal: 'Extract key points', agent: 'LLM Agent', result: 'Reading file content...' },
          { goal: 'Generate final summary', agent: 'LLM Agent', result: 'Compiling summary...' }
        ];

        const subTasks: Task[] = plan.map((p, i) => ({
          ...p,
          id: `${rootTaskId}-${i}`,
          status: 'pending',
          createdAt: Date.now()
        }));

        setTasks(prev => prev.map(t => t.id === rootTaskId ? { ...t, subTasks, result: 'Plan created.' } : t));

        // Simulate Execution
        let delay = 0;
        subTasks.forEach((subTask, index) => {
          delay += 1000 + Math.random() * 1500;
          setTimeout(() => {
            setTasks(prev => prev.map(t => t.id === rootTaskId ? { ...t, subTasks: t.subTasks?.map(st => st.id === subTask.id ? {...st, status: 'running'} : st) } : t));
            
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1;
                const finalStatus: TaskStatus = isSuccess ? 'completed' : 'failed';
                const finalResult = isSuccess ? 'Done' : 'Error: File not found';
                 setTasks(prev => prev.map(t => t.id === rootTaskId ? { ...t, subTasks: t.subTasks?.map(st => st.id === subTask.id ? {...st, status: finalStatus, result: finalResult} : st) } : t));

                // Check if all subtasks are done
                if (index === subTasks.length - 1) {
                    setTimeout(() => {
                        const allSucceeded = tasks.find(t => t.id === rootTaskId)?.subTasks?.every(st => st.status === 'completed') ?? false;
                        updateTaskStatus(rootTaskId, allSucceeded ? 'completed' : 'failed', allSucceeded ? 'Task finished successfully.' : 'Task finished with errors.');
                        addNotification(allSucceeded ? 'Command executed successfully!' : 'Command failed!', allSucceeded ? 'success' : 'error');
                    }, 500);
                }

            }, 1000 + Math.random() * 1000);

          }, delay);
        });

      }, 1500);

    }, 1000);
  }, [addNotification, updateTaskStatus]);

  return { tasks, notifications, clearNotifications, handleUserCommand };
};
