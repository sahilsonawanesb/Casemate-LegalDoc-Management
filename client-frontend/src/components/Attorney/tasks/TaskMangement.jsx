import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Eye,
  Edit,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  Trash2,
  Paperclip,
  X
} from 'lucide-react';
import {
  fetchAllTasks,
  fetchTaskById,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
  clearSelectedTask,
  clearError,
  selectAllTasks,
  selectSelectedTask,
  selectTasksLoading,
  selectTasksError,
  selectTotalCount
} from '../../../store/slices/taskSlice';
import { fetchCases } from '../../../store/slices/caseSlice';
import { fetchAllTeamMembers, selectAllTeamMembers } from '../../../store/slices/teamSlice';

const TasksManagement = () => {
  const dispatch = useDispatch();
    const teamMembers = useSelector(selectAllTeamMembers);
  
  // Redux state
  const tasks = useSelector(selectAllTasks);
  const selectedTask = useSelector(selectSelectedTask);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const totalCount = useSelector(selectTotalCount);
  
  // Local state
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseId: '',
    taskType: 'Other',
    priority: 'Medium',
    dueDate: '',
    dueTime: '',
    reminderEnabled: false,
    reminderDate: '',
    location: '',
    notes: '',
    tags: '',
    assignedTo: ''
  });

const taskTypes = [
    'Court Appearance',
    'Filing Deadline',
    'Client Meeting',
    'Document Review',
    'Research',
    'Follow-up',
    'Phone Call',
    'Email',
    'Discovery',
    'Deposition',
    'Settlement Meeting',
    'Other'
];

const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];

const statusOptions = [
    'Pending', 
    'In progress',
    'Completed', 
    'Cancelled', 
    'Over due'
];
  // Fetch tasks and cases on mount
  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchCases());
    dispatch(fetchAllTeamMembers());
  }, [dispatch]);

  // Fetch cases from Redux
  const { list: cases } = useSelector(state => state.cases);

  // Show notification for errors
  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTasks = React.useMemo(() => {
    if (!tasks || !Array.isArray(tasks)) return [];
    
    return tasks.filter(task => {
      const matchesSearch = 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterStatus, filterPriority]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate) {
      showNotification('Title and Due Date are required', 'error');
      return;
    }

    try {
      const taskData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        assignedTo : formData.assignedTo || undefined,
        caseId : formData.caseId || undefined
      };
      

      // remove undefined values..
      Object.keys(taskData).forEach(key => 
        taskData[key] === undefined && delete taskData[key]
      );

      await dispatch(createNewTask(taskData)).unwrap();
      showNotification('Task created successfully', 'success');
      setFormData({
        title: '',
        description: '',
        caseId: '',
        taskType: 'Other',
        priority: 'Medium',
        dueDate: '',
        dueTime: '',
        reminderEnabled: false,
        reminderDate: '',
        location: '',
        notes: '',
        tags: '',
        assignedTo: ''
      });
      setCurrentView('list');
    } catch (error) {
      showNotification(error || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    
    try {
      const taskData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        assignedTo : formData.assignedTo || undefined,
        caseId : formData.caseId || undefined
      };

      // Remove undefined values..
      Object.keys(taskData).forEach(key => 
        taskData[key] === undefined && delete taskData[key]
      );
      
      await dispatch(updateExistingTask({ 
        id: selectedTask._id, 
        taskData 
      })).unwrap();
      
      showNotification('Task updated successfully', 'success');
      setCurrentView('view');
    } catch (err) {
      showNotification(err || 'Failed to update task', 'error');
    }
  };

  const startEdit = (task) => {
    setFormData({
      title: task.title || '',
      description: task.description || '',
      caseId: task.caseId?._id || '',
      taskType: task.taskType || 'Other',
      priority: task.priority || 'Medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      dueTime: task.dueTime || '',
      reminderEnabled: task.reminderEnabled || false,
      reminderDate: task.reminderDate ? new Date(task.reminderDate).toISOString().split('T')[0] : '',
      location: task.location || '',
      notes: task.notes || '',
      tags: task.tags ? task.tags.join(', ') : '',
      assignedTo: task.assignedTo || ''
    });
    setCurrentView('edit');
  };

  const viewTask = async (task) => {
    try {
      await dispatch(fetchTaskById(task._id)).unwrap();
      setCurrentView('view');
    } catch (err) {
      showNotification('Failed to load task details', 'error');
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteExistingTask(taskId)).unwrap();
        showNotification('Task deleted successfully', 'success');
      } catch (err) {
        showNotification(err || 'Failed to delete task', 'error');
      }
    }
  };

