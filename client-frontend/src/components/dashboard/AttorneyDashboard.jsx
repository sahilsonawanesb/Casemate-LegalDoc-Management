// new one 
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { 
  Users, FileText, Calendar, AlertCircle, Clock, DollarSign,
  Plus, Search, Bell, Settings, LogOut, Menu, X,
  Home, Briefcase, FolderOpen, CheckSquare, UserCheck,
  Activity, Filter, MoreVertical, ArrowUpRight, Loader, RefreshCw
} from 'lucide-react';

import SimpleClientManagement from '../Attorney/clients/ClientManagement.jsx';
import SimpleCasesManagement from '../Attorney/cases/CaseManagemet.jsx';
import DocumentsManagement from '../Attorney/documents/DocumentManagement.jsx';
import TasksManagement from '../Attorney/tasks/TaskMangement.jsx';
import TeamManagement from '../Attorney/team/TeamManagement.jsx';
import AppointmentManagementUI from '../Attorney/appointments/Appointmentmanagement.jsx';

// Import auth sections..
import {logoutUser, selectUser, selectIsAuthenticated, loadUserFromStorage} from '../../store/slices/authSlice.js';

// Import Redux actions and selectors from dashboard slice
import {
  fetchDashboardStat,
  fetchRecentDocuments,
  fetchTeamActivity,
  fetchUpcomingDeadlines,
  fetchPendingTasks,
  refreshDashboardData,
  clearError,
  selectDashboardStats,
  selectRecentDocuments,
  selectTeamActivity,
  selectUpcomingDeadlines,
  // selectPendingTasks,
  selectDashboardLoading,
  selectDashboardError,
  selectLastRefreshed
} from '../../store/slices/dashboardSlice.js';

// Import from other slices if needed
import {
  fetchUpcomingSlots,
  selectUpcomingSlots,
  selectAppointmentLoading
} from '../../store/slices/appointmentSlice.js';

import {
  fetchOverdueTasks,
  selectOverdueTasks,
  // selectTasksLoading
} from '../../store/slices/taskSlice.js';
import { isAuthenticated } from '../../services/authService.js';

const ModernAttorneyDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auth State..
  const user = useSelector(selectUser);
  const isAuthenticate = useSelector(selectIsAuthenticated);
  
  // Redux state - Dashboard
  const stats = useSelector(selectDashboardStats);
  const recentDocuments = useSelector(selectRecentDocuments);
  const teamActivity = useSelector(selectTeamActivity);
  const upcomingDeadlines = useSelector(selectUpcomingDeadlines);
  // const pendingTasks = useSelector(selectPendingTasks);
  const dashboardLoading = useSelector(selectDashboardLoading);
  const dashboardError = useSelector(selectDashboardError);
  const lastRefreshed = useSelector(selectLastRefreshed);
  
  // Redux state - Appointments
  const upcomingAppointments = useSelector(selectUpcomingSlots);
  const appointmentLoading = useSelector(selectAppointmentLoading);
  
  // Redux state - Tasks
  const overdueTasks = useSelector(selectOverdueTasks);
  // const taskLoading = useSelector(selectTasksLoading);
  
  // Local state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [activeContent, setActiveContent] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  // Load user from localstorage onmount.
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // Fetch data on component mount and when switching to dashboard
  useEffect(() => {
    if (activeContent === 'dashboard' && isAuthenticated) {
      loadDashboardData();
    }
  }, [activeContent]);

  // redirect to login if not authenticated,
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login');
    }
  }, [isAuthenticate, navigate]);

  // Load all dashboard data
  const loadDashboardData = () => {
    dispatch(fetchDashboardStat());
    dispatch(fetchRecentDocuments(3));
    dispatch(fetchTeamActivity(3));
    dispatch(fetchUpcomingDeadlines(5));
    dispatch(fetchPendingTasks(5));
    
    // Also fetch from other slices
    dispatch(fetchUpcomingSlots());
    dispatch(fetchOverdueTasks());
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dispatch(refreshDashboardData()).unwrap();
      // Also refresh other data
      dispatch(fetchUpcomingSlots());
      dispatch(fetchOverdueTasks());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSidebarClick = (tabId) => {
    setActiveTab(tabId);
    setActiveContent(tabId);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const handleLogout = async() => {
    try{
      await dispatch(logoutUser()).unwrap();

      // navigate to login..
      navigate('/login');
    }catch(error){
      console.log('Logout error', error);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload();
    }
  }

   const getUserInitials = () => {
    if (!user) return 'U';
    
    // Check for firstName and lastName
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    
    // Check for fullName or name
    if (user.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    
    if (user.name) {
      const names = user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
      }
      return user.name.charAt(0).toUpperCase();
    }
    
    // Check for email
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Get user full name
  const getUserFullName = () => {
    if (!user) return 'User';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.fullName) {
      return user.fullName;
    }
    
    if (user.name) {
      return user.name;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  };

  // Get user role/firm
  const getUserRole = () => {
    if (!user) return 'Loading...';
    
    return user.role || user.firm || user.position || user.designation || 'Attorney';
  };



  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: Home },
    { id: 'clients', label: 'Clients', icon: Users, count: stats.totalClients },
    { id: 'cases', label: 'Cases', icon: Briefcase, count: stats.activeCases },
    { id: 'documents', label: 'Documents', icon: FolderOpen, count: stats.documentsUploaded },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: stats.pendingTasks },
    { id: 'team', label: 'Team', icon: UserCheck },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
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
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      case 'low':
        return 'border-green-200 bg-green-50 text-green-700';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if(hour > 12) return 'Good Morning';
    if(hour < 18) return 'Good Afternoor';
    return 'Good evening';
  }

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  // Don't render if not authenticated..
   if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
                onClick={() => handleSidebarClick(item.id)}
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
                    {item.count > 0 && (
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
        {/* <div className="p-4 border-t border-slate-200">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.firm}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
              title="Logout"
            >
              <span className="text-white font-semibold text-sm">{user.avatar}</span>
            </button>
          )}
        </div>
      </div> */}

       <div className="p-4 border-t border-slate-200">
          {sidebarOpen ? (
            <div className="relative">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{getUserFullName()}</p>
                  <p className="text-xs text-slate-500 truncate">{getUserRole()}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{getUserFullName()}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to profile if you have it
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to settings if you have it
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto hover:opacity-80 transition-opacity"
                title={getUserFullName()}
              >
                <span className="text-white font-semibold text-sm">{getUserInitials()}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 w-48 z-50">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{getUserFullName()}</p>
                    <p className="text-xs text-slate-500">{getUserRole()}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
  <h1 className="text-2xl font-bold text-slate-900">
                {getGreeting()}, {getUserFullName().split(' ')[0]}
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-slate-600">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
                {lastRefreshed && activeContent === 'dashboard' && (
                  <span className="text-xs text-slate-400">
                    • Updated {formatRelativeTime(lastRefreshed)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {activeContent === 'dashboard' && (
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || dashboardLoading}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh dashboard"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {sidebarOpen && <span className="text-sm font-medium">Refresh</span>}
                </button>
              )}
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
                {(overdueTasks?.length > 0 || stats.upcomingDeadlines > 0) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                <Settings className="w-5 h-5" />
              </button>

                {/* User Profile in Header */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {dashboardError && activeContent === 'dashboard' && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{dashboardError}</span>
            </div>
            <button
              onClick={handleClearError}
              className="text-red-800 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Dashboard Content */}
        {activeContent === 'dashboard' && (
          <main className="flex-1 overflow-y-auto p-6">
            {/* Loading State */}
            {dashboardLoading && !stats.totalClients ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                  <p className="text-slate-600">Loading dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Total Clients</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalClients || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">Active clients</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Active Cases</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.activeCases || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">In progress</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Documents</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.documentsUploaded || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">Total uploaded</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Pending Tasks</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingTasks || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4 text-sm">
                      {overdueTasks?.length > 0 ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-red-600 font-medium">{overdueTasks.length} overdue</span>
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">On track</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Upcoming Appointments */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="p-6 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h3>
                          <button 
                            onClick={() => handleSidebarClick('appointments')}
                            className="flex items-center space-x-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Appointment</span>
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        {appointmentLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader className="w-6 h-6 animate-spin text-blue-600" />
                          </div>
                        ) : upcomingAppointments?.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingAppointments.slice(0, 3).map((appointment) => (
                              <div key={appointment._id} className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-slate-900">
                                      {appointment.clientName || 'Client'}
                                    </h4>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(appointment.priority)}`}>
                                      {appointment.priority || 'medium'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 mt-1">
                                    {appointment.caseTitle || appointment.case || 'General consultation'}
                                  </p>
                                  <div className="flex items-center mt-2 text-xs text-slate-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime} • {appointment.appointmentType}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500">No upcoming appointments</p>
                            <button 
                              onClick={() => handleSidebarClick('appointments')}
                              className="mt-3 text-blue-600 text-sm hover:underline"
                            >
                              Schedule your first appointment
                            </button>
                          </div>
                        )}
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
                        {upcomingDeadlines?.length > 0 ? (
                          <div className="space-y-4">
                            {upcomingDeadlines.slice(0, 3).map((deadline) => (
                              <div key={deadline._id || deadline.id} className="flex items-start p-3 bg-slate-50 rounded-lg">
                                <div className="flex-shrink-0">
                                  <AlertCircle className={`w-5 h-5 ${
                                    deadline.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                                  }`} />
                                </div>
                                <div className="ml-3 flex-1">
                                  <h4 className="text-sm font-medium text-slate-900">
                                    {deadline.case || deadline.caseTitle || 'Case'}
                                  </h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                    {deadline.type || deadline.deadlineType || 'Deadline'}
                                  </p>
                                  <div className="flex items-center mt-2">
                                    <span className="text-xs text-slate-500">
                                      {new Date(deadline.deadline || deadline.dueDate).toLocaleDateString()}
                                    </span>
                                    {deadline.daysLeft !== undefined && (
                                      <span className={`ml-2 text-xs font-medium ${
                                        deadline.daysLeft <= 3 ? 'text-red-600' : 'text-yellow-600'
                                      }`}>
                                        {deadline.daysLeft} days left
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <CheckSquare className="w-10 h-10 text-green-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No upcoming deadlines</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Documents */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Documents</h3>
                      </div>
                      <div className="p-6">
                        {recentDocuments?.length > 0 ? (
                          <div className="space-y-3">
                            {recentDocuments.map((doc) => (
                              <div key={doc._id || doc.id} className="flex items-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                  </div>
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">
                                    {doc.name || doc.fileName || 'Document'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {doc.type || doc.fileType || 'File'} • {doc.size || '0KB'} • {formatRelativeTime(doc.uploadedAt || doc.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No recent documents</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Team Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Team Activity</h3>
                      </div>
                      <div className="p-6">
                        {teamActivity?.length > 0 ? (
                          <div className="space-y-4">
                            {teamActivity.map((activity, index) => (
                              <div key={activity._id || activity.id || index} className="flex items-start">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-blue-600" />
                                  </div>
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm text-slate-900">
                                    <span className="font-medium">
                                      {activity.member || activity.userName || activity.user || 'Team member'}
                                    </span> {activity.action || 'performed an action'}
                                  </p>
                                  <p className="text-xs text-slate-600 mt-1">
                                    {activity.task || activity.description || activity.details}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">
                                    {formatRelativeTime(activity.time || activity.timestamp || activity.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Activity className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No recent activity</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button 
                        onClick={() => handleSidebarClick('clients')}
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200"
                      >
                        <Plus className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-blue-600 font-medium">Add New Client</span>
                      </button>
                      <button 
                        onClick={() => handleSidebarClick('documents')}
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200"
                      >
                        <FileText className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-600 font-medium">Upload Document</span>
                      </button>
                      <button 
                        onClick={() => handleSidebarClick('appointments')}
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-200"
                      >
                        <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-orange-600 font-medium">Schedule Meeting</span>
                      </button>
                      <button 
                        onClick={() => handleSidebarClick('tasks')}
                        className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200"
                      >
                        <CheckSquare className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-purple-600 font-medium">Assign Task</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        )}

        {/* Clients Management */}
        {activeContent === 'clients' && (
          <main className='flex-1 overflow-y-auto p-6'>
            <SimpleClientManagement />
          </main>
        )}

        {/* Cases Management*/}
        {activeContent === 'cases' && (
          <main className='flex-1 overflow-y-auto p-6'>
            <SimpleCasesManagement />
          </main>
        )}

        {/* Document Management */}
        {activeContent === 'documents' && (
          <main className='flex-1 overflow-y-auto p-6'>
            <DocumentsManagement />
          </main>
        )}

        {/* Tasks Management */}
        {activeContent === 'tasks' && (
          <main className='flex-1 overflow-y-auto'>
            <TasksManagement />
          </main>
        )}

        {activeContent === 'team' && (
          <main className='flex-1 overflow-y-auto p-6'>
            <TeamManagement />
          </main>
        )}

        {activeContent === 'appointments' && (
          <main className='flex-1 overflow-y-auto p-6'>
            <AppointmentManagementUI />
          </main>
        )}
      </div>
    </div>
  );
};

export default ModernAttorneyDashboard;