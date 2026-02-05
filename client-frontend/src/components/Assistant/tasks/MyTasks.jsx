import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMyAssignedTasks,
  fetchTodaysTasks,
  fetchDashboardStats,
  markTaskComplete,
  updateTaskData,
  clearError,
  clearMessage,
  updateTaskLocally,
  selectTasks,
  selectDashboardStats,
  selectTasksLoading,
  selectStatsLoading,
  selectLoading,
  selectError,
  selectMessage,
} from '../../../store/slices/assistantSlices/assistantTaskSlice.js';
import { 
  Clock, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  Briefcase,
  Play,
  Check,
  Plus,
  X,
  Filter
} from 'lucide-react';

const MyTasks = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const tasks = useSelector(selectTasks);
  const dashboardStats = useSelector(selectDashboardStats);
  const tasksLoading = useSelector(selectTasksLoading);
  const statsLoading = useSelector(selectStatsLoading);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const message = useSelector(selectMessage);

  // Local state
  const [currentView, setCurrentView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchMyAssignedTasks());
    dispatch(fetchTodaysTasks());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Handle error and success messages
  useEffect(() => {
    if (error) {
      console.error('Error:', error);
      setTimeout(() => dispatch(clearError()), 5000);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      console.log('Success:', message);
      setTimeout(() => dispatch(clearMessage()), 3000);
    }
  }, [message, dispatch]);

  const getDateCategory = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays <= 7) return 'This Week';
    if (diffDays <= 30) return 'This Month';
    return 'Later';
  };

  const groupTasks = (tasksToGroup) => {
    if (groupBy === 'none') return { 'All Tasks': tasksToGroup };
    if (groupBy === 'date') {
      const grouped = {};
      tasksToGroup.forEach(task => {
        const category = getDateCategory(task.dueDate);
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(task);
      });
      return grouped;
    }
    if (groupBy === 'priority') {
      const grouped = {};
      tasksToGroup.forEach(task => {
        if (!grouped[task.priority]) grouped[task.priority] = [];
        grouped[task.priority].push(task);
      });
      return grouped;
    }
    if (groupBy === 'status') {
      const grouped = {};
      tasksToGroup.forEach(task => {
        if (!grouped[task.status]) grouped[task.status] = [];
        grouped[task.status].push(task);
      });
      return grouped;
    }
    return { 'All Tasks': tasksToGroup };
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'Pending';
    if (filter === 'in-progress') return task.status === 'In Progress';
    if (filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const groupedTasks = groupTasks(filteredTasks);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      if (newStatus === 'Completed') {
        await dispatch(markTaskComplete(taskId)).unwrap();
      } else {
        await dispatch(updateTaskData({ 
          taskId, 
          taskData: { status: newStatus } 
        })).unwrap();
      }
      
      if (selectedTask && selectedTask._id === taskId) {
        const updatedTask = tasks.find(t => t._id === taskId);
        if (updatedTask) {
          setSelectedTask(updatedTask);
        }
      }
      
      dispatch(fetchMyAssignedTasks());
      dispatch(fetchDashboardStats());
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleUpdateTaskProgress = async (taskId, newProgress) => {
    try {
      dispatch(updateTaskLocally({ 
        taskId, 
        updates: { progress: newProgress } 
      }));

      await dispatch(updateTaskData({ 
        taskId, 
        taskData: { progress: newProgress } 
      })).unwrap();

      if (selectedTask && selectedTask._id === taskId) {
        setSelectedTask(prev => ({ ...prev, progress: newProgress }));
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      dispatch(fetchMyAssignedTasks());
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-800 bg-green-100';
      case 'In Progress': return 'text-blue-800 bg-blue-100';
      case 'Pending': return 'text-yellow-800 bg-yellow-100';
      default: return 'text-slate-800 bg-slate-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-700 bg-red-100';
      case 'High': return 'text-orange-700 bg-orange-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  const getTaskIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  if (tasksLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  const ErrorNotification = () => error && (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button onClick={() => dispatch(clearError())} className="ml-4">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const SuccessNotification = () => message && (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
      <div className="flex items-start">
        <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Success</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={() => dispatch(clearMessage())} className="ml-4">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <ErrorNotification />
        <SuccessNotification />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Task Management</h2>
              <p className="text-slate-600 mt-1">Manage and track all your legal tasks</p>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {dashboardStats?.tasks?.total || 0}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {dashboardStats?.tasks?.pending || 0}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-blue-700">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {tasks.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-green-700">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {dashboardStats?.tasks?.completed || 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filter:</span>
              </div>
              <div className="flex space-x-2">
                {['all', 'pending', 'in-progress', 'completed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === f 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              <div className="border-l pl-4 ml-2 flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">Group By:</span>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None</option>
                  <option value="date">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
              <div key={groupName}>
                {groupBy !== 'none' && (
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                    {groupName}
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      ({groupTasks.length})
                    </span>
                  </h3>
                )}
                
                <div className="space-y-3">
                  {groupTasks.map((task) => (
                    <div 
                      key={task._id} 
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer border border-slate-200"
                      onClick={() => {
                        setSelectedTask(task);
                        setCurrentView('view');
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          {getTaskIcon(task.status)}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">{task.title}</h3>
                            <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {task.assignedBy?.name || 'Unassigned'}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {task.caseId?.clientName || 'No client'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>

                      {task.status === 'In Progress' && task.progress !== undefined && (
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'view' && selectedTask) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <ErrorNotification />
        <SuccessNotification />
        
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentView('list')}
              className="mr-4 p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{selectedTask.title}</h2>
              <p className="text-slate-600">Case: {selectedTask.caseId?.caseNumber || 'N/A'}</p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedTask.status === 'Pending' && (
                <button
                  onClick={() => handleUpdateTaskStatus(selectedTask._id, 'In Progress')}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Task</span>
                </button>
              )}
              {selectedTask.status === 'In Progress' && (
                <button
                  onClick={() => handleUpdateTaskStatus(selectedTask._id, 'Completed')}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Task Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Description</label>
                    <p className="text-slate-900 mt-1">{selectedTask.description}</p>
                  </div>

                  {selectedTask.instructions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <label className="text-sm font-medium text-blue-900 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Instructions from {selectedTask.assignedBy?.name}
                      </label>
                      <p className="text-blue-800 mt-2">{selectedTask.instructions}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned By</label>
                      <p className="text-slate-900 mt-1">{selectedTask.assignedBy?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned To</label>
                      <p className="text-slate-900 mt-1">{selectedTask.assignedTo?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Client</label>
                      <p className="text-slate-900 mt-1">{selectedTask.caseId?.clientName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Case Number</label>
                      <p className="text-slate-900 mt-1">{selectedTask.caseId?.caseNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Due Date</label>
                      <p className="text-slate-900 mt-1">{new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned Date</label>
                      <p className="text-slate-900 mt-1">{new Date(selectedTask.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTask.status === 'In Progress' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Update Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Current Progress</span>
                        <span className="font-medium text-blue-600">{selectedTask.progress || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress || 0}
                        onChange={(e) => handleUpdateTaskProgress(selectedTask._id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedTask.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Priority</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <label className="text-sm font-medium text-slate-600 mb-2 block">Change Status</label>
                    <select
                      value={selectedTask.status}
                      onChange={(e) => handleUpdateTaskStatus(selectedTask._id, e.target.value)}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-50"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default MyTasks;