const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-800 bg-green-100';
      case 'In progress': return 'text-blue-800 bg-blue-100';  
      case 'Over due': return 'text-red-800 bg-red-100'; 
      case 'Pending': return 'text-yellow-800 bg-yellow-100';
      case 'Cancelled': return 'text-slate-800 bg-slate-100';
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const NotificationComponent = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const textColor = notification.type === 'success' ? 'text-green-700' : 'text-red-700';

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className={`${bgColor} border ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}>
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className={`ml-4 ${textColor} hover:opacity-70`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // LIST VIEW
  if (currentView === 'list') {
    return (
      <div className="p-6">
        <NotificationComponent />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
            <p className="text-slate-600">Manage and assign tasks</p>
          </div>
          <button
            onClick={() => setCurrentView('add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === 'In Progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === 'Completed').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              {priorityLevels.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-600">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{task.title}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{task.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{task.caseId?.title || 'No Case'}</div>
                      <div className="text-xs text-slate-500">{task.caseId?.caseNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(task.dueDate)}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button onClick={() => viewTask(task)} className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEdit(task)} className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // ADD VIEW -

  // ADD VIEW
  if (currentView === 'add') {
    return (
      <div className="p-6">
        <NotificationComponent />
        
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Task</h2>
            <p className="text-slate-600">Add a new task to your workflow</p>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Prepare discovery documents"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed task description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Case</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.caseId}
                  onChange={(e) => handleInputChange('caseId', e.target.value)}
                >
                  <option value="">Select case (optional)</option>
                  {cases.map(caseItem => (
                    <option key={caseItem._id} value={caseItem._id}>
                      {caseItem.caseNumber} - {caseItem.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task Type</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.taskType}
                  onChange={(e) => handleInputChange('taskType', e.target.value)}
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {priorityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* to whom to assigned this tasks.. */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Assign To
                </label>

                <select
                  className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                >

                   <option value="">Unassigned</option>
    {/* Add team members here if you have them */}
    {teamMembers.map(member => (
      <option key={member._id} value={member._id}>{member.name}</option>
    ))}

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.dueTime}
                  onChange={(e) => handleInputChange('dueTime', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Court Room 3A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="urgent, filing, court (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="reminder"
                checked={formData.reminderEnabled}
                onChange={(e) => handleInputChange('reminderEnabled', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="reminder" className="text-sm text-slate-700 font-medium">
                Enable Reminder
              </label>
            </div>

            {formData.reminderEnabled && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reminder Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.reminderDate}
                  onChange={(e) => handleInputChange('reminderDate', e.target.value)}
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Create Task</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('list')}
                className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // VIEW TASK
  if (currentView === 'view' && selectedTask) {
    return (
      <div className="p-6">
        <NotificationComponent />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => {
                setCurrentView('list');
                dispatch(clearSelectedTask());
              }} 
              className="mr-4 p-2 text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedTask.title}</h2>
              <p className="text-slate-600">Task Details</p>
            </div>
          </div>
          <button
            onClick={() => startEdit(selectedTask)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Task Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Task Type</p>
                  <p className="text-slate-900 font-medium">{selectedTask.taskType || 'Other'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Case</p>
                  <p className="text-slate-900">{selectedTask.caseId?.title || 'No Case'}</p>
                  <p className="text-xs text-slate-500">{selectedTask.caseId?.caseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Priority</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Due Date</p>
                  <p className="text-slate-900">{formatDate(selectedTask.dueDate)}</p>
                  {selectedTask.dueTime && (
                    <p className="text-xs text-slate-500">{selectedTask.dueTime}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600">Created Date</p>
                  <p className="text-slate-900">{formatDate(selectedTask.createdAt)}</p>
                </div>
                {selectedTask.location && (
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600">Location</p>
                    <p className="text-slate-900">{selectedTask.location}</p>
                  </div>
                )}
              </div>
              
              {selectedTask.description && (
                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-2">Description</p>
                  <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedTask.description}</p>
                </div>
              )}

              {selectedTask.notes && (
                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-2">Notes</p>
                  <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedTask.notes}</p>
                </div>
              )}

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-slate-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Subtasks</h3>
                <div className="space-y-2">
                  {selectedTask.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        readOnly
                        className="w-4 h-4 rounded border-slate-300"
                      />
                      <span className={`${subtask.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Created By</p>
                  <p className="text-slate-900">{selectedTask.createdBy?.name || selectedTask.attorneyId?.name || 'N/A'}</p>
                </div>
                {selectedTask.assignedTo && (
                  <div>
                    <p className="text-sm text-slate-600">Assigned To</p>
                    <p className="text-slate-900">{selectedTask.assignedTo?.name || 'N/A'}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-600">Last Updated</p>
                  <p className="text-slate-900">{formatDate(selectedTask.updatedAt)}</p>
                </div>
              </div>
            </div>

            {selectedTask.reminderEnabled && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Reminder</h3>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{formatDate(selectedTask.reminderDate)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // EDIT VIEW
  if (currentView === 'edit' && selectedTask) {
    return (
      <div className="p-6">
        <NotificationComponent />
        
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('view')} className="mr-4 p-2 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Task</h2>
            <p className="text-slate-600">Update task information</p>
          </div>
        </div>

        <form onSubmit={handleUpdateTask} className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Task Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Case</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.caseId}
                  onChange={(e) => handleInputChange('caseId', e.target.value)}
                >
                  <option value="">Select case</option>
                  {cases.map(caseItem => (
                    <option key={caseItem._id} value={caseItem._id}>
                      {caseItem.caseNumber} - {caseItem.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Task Type</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.taskType}
                  onChange={(e) => handleInputChange('taskType', e.target.value)}
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                  {priorityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>

               <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>
                  Assign To
                </label>

                <select
                  className='w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500'
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                >

                   <option value="">Unassigned</option>
    {/* Add team members here if you have them */}
    {/* {teamMembers.map(member => (
      <option key={member._id} value={member._id}>{member.name}</option>
    ))} */}

                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.dueTime}
                  onChange={(e) => handleInputChange('dueTime', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="urgent, filing, court (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>

            <div className="flex space-x-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('view')}
                className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return null;
};

export default TasksManagement;