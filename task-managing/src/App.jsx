import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Play, Pause, RotateCcw, X, Target } from 'lucide-react';

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTimer, setActiveTimer] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle task timers
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTimer) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === activeTimer
              ? { ...task, timeSpent: (task.timeSpent || 0) + 1 }
              : task
          )
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a task');
      return;
    }
    
    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      timeSpent: 0,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    if (activeTimer === id) {
      setActiveTimer(null);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (activeTimer === id) {
      setActiveTimer(null);
    }
  };

  const toggleTimer = (id) => {
    if (activeTimer === id) {
      setActiveTimer(null);
    } else {
      setActiveTimer(id);
    }
  };

  const resetTimer = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, timeSpent: 0 } : task
    ));
    if (activeTimer === id) {
      setActiveTimer(null);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
  const activeTask = tasks.find(task => task.id === activeTimer);

  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800 mb-2">Task Manager</h1>
              <p className="text-slate-600">Organize your work efficiently</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-medium text-slate-700">
                {formatCurrentTime()}
              </div>
              <div className="text-slate-500 text-sm">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-700">{tasks.filter(t => !t.completed).length}</div>
              <div className="text-sm text-slate-500">Active Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-700">{completedCount}</div>
              <div className="text-sm text-slate-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-700">{formatTime(totalTimeSpent)}</div>
              <div className="text-sm text-slate-500">Time Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-slate-700">
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-slate-500">Progress</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {totalCount > 0 && (
            <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
              <div 
                className="bg-slate-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>
          )}
          
          {/* Active Timer */}
          {activeTask && (
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"></div>
                  <span className="text-slate-600 font-medium">Working on:</span>
                  <span className="text-slate-800 font-semibold">{activeTask.text}</span>
                </div>
                <div className="text-xl font-mono font-semibold text-slate-700">
                  {formatTime(activeTask.timeSpent || 0)}
                </div>
              </div>
            </div>
          )}
          
          {/* Add Task Input */}
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a new task..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
          {tasks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Target size={24} className="text-slate-400" />
              </div>
              <h3 className="text-slate-600 text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-slate-500">Create your first task to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors duration-200 ${
                    task.completed ? 'opacity-60' : ''
                  } ${activeTimer === task.id ? 'bg-slate-50 border-l-4 border-slate-600' : ''}`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
                  >
                    {task.completed ? (
                      <CheckCircle2 size={24} className="text-slate-600" />
                    ) : (
                      <Circle size={24} className="text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div
                      className={`text-lg cursor-pointer select-none transition-colors duration-200 ${
                        task.completed
                          ? 'text-slate-500 line-through'
                          : 'text-slate-800 hover:text-slate-600'
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.text}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatTime(task.timeSpent || 0)}</span>
                      </div>
                      <span>Created {task.createdAt?.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!task.completed && (
                      <>
                        <button
                          onClick={() => toggleTimer(task.id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            activeTimer === task.id
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {activeTimer === task.id ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                        
                        <button
                          onClick={() => resetTimer(task.id)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors duration-200"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}