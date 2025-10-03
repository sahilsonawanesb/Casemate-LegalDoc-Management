import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Eye,
  Edit,
  User,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
  Users,
  Filter,
  MoreVertical,
  Trash2,
  MessageSquare,
  Paperclip
} from 'lucide-react';

const TasksManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Prepare discovery documents for Smith case',
      description: 'Compile all discovery documents including interrogatories and document requests',
      assignedTo: 'Lisa Martinez',
      assignedToId: 1,
      assignedBy: 'Sarah Johnson',
      client: 'John Doe',
      caseNumber: 'CM-2024-001',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2024-02-05',
      createdDate: '2024-01-20',
      estimatedHours: 8,
      actualHours: 5,
      progress: 60,
      comments: [
        { user: 'Lisa Martinez', text: 'Started working on interrogatories', date: '2024-01-21' }
      ],
      attachments: 2
    },
    {
      id: 2,
      title: 'Schedule deposition for Brown case',
      description: 'Contact opposing counsel and schedule deposition date',
      assignedTo: 'Mike Paralegal',
      assignedToId: 2,
      assignedBy: 'Sarah Johnson',
      client: 'Jane Smith',
      caseNumber: 'CM-2024-002',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2024-01-25',
      createdDate: '2024-01-18',
      estimatedHours: 2,
      actualHours: 2,
      progress: 100,
      comments: [],
      attachments: 0
    },
    {
      id: 3,
      title: 'File court documents',
      description: 'File motion to dismiss with superior court',
      assignedTo: 'Lisa Martinez',
      assignedToId: 1,
      assignedBy: 'Sarah Johnson',
      client: 'Mike Johnson',
      caseNumber: 'CM-2024-003',
      priority: 'Urgent',
      status: 'Pending',
      dueDate: '2024-01-30',
      createdDate: '2024-01-22',
      estimatedHours: 4,
      actualHours: 0,
      progress: 0,
      comments: [],
      attachments: 1
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    client: '',
    caseNumber: '',
    priority: 'Medium',
    dueDate: '',
    estimatedHours: ''
  });

  const teamMembers = [
    { id: 1, name: 'Lisa Martinez', role: 'Legal Assistant' },
    { id: 2, name: 'Mike Paralegal', role: 'Paralegal' },
    { id: 3, name: 'Sarah Assistant', role: 'Legal Assistant' }
  ];

  const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];
  const statusOptions = ['Pending', 'In Progress', 'Under Review', 'Completed', 'Cancelled'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTask = () => {
    if (formData.title && formData.assignedTo && formData.dueDate) {
      const member = teamMembers.find(m => m.id === parseInt(formData.assignedTo));
      const newTask = {
        id: Date.now(),
        ...formData,
        assignedTo: member.name,
        assignedToId: member.id,
        assignedBy: 'Sarah Johnson',
        status: 'Pending',
        createdDate: new Date().toISOString().split('T')[0],
        actualHours: 0,
        progress: 0,
        comments: [],
        attachments: 0
      };
      setTasks(prev => [...prev, newTask]);
      setFormData({ 
        title: '', description: '', assignedTo: '', client: '', 
        caseNumber: '', priority: 'Medium', dueDate: '', estimatedHours: '' 
      });
      setCurrentView('list');
    }
  };

  const handleUpdateTask = () => {
    const member = teamMembers.find(m => m.id === parseInt(formData.assignedTo));
    const updatedTask = {
      ...selectedTask,
      ...formData,
      assignedTo: member ? member.name : selectedTask.assignedTo,
      assignedToId: member ? member.id : selectedTask.assignedToId
    };
    setTasks(prev => prev.map(task => task.id === selectedTask.id ? updatedTask : task));
    setSelectedTask(updatedTask);
    setCurrentView('view');
  };

  const startEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedToId.toString(),
      client: task.client,
      caseNumber: task.caseNumber,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours
    });
    setCurrentView('edit');
  };

  const viewTask = (task) => {
    setSelectedTask(task);
    setCurrentView('view');
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-800 bg-green-100';
      case 'In Progress': return 'text-blue-800 bg-blue-100';
      case 'Under Review': return 'text-purple-800 bg-purple-100';
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

  if (currentView === 'list') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
            <p className="text-slate-600">Manage and assign tasks to your team</p>
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
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
              <CheckSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'In Progress').length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'Completed').length}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length}</p>
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
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client/Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{task.title}</div>
                    <div className="text-sm text-slate-500 truncate max-w-xs">{task.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-medium">{task.assignedTo.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-sm text-slate-900">{task.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{task.client}</div>
                    <div className="text-xs text-slate-500">{task.caseNumber}</div>
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
                  <td className="px-6 py-4 text-sm text-slate-500">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{task.progress}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => viewTask(task)} className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => startEdit(task)} className="text-green-600 hover:text-green-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (currentView === 'add') {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Task</h2>
            <p className="text-slate-600">Assign task to team member</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Task Title *</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Prepare discovery documents"
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign To *</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name} - {member.role}</option>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Case Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                  placeholder="CM-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                  placeholder="8"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleAddTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Create Task</span>
              </button>
              <button
                onClick={() => setCurrentView('list')}
                className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'view' && selectedTask) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600">
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
                  <p className="text-sm text-slate-600">Assigned To</p>
                  <p className="text-slate-900 font-medium">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Assigned By</p>
                  <p className="text-slate-900">{selectedTask.assignedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Client</p>
                  <p className="text-slate-900">{selectedTask.client}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Case Number</p>
                  <p className="text-slate-900">{selectedTask.caseNumber}</p>
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
                  <p className="text-slate-900">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Created Date</p>
                  <p className="text-slate-900">{selectedTask.createdDate}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-slate-600 mb-2">Description</p>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedTask.description}</p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-slate-600 mb-2">Progress</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{selectedTask.progress}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              {selectedTask.comments.length > 0 ? (
                <div className="space-y-4">
                  {selectedTask.comments.map((comment, index) => (
                    <div key={index} className="flex space-x-3 pb-4 border-b last:border-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">{comment.user.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{comment.user}</p>
                        <p className="text-sm text-slate-600 mt-1">{comment.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{comment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Time Tracking</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Estimated Hours</p>
                  <p className="text-2xl font-bold text-slate-900">{selectedTask.estimatedHours}h</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Actual Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTask.actualHours}h</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Remaining</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedTask.estimatedHours - selectedTask.actualHours}h</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Attachments</h3>
              <div className="flex items-center justify-center py-4 text-slate-500">
                <Paperclip className="w-5 h-5 mr-2" />
                <span>{selectedTask.attachments} file(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'edit' && selectedTask) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('view')} className="mr-4 p-2 text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Task</h2>
            <p className="text-slate-600">Update task information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign To</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                >
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleUpdateTask}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setCurrentView('view')}
                className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TasksManagement;