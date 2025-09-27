import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Clock, 
  DollarSign,
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
  CheckSquare,
  UserCheck,
  TrendingUp,
  Activity,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const ModernAttorneyDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock user data
  const user = {
    name: 'Sarah Johnson',
    role: 'Attorney',
    avatar: 'SJ',
    firm: 'Johnson & Associates'
  };

  // Mock statistics
  const stats = {
    totalClients: 45,
    activeCases: 23,
    documentsUploaded: 156,
    monthlyRevenue: 125000,
    pendingTasks: 12,
    upcomingDeadlines: 3
  };

  // Mock data
  const todayAppointments = [
    { id: 1, client: 'John Doe', time: '09:00 AM', type: 'Consultation', case: 'Divorce Case', priority: 'high' },
    { id: 2, client: 'Jane Smith', time: '11:30 AM', type: 'Settlement Meeting', case: 'Personal Injury', priority: 'medium' },
    { id: 3, client: 'Mike Johnson', time: '02:00 PM', type: 'Document Review', case: 'Corporate Law', priority: 'low' },
    { id: 4, client: 'Sarah Wilson', time: '04:30 PM', type: 'Court Preparation', case: 'Criminal Defense', priority: 'high' }
  ];

  const upcomingDeadlines = [
    { id: 1, case: 'Smith vs. ABC Corp', deadline: '2024-01-25', type: 'Filing Deadline', priority: 'high', daysLeft: 2 },
    { id: 2, case: 'Johnson Divorce', deadline: '2024-01-27', type: 'Discovery Due', priority: 'medium', daysLeft: 4 },
    { id: 3, case: 'Wilson Criminal Case', deadline: '2024-01-30', type: 'Motion Filing', priority: 'high', daysLeft: 7 }
  ];

  const recentDocuments = [
    { id: 1, name: 'Settlement Agreement - Brown Case', type: 'Contract', size: '2.3 MB', uploadedBy: 'You', time: '2 hours ago' },
    { id: 2, name: 'Motion to Dismiss - Wilson Case', type: 'Court Filing', size: '1.8 MB', uploadedBy: 'Assistant', time: '4 hours ago' },
    { id: 3, name: 'Medical Records - Taylor Case', type: 'Evidence', size: '5.2 MB', uploadedBy: 'Client', time: '6 hours ago' }
  ];

  const teamActivity = [
    { id: 1, member: 'Lisa Assistant', action: 'completed task', task: 'Document preparation for Smith case', time: '1 hour ago' },
    { id: 2, member: 'Mike Paralegal', action: 'uploaded document', task: 'Court filing for Johnson case', time: '3 hours ago' },
    { id: 3, member: 'Sarah Assistant', action: 'scheduled meeting', task: 'Client consultation for new case', time: '5 hours ago' }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users, count: stats.totalClients },
    { id: 'cases', label: 'Cases', icon: Briefcase, count: stats.activeCases },
    { id: 'documents', label: 'Documents', icon: FolderOpen, count: stats.documentsUploaded },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: stats.pendingTasks },
    { id: 'team', label: 'Team', icon: UserCheck },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'billing', label: 'Billing', icon: DollarSign }
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

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">CaseMate</h2>
                  <p className="text-xs text-slate-500">Legal Management</p>
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
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.firm}</p>
              </div>
              <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
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
                  placeholder="Search cases, clients, documents..."
                  className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clients</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+3 this month</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Cases</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeCases}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+2 this week</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Documents</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.documentsUploaded}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+15 today</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">${stats.monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">+12% vs last month</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Today's Appointments</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="flex items-center space-x-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add Appointment</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-slate-900">{appointment.client}</h4>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(appointment.priority)}`}>
                              {appointment.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{appointment.case}</p>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {appointment.time} • {appointment.type}
                          </div>
                        </div>
                        <button className="ml-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <AlertCircle className={`w-5 h-5 ${
                            deadline.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="text-sm font-medium text-slate-900">{deadline.case}</h4>
                          <p className="text-xs text-slate-600 mt-1">{deadline.type}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-xs text-slate-500">{deadline.deadline}</span>
                            <span className="ml-2 text-xs font-medium text-red-600">
                              {deadline.daysLeft} days left
                            </span>
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
                      <div key={doc.id} className="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-orange-600" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type} • {doc.size} • {doc.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Team Activity</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {teamActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-slate-900">
                            <span className="font-medium">{activity.member}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">{activity.task}</p>
                          <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
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
                  <Plus className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-600 font-medium">Add New Client</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">Upload Document</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-200">
                  <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-orange-600 font-medium">Schedule Meeting</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200">
                  <CheckSquare className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-purple-600 font-medium">Assign Task</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernAttorneyDashboard;