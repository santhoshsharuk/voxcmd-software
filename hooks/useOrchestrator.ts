import { useState, useCallback } from 'react';
import type { Task, Notification, TaskStatus } from '../types';
// FIX: Changed import to use package name instead of CDN URL.
import { GoogleGenAI, Type } from "@google/genai";
import { AGENT_NAMES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  const handleUserCommand = useCallback(async (command: string) => {
    const rootTaskId = `task-${Date.now()}`;
    const initialTask: Task = {
      id: rootTaskId,
      goal: `User command: "${command}"`,
      status: 'running',
      agent: 'Orchestrator',
      createdAt: Date.now(),
      result: 'Analyzing command...'
    };
    setTasks(prev => [initialTask, ...prev]);
    addNotification('Received command, thinking...', 'info');

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `User command: "${command}"`,
        config: {
          systemInstruction: `You are the orchestrator for VoxCMD, an AI-powered command center. Your role is to receive a user's command and break it down into a logical sequence of sub-tasks. For each sub-task, you must identify the goal and assign the most appropriate agent to execute it from the following list: ${AGENT_NAMES.join(', ')}. Your response must be a JSON array of objects, where each object has a 'goal' and an 'agent' property. Do not include any other text or explanation.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                goal: {
                  type: Type.STRING,
                  description: 'The specific sub-task to be performed.',
                },
                agent: {
                  type: Type.STRING,
                  description: `The best agent to perform this task. Must be one of: ${AGENT_NAMES.join(', ')}`,
                },
              },
              required: ['goal', 'agent'],
            },
          },
        },
      });

      addNotification('Plan generated, executing...', 'info');
      updateTaskStatus(rootTaskId, 'running', 'Decomposing task into a plan...');

      const plan: Omit<Task, 'id' | 'createdAt' | 'status'>[] = JSON.parse(response.text);

      const subTasks: Task[] = plan.map((p, i) => ({
        ...p,
        id: `${rootTaskId}-${i}`,
        status: 'pending',
        createdAt: Date.now()
      }));

      setTasks(prev => prev.map(t => t.id === rootTaskId ? { ...t, subTasks, result: 'Plan created successfully.' } : t));

      // Simulate Execution
      if (subTasks.length === 0) {
        updateTaskStatus(rootTaskId, 'completed', 'No sub-tasks needed. Done.');
        addNotification('Command executed successfully!', 'success');
        return;
      }
      
      let delay = 0;
      subTasks.forEach((subTask, index) => {
        delay += 1000 + Math.random() * 1500;
        setTimeout(() => {
          // FIX: Refactored state update to use a single map, which helps TypeScript's type inference.
          // The original find().map() combination was causing type-widening issues on the task status.
          setTasks(prev => prev.map(t => {
            if (t.id !== rootTaskId) return t;

            // FIX: Explicitly cast 'running' to TaskStatus to prevent type widening error.
            const updatedSubtasks = t.subTasks?.map(st => 
              st.id === subTask.id ? { ...st, status: 'running' as TaskStatus } : st
            );
            return { ...t, subTasks: updatedSubtasks };
          }));
          
          setTimeout(() => {
              const isSuccess = Math.random() > 0.1;
              const finalStatus: TaskStatus = isSuccess ? 'completed' : 'failed';
              const finalResult = isSuccess ? 'Done' : 'Error: Could not complete step';
              
              setTasks(prev => prev.map(t => {
                if (t.id !== rootTaskId) return t;
                
                const updatedSubtasks = t.subTasks?.map(st => st.id === subTask.id ? {...st, status: finalStatus, result: finalResult} : st);
                
                if (index === subTasks.length - 1) {
                    const allSucceeded = updatedSubtasks?.every(st => st.status === 'completed') ?? false;
                    const rootStatus: TaskStatus = allSucceeded ? 'completed' : 'failed';
                    const rootResult = allSucceeded ? 'Task finished successfully.' : 'Task finished with errors.';
                    
                    addNotification(allSucceeded ? 'Command executed successfully!' : 'Command failed!', allSucceeded ? 'success' : 'error');
                    
                    return { ...t, status: rootStatus, result: rootResult, subTasks: updatedSubtasks };
                }
                
                return { ...t, subTasks: updatedSubtasks };
              }));

          }, 1000 + Math.random() * 1000);

        }, delay);
      });

    } catch (error) {
      console.error("Error generating content:", error);
      updateTaskStatus(rootTaskId, 'failed', 'Failed to generate a plan from AI.');
      addNotification('Error: Could not process command.', 'error');
    }

  }, [addNotification, updateTaskStatus]);

  return { tasks, notifications, clearNotifications, handleUserCommand };
};