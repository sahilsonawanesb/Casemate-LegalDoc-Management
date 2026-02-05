import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  Clock, 
  Eye,
  Download,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail,
  DollarSign,
  Activity,
  Shield,
  Star,
  Video,
  FileCheck,
  Info
} from 'lucide-react';

const ModernClientDashboard = () => {
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
    name: 'Robert Johnson',
    avatar: 'RJ',
    memberSince: '2024-01-15'
  };

  // Mock case information
  const caseInfo = {
    caseNumber: 'CM-2024-001',
    caseType: 'Personal Injury',
    attorney: 'Sarah Johnson',
    status: 'Active',
    progress: 65,
    nextAppointment: '2024-01-25 10:00 AM',
    estimatedCompletion: 'March 2024'
  };

  // Mock documents
  const recentDocuments = [
    { 
      id: 1, 
      name: 'Medical Records Summary.pdf', 
      date: '2024-01-20', 
      size: '2.3 MB', 
      type: 'Medical',
      status: 'new',
      description: 'Updated medical evaluation report'
    },
    { 
      id: 2, 
      name: 'Settlement Offer Letter.pdf', 
      date: '2024-01-18', 
      size: '1.8 MB', 
      type: 'Legal',
      status: 'important',
      description: 'Initial settlement proposal from insurance company'
    },
    { 
      id: 3, 
      name: 'Police Report.pdf', 
      date: '2024-01-15', 
      size: '987 KB', 
      type: 'Evidence',
      status: 'viewed',
      description: 'Official police incident report'
    },
    { 
      id: 4, 
      name: 'Insurance Claim Form.pdf', 
      date: '2024-01-12', 
      size: '1.2 MB', 
      type: 'Insurance',
      status: 'viewed',
      description: 'Completed insurance claim documentation'
    }
  ];

  // Mock case updates
  const caseUpdates = [
    { 
      id: 1, 
      title: 'Medical evaluation completed', 
      description: 'Independent medical examination has been completed. Results are favorable for our case.',
      date: '2024-01-20', 
      type: 'medical',
      important: true
    },
    { 
      id: 2, 
      title: 'Settlement negotiations initiated', 
      description: 'We have begun discussions with the insurance company regarding settlement terms.',
      date: '2024-01-18', 
      type: 'legal',
      important: true
    },
    { 
      id: 3, 
      title: 'Additional evidence submitted', 
      description: 'New witness statements and photographic evidence have been added to your case file.',
      date: '2024-01-15', 
      type: 'evidence',
      important: false
    },
    { 
      id: 4, 
      title: 'Expert witness consultation scheduled', 
      description: 'Meeting arranged with medical expert to review your case documentation.',
      date: '2024-01-12', 
      type: 'appointment',
      important: false
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    { 
      id: 1, 
      title: 'Attorney Consultation', 
      date: '2024-01-25', 
      time: '10:00 AM', 
      type: 'meeting',
      location: 'Law Office',
      description: 'Discuss settlement offer and next steps'
    },
    { 
      id: 2, 
      title: 'Medical Examination', 
      date: '2024-01-28', 
      time: '02:00 PM', 
      type: 'medical',
      location: 'Medical Center',
      description: 'Follow-up examination with specialist'
    },
    { 
      id: 3, 
      title: 'Settlement Conference', 
      date: '2024-02-02', 
      time: '09:00 AM', 
      type: 'court',
      location: 'Courthouse',
      description: 'Mediation session with opposing party'
    }
  ];

  // Mock billing information
  const billingInfo = [
    { 
      id: 1, 
      description: 'Legal Consultation - January', 
      amount: 1500, 
      status: 'paid', 
      date: '2024-01-15',
      invoice: 'INV-001'
    },
    { 
      id: 2, 
      description: 'Document Preparation & Review', 
      amount: 750, 
      status: 'pending', 
      date: '2024-01-20',
      invoice: 'INV-002'
    },
    { 
      id: 3, 
      description: 'Court Filing Fees', 
      amount: 350, 
      status: 'paid', 
      date: '2024-01-10',
      invoice: 'INV-003'
    }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Case Overview', icon: Home },
    { id: 'documents', label: 'My Documents', icon: FolderOpen, count: recentDocuments.length },
    { id: 'calendar', label: 'Appointments', icon: Calendar, count: upcomingEvents.length },
    { id: 'communications', label: 'Messages', icon: MessageCircle, count: 2 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'case-updates', label: 'Case Updates', icon: Activity },
    { id: 'support', label: 'Help & Support', icon: Info }
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

  const getDocumentIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type.toLowerCase()) {
      case 'medical': return <Clock className={`${iconClass} text-red-600`} />;
      case 'legal': return <FileText className={`${iconClass} text-blue-600`} />;
      case 'evidence': return <Eye className={`${iconClass} text-orange-600`} />;
      case 'insurance': return <CreditCard className={`${iconClass} text-green-600`} />;
      default: return <FileText className={`${iconClass} text-slate-600`} />;
    }
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'important': return 'bg-red-100 text-red-800 border-red-200';
      case 'viewed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getUpdateIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type.toLowerCase()) {
      case 'medical': return <Clock className={`${iconClass} text-red-600`} />;
      case 'legal': return <FileText className={`${iconClass} text-blue-600`} />;
      case 'evidence': return <Eye className={`${iconClass} text-orange-600`} />;
      case 'appointment': return <Calendar className={`${iconClass} text-purple-600`} />;
      default: return <Activity className={`${iconClass} text-slate-600`} />;
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CM</span>
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">CaseMate</h2>
                  <p className="text-xs text-slate-500">Client Portal</p>
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
                    ? 'bg-purple-50 text-purple-600 border border-purple-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="ml-3 font-medium">{item.label}</span>
                    {item.count && (
                      <span className="ml-auto bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
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
              {/* Case Info */}
              <div className="text-xs text-slate-500">
                <p>Case: {caseInfo.caseNumber}</p>
                <p className="font-medium text-slate-700">{caseInfo.caseType}</p>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">Client since {user.memberSince}</p>
                </div>
                <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
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
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-slate-600">{formatDate(currentTime)} • {formatTime(currentTime)}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents, updates..."
                  className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          {/* Case Overview Card */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm opacity-90 mb-2">Case Number</h3>
                <p className="text-2xl font-bold">{caseInfo.caseNumber}</p>
              </div>
              <div>
                <h3 className="text-sm opacity-90 mb-2">Case Type</h3>
                <p className="text-2xl font-bold">{caseInfo.caseType}</p>
              </div>
              <div>
                <h3 className="text-sm opacity-90 mb-2">Your Attorney</h3>
                <p className="text-2xl font-bold">{caseInfo.attorney}</p>
              </div>
              <div>
                <h3 className="text-sm opacity-90 mb-2">Status</h3>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <p className="text-2xl font-bold">{caseInfo.status}</p>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Case Progress</span>
                <span className="text-sm font-medium">{caseInfo.progress}% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${caseInfo.progress}%` }}
                ></div>
              </div>
              <p className="text-sm opacity-90 mt-2">Estimated completion: {caseInfo.estimatedCompletion}</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Documents */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Documents</h3>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border shadow-sm">
                            {getDocumentIcon(doc.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.name}</h4>
                              <p className="text-xs text-slate-600 mt-1">{doc.description}</p>
                              <div className="flex items-center mt-2 text-xs text-slate-500">
                                <span>{doc.type}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.size}</span>
                                <span className="mx-2">•</span>
                                <span>{doc.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDocumentStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Upcoming Events</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-slate-900">{event.title}</h4>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            event.type === 'meeting' ? 'bg-blue-100' :
                            event.type === 'medical' ? 'bg-red-100' : 'bg-purple-100'
                          }`}>
                            {event.type === 'meeting' && <User className="w-4 h-4 text-blue-600" />}
                            {event.type === 'medical' && <Clock className="w-4 h-4 text-red-600" />}
                            {event.type === 'court' && <Calendar className="w-4 h-4 text-purple-600" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{event.description}</p>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <span className="w-3 h-3 mr-1">📍</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Case Updates */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">Case Updates</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {caseUpdates.slice(0, 3).map((update) => (
                      <div key={update.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            update.important ? 'bg-red-100' : 'bg-slate-100'
                          }`}>
                            {getUpdateIcon(update.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className="text-sm font-medium text-slate-900">{update.title}</h4>
                            {update.important && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{update.description}</p>
                          <p className="text-xs text-slate-400 mt-2">{update.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow border">
                    <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-slate-900 font-medium">Message Your Attorney</span>
                  </button>
                  <button className="w-full flex items-center justify-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow border">
                    <Phone className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-slate-900 font-medium">Schedule Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900">Billing Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {billingInfo.map((bill) => (
                    <div key={bill.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          bill.status === 'paid' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'
                        }`}>
                          {bill.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
                        <span className="text-xl font-bold text-slate-900">${bill.amount}</span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">{bill.description}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{bill.date}</span>
                        <span>{bill.invoice}</span>
                      </div>
                    </div>
                  ))}
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
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-600 font-medium">Message Attorney</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-200">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-600 font-medium">Schedule Meeting</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-200 border border-orange-200">
                  <FileText className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-orange-600 font-medium">View All Documents</span>
                </button>
                <button className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-200">
                  <CreditCard className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-purple-600 font-medium">View Billing</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernClientDashboard;