  import React, { useState, useEffect } from 'react';
  import { 
    CheckSquare, 
    FileText, 
    Calendar, 
    Phone, 
    Clock, 
    Users,
    Plus,
    Search,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Home,
    Briefcase,
    FolderOpen,
    UserCheck,
    MessageCircle,
    Upload,
    Activity,
    Filter,
    MoreVertical,
    ArrowUpRight,
    AlertCircle,
    CheckCircle,
    User,
    Mail,
    Timer,
    Star
  } from 'lucide-react';


  import MyTasks from '../Assistant/tasks/MyTasks.jsx';
  import ClientSupport from '../Assistant/tasks/ClientSupport.jsx';
  import Documents from '../Assistant/tasks/Document.jsx';

  const ModernAssistantDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('overview');
    const [activeContent, setActiveContent] = useState('dashboard');


    
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 60000);
      return () => clearInterval(timer);
    }, []);


    const handleSideBarClick = (tabId) => {
      setActiveTab(tabId);
      setActiveContent(tabId);
    }
    // Mock user data
    const user = {
      name: 'Lisa Martinez',
      role: 'Legal Assistant',
      avatar: 'LM',
      firm: 'Johnson & Associates',
      supervisor: 'Sarah Johnson'
    };

    // Mock statistics
    const stats = {
      tasksCompleted: 28,
      documentsProcessed: 67,
      clientCalls: 15,
      appointmentsScheduled: 12,
      pendingTasks: 8,
      weeklyHours: 42
    };

    // Mock data
    const assignedTasks = [
      { 
        id: 1, 
        title: 'Prepare discovery documents for Smith case', 
        attorney: 'Sarah Johnson', 
        priority: 'high', 
        status: 'in-progress',
        dueDate: '2024-01-25',
        estimatedHours: 4,
        progress: 65
      },
      { 
        id: 2, 
        title: 'Schedule deposition for Wilson case', 
        attorney: 'Mike Partner', 
        priority: 'medium', 
        status: 'completed',
        dueDate: '2024-01-24',
        estimatedHours: 2,
        progress: 100
      },
      { 
        id: 3, 
        title: 'Contact medical records department', 
        attorney: 'Sarah Johnson', 
        priority: 'high', 
        status: 'pending',
        dueDate: '2024-01-26',
        estimatedHours: 1,
        progress: 0
      },
      { 
        id: 4, 
        title: 'File court documents for Taylor case', 
        attorney: 'Jane Lawyer', 
        priority: 'medium', 
        status: 'in-progress',
        dueDate: '2024-01-27',
        estimatedHours: 3,
        progress: 30
      }
    ];

    const todaySchedule = [
      { id: 1, time: '09:00 AM', task: 'Call client - John Doe', type: 'phone', attorney: 'Sarah Johnson' },
      { id: 2, time: '10:30 AM', task: 'Prepare documents - Smith case', type: 'document', attorney: 'Sarah Johnson' },
      { id: 3, time: '02:00 PM', task: 'Client meeting prep', type: 'meeting', attorney: 'Mike Partner' },
      { id: 4, time: '03:30 PM', task: 'Court filing submission', type: 'filing', attorney: 'Jane Lawyer' }
    ];

    const recentDocuments = [
      { id: 1, name: 'Motion to Dismiss - Wilson Case.pdf', client: 'Robert Wilson', status: 'completed', uploadTime: '2 hours ago' },
      { id: 2, name: 'Settlement Agreement - Brown Case.docx', client: 'Lisa Brown', status: 'pending-review', uploadTime: '4 hours ago' },
      { id: 3, name: 'Discovery Request - Taylor Case.pdf', client: 'Mark Taylor', status: 'completed', uploadTime: '6 hours ago' }
    ];

 
    const sidebarItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'tasks', label: 'My Tasks', icon: CheckSquare, count: stats.pendingTasks },
      { id: 'documents', label: 'Documents', icon: FolderOpen, count: stats.documentsProcessed },
      { id: 'clients', label: 'Client Support', icon: Users, count: stats.clientCalls },
    ];

    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'high': return 'text-red-600 bg-red-50 border-red-200';
        case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'low': return 'text-green-600 bg-green-50 border-green-200';
        default: return 'text-slate-600 bg-slate-50 border-slate-200';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'text-green-600 bg-green-50';
        case 'in-progress': return 'text-blue-600 bg-blue-50';
        case 'pending': return 'text-yellow-600 bg-yellow-50';
        case 'pending-review': return 'text-purple-600 bg-purple-50';
        default: return 'text-slate-600 bg-slate-50';
      }
    };

    const getTaskIcon = (status) => {
      switch (status) {
        case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
        case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
        default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
      }
    };

    return (
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CM</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">CaseMate</h2>
                    <p className="text-xs text-slate-500">Assistant Portal</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() =>  handleSideBarClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-50 text-green-600 border border-green-200' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="ml-3 font-medium">{item.label}</span>
                      {item.count && (
                        <span className="ml-auto bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-200">
            {sidebarOpen ? (
              <div className="space-y-3">
                {/* Supervisor Info */}
                <div className="text-xs text-slate-500">
                  <p>Reports to:</p>
                  <p className="font-medium text-slate-700">{user.supervisor}</p>
                </div>
                
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{user.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.role}</p>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-semibold text-sm">{user.avatar}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <header className="bg-white shadow-sm border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Good morning, {user.name.split(' ')[0]}</h1>
                <p className="text-slate-600">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks, documents, clients..."
                    className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Content */}
          
          {
            activeContent === 'overview' && (
               <main className="flex-1 overflow-y-auto p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Tasks Completed</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.tasksCompleted}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+5 today</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Documents Processed</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.documentsProcessed}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+8 this week</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Client Interactions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.clientCalls}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">+3 today</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Weekly Hours</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stats.weeklyHours}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Timer className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-slate-500 font-medium">Target: 40 hours</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* My Tasks */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">My Tasks</h3>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                          <Filter className="w-4 h-4" />
                        </button>
                        <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500">
                          <option>All Tasks</option>
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {assignedTasks.map((task) => (
                        <div key={task.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3">
                              {getTaskIcon(task.status)}
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-900 mb-1">{task.title}</h4>
                                <p className="text-xs text-slate-600">Assigned by: {task.attorney}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <button className="p-1 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              {task.status.replace('-', ' ')}
                            </span>
                            <div className="text-xs text-slate-500">
                              Due: {task.dueDate} • {task.estimatedHours}h estimated
                            </div>
                          </div>
                          
                          {task.status === 'in-progress' && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-600">Progress</span>
                                <span className="text-xs text-slate-600">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {todaySchedule.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-16 text-right">
                            <span className="text-sm font-medium text-slate-900">{item.time}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{item.task}</p>
                            <p className="text-xs text-slate-500 mt-1">with {item.attorney}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.type === 'phone' ? 'bg-blue-100' :
                              item.type === 'document' ? 'bg-orange-100' :
                              item.type === 'meeting' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                              {item.type === 'phone' && <Phone className="w-4 h-4 text-blue-600" />}
                              {item.type === 'document' && <FileText className="w-4 h-4 text-orange-600" />}
                              {item.type === 'meeting' && <Users className="w-4 h-4 text-green-600" />}
                              {item.type === 'filing' && <Upload className="w-4 h-4 text-purple-600" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Documents */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Documents</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {recentDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-start space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                            <p className="text-xs text-slate-600">{doc.client}</p>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status.replace('-', ' ')}
                              </span>
                              <span className="text-xs text-slate-400 ml-2">{doc.uploadTime}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200">
                    <Upload className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-600 font-medium">Upload Document</span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-600 font-medium">Schedule Meeting</span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-200">
                    <Phone className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-orange-600 font-medium">Call Client</span>
                  </button>
                  <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200">
                    <MessageCircle className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-purple-600 font-medium">Send Update</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
          )}


          {/* Task Management in assistant */}
          {
            activeContent === 'tasks' && (
              <main className='flex-1 overflow-y-auto p-6'>
                <MyTasks />
              </main>
            )
          }

          {/* client-support managment */}
          {
            activeContent === 'clients' && (
              <main className='flex-1 overflow-y-auto p-6'>
                <ClientSupport />
              </main>
            )
          }

          {/* document manangement */}
          {
            activeContent === 'documents' && (
              <main className='flex-1 overflow-y-auto p-6'>
                <Documents />
              </main>
            )
          }

         



        </div>
      </div>
    );
  };

  export default ModernAssistantDashboard;