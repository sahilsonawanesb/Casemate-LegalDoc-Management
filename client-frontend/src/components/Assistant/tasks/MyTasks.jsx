import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  User,
  Calendar,
  Briefcase,
  MessageSquare,
  Paperclip,
  Play,
  Pause,
  Check,
  Plus,
  X,
  Edit2,
  Filter
} from 'lucide-react';

const MyTasks = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Prepare discovery documents for Smith case',
      description: 'Compile all discovery documents including interrogatories and document requests. Ensure all documents are properly formatted and organized.',
      assignedBy: 'Sarah Johnson',
      assignedByRole: 'Attorney',
      assignedTo: 'You',
      client: 'John Doe',
      caseNumber: 'CM-2024-001',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2024-02-05',
      assignedDate: '2024-01-20',
      estimatedHours: 8,
      workedHours: 5,
      progress: 60,
      instructions: 'Please ensure all interrogatories are numbered correctly and include the client signature page.',
      comments: [
        { user: 'You', text: 'Started working on interrogatories section', date: '2024-01-21 10:30 AM' }
      ],
      attachments: 2
    },
    {
      id: 2,
      title: 'Schedule deposition for Wilson case',
      description: 'Contact opposing counsel and schedule deposition date for witness testimony',
      assignedBy: 'Mike Partner',
      assignedByRole: 'Attorney',
      assignedTo: 'You',
      client: 'Robert Wilson',
      caseNumber: 'CM-2024-003',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2024-01-25',
      assignedDate: '2024-01-18',
      estimatedHours: 2,
      workedHours: 2,
      progress: 100,
      instructions: 'Try to schedule for early next month. Coordinate with court reporter as well.',
      comments: [
        { user: 'You', text: 'Deposition scheduled for Feb 10 at 2 PM', date: '2024-01-22 3:15 PM' },
        { user: 'Mike Partner', text: 'Perfect, thank you!', date: '2024-01-22 4:00 PM' }
      ],
      attachments: 1
    },
    {
      id: 3,
      title: 'Contact medical records department',
      description: 'Request medical records from St. Mary Hospital for Brown case',
      assignedBy: 'Sarah Johnson',
      assignedByRole: 'Attorney',
      assignedTo: 'You',
      client: 'Jane Smith',
      caseNumber: 'CM-2024-002',
      priority: 'High',
      status: 'Pending',
      dueDate: '2024-01-30',
      assignedDate: '2024-01-22',
      estimatedHours: 1,
      workedHours: 0,
      progress: 0,
      instructions: 'Need records from Jan 2023 to present. Use the authorization form in the case file.',
      comments: [],
      attachments: 1
    },
    {
      id: 4,
      title: 'File court documents for Taylor case',
      description: 'File motion to dismiss with superior court',
      assignedBy: 'Jane Lawyer',
      assignedByRole: 'Attorney',
      assignedTo: 'You',
      client: 'Mark Taylor',
      caseNumber: 'CM-2024-004',
      priority: 'Urgent',
      status: 'In Progress',
      dueDate: '2024-01-28',
      assignedDate: '2024-01-23',
      estimatedHours: 4,
      workedHours: 2,
      progress: 50,
      instructions: 'Deadline is strict. Need to file by 4 PM on due date.',
      comments: [
        { user: 'You', text: 'Documents prepared and ready for review', date: '2024-01-24 11:00 AM' }
      ],
      attachments: 3
    },
    {
      id: 5,
      title: 'Research case law precedents',
      description: 'Find similar cases for contract dispute matter',
      assignedBy: 'Sarah Johnson',
      assignedByRole: 'Attorney',
      assignedTo: 'You',
      client: 'ABC Corp',
      caseNumber: 'CM-2024-005',
      priority: 'Low',
      status: 'Pending',
      dueDate: '2024-02-15',
      assignedDate: '2024-01-24',
      estimatedHours: 6,
      workedHours: 0,
      progress: 0,
      instructions: 'Focus on California state cases from last 5 years.',
      comments: [],
      attachments: 0
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedBy: 'You',
    assignedByRole: 'Legal Assistant',
    assignedTo: 'You',
    client: '',
    caseNumber: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    instructions: '',
    estimatedHours: 1
  });

  const attorneys = ['Sarah Johnson', 'Mike Partner', 'Jane Lawyer', 'David Smith'];
  const assistants = ['You', 'Mary Wilson', 'John Davis', 'Lisa Chen'];

  const getDateCategory = (dueDate) => {
    const today = new Date('2024-01-25');
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

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'Completed') {
          updatedTask.progress = 100;
        } else if (newStatus === 'In Progress' && task.progress === 0) {
          updatedTask.progress = 10;
        }
        return updatedTask;
      }
      return task;
    }));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
    }
  };

  const updateTaskProgress = (taskId, newProgress) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, progress: newProgress, workedHours: Math.round(task.estimatedHours * newProgress / 100) } : task
    ));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({ 
        ...prev, 
        progress: newProgress,
        workedHours: Math.round(prev.estimatedHours * newProgress / 100)
      }));
    }
  };

  const addComment = (taskId, commentText) => {
    if (!commentText.trim()) return;
    
    const newCommentObj = {
      user: 'You',
      text: commentText,
      date: new Date().toLocaleString()
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, newCommentObj] }
        : task
    ));
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => ({
        ...prev,
        comments: [...prev.comments, newCommentObj]
      }));
    }
    
    setNewComment('');
  };

  const createTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;
    
    const task = {
      id: tasks.length + 1,
      ...newTask,
      assignedDate: new Date().toISOString().split('T')[0],
      workedHours: 0,
      progress: 0,
      comments: [],
      attachments: 0
    };
    
    setTasks(prev => [...prev, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      assignedBy: 'You',
      assignedByRole: 'Legal Assistant',
      assignedTo: 'You',
      client: '',
      caseNumber: '',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '',
      instructions: '',
      estimatedHours: 1
    });
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

  // Create Task Modal
  const CreateTaskModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-slate-900">Create New Task</h2>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Client
              </label>
              <input
                type="text"
                value={newTask.client}
                onChange={(e) => setNewTask(prev => ({ ...prev, client: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Case Number
              </label>
              <input
                type="text"
                value={newTask.caseNumber}
                onChange={(e) => setNewTask(prev => ({ ...prev, caseNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CM-2024-XXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigned By
              </label>
              <select
                value={newTask.assignedBy}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="You">You (Self-assigned)</option>
                {attorneys.map(att => (
                  <option key={att} value={att}>{att}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assign To
              </label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {assistants.map(asst => (
                  <option key={asst} value={asst}>{asst}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority *
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status *
              </label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                value={newTask.estimatedHours}
                onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Instructions
            </label>
            <textarea
              value={newTask.instructions}
              onChange={(e) => setNewTask(prev => ({ ...prev, instructions: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Special instructions or notes"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t bg-slate-50">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={createTask}
            disabled={!newTask.title.trim() || !newTask.dueDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );

  // Task List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Task Management</h2>
              <p className="text-slate-600 mt-1">Manage and track all your legal tasks</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-slate-600">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{tasks.length}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-5">
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {tasks.filter(t => t.status === 'Pending').length}
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
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
            </div>
          </div>

          {/* Filters and Grouping */}
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

          {/* Tasks List with Grouping */}
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
                      key={task.id} 
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
                            {task.assignedBy}
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {task.client || 'No client'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {task.dueDate}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>

                      {task.status === 'In Progress' && (
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

        {showCreateModal && <CreateTaskModal />}
      </div>
    );
  }

  // Task Details View
  if (currentView === 'view' && selectedTask) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
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
              <p className="text-slate-600">Case: {selectedTask.caseNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              {selectedTask.status === 'Pending' && (
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'In Progress')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Task</span>
                </button>
              )}
              {selectedTask.status === 'In Progress' && (
                <button
                  onClick={() => updateTaskStatus(selectedTask.id, 'Completed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Task Information */}
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
                        Instructions from {selectedTask.assignedBy}
                      </label>
                      <p className="text-blue-800 mt-2">{selectedTask.instructions}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned By</label>
                      <p className="text-slate-900 mt-1">{selectedTask.assignedBy}</p>
                      <p className="text-xs text-slate-500">{selectedTask.assignedByRole}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned To</label>
                      <p className="text-slate-900 mt-1">{selectedTask.assignedTo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Client</label>
                      <p className="text-slate-900 mt-1">{selectedTask.client || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Case Number</label>
                      <p className="text-slate-900 mt-1">{selectedTask.caseNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Due Date</label>
                      <p className="text-slate-900 mt-1">{selectedTask.dueDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Assigned Date</label>
                      <p className="text-slate-900 mt-1">{selectedTask.assignedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              {selectedTask.status === 'In Progress' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Update Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Current Progress</span>
                        <span className="font-medium text-blue-600">{selectedTask.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedTask.progress}
                        onChange={(e) => updateTaskProgress(selectedTask.id, parseInt(e.target.value))}
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
                        style={{ width: `${selectedTask.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Comments & Updates</h3>
                
                <div className="space-y-4 mb-4">
                  {selectedTask.comments.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No comments yet. Add the first comment below.</p>
                  ) : (
                    selectedTask.comments.map((comment, index) => (
                      <div key={index} className="flex space-x-3 pb-4 border-b last:border-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {comment.user.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-900">{comment.user}</span>
                            <span className="text-xs text-slate-500">{comment.date}</span>
                          </div>
                          <p className="text-sm text-slate-600">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Add Comment</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addComment(selectedTask.id, newComment);
                        }
                      }}
                      placeholder="Type your comment here..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => addComment(selectedTask.id, newComment)}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
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
                      onChange={(e) => updateTaskStatus(selectedTask.id, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Time Tracking */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Time Tracking</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Estimated Hours</span>
                    <span className="font-medium">{selectedTask.estimatedHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Worked Hours</span>
                    <span className="font-medium text-blue-600">{selectedTask.workedHours}h</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-sm text-slate-600">Remaining</span>
                    <span className={`font-semibold ${
                      selectedTask.estimatedHours - selectedTask.workedHours < 0 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {selectedTask.estimatedHours - selectedTask.workedHours}h
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((selectedTask.workedHours / selectedTask.estimatedHours) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      {Math.round((selectedTask.workedHours / selectedTask.estimatedHours) * 100)}% of estimated time used
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Attachments</h3>
                <div className="flex flex-col items-center justify-center py-6 text-slate-500 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <Paperclip className="w-8 h-8 mb-2" />
                  <span className="font-medium">{selectedTask.attachments} file(s) attached</span>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    + Add Attachment
                  </button>
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