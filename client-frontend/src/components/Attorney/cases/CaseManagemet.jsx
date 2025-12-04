import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Calendar,
  FileText,
  User,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  MapPin,
  MessageSquare,
  Paperclip
} from 'lucide-react';

const SimpleCasesManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [cases, setCases] = useState([
    {
      id: 1,
      caseNumber: 'CM-2024-001',
      title: 'Smith Divorce Case',
      client: 'John Doe',
      caseType: 'Divorce',
      status: 'Active',
      priority: 'High',
      dateOpened: '2024-01-15',
      courtDate: '2024-02-20',
      assignedAttorney: 'Sarah Johnson',
      opposingParty: 'Jane Doe',
      opposingCounsel: 'Michael Attorney',
      description: 'Divorce proceeding with custody dispute',
      estimatedValue: 50000,
      progress: 45,
      court: 'Superior Court of California',
      caseHistory: [
        { date: '2024-01-20', event: 'Initial consultation completed', type: 'meeting' },
        { date: '2024-01-18', event: 'Documents filed with court', type: 'filing' },
        { date: '2024-01-15', event: 'Case opened and assigned', type: 'status' }
      ],
      documents: 3,
      notes: 'Client seeking full custody of two minor children'
    },
    {
      id: 2,
      caseNumber: 'CM-2024-002',
      title: 'Brown Personal Injury',
      client: 'Jane Smith',
      caseType: 'Personal Injury',
      status: 'Active',
      priority: 'Medium',
      dateOpened: '2024-01-10',
      courtDate: '2024-03-15',
      assignedAttorney: 'Sarah Johnson',
      opposingParty: 'ABC Insurance Co.',
      opposingCounsel: 'Defense Firm LLP',
      description: 'Car accident injury claim',
      estimatedValue: 150000,
      progress: 60,
      court: 'Los Angeles County Court',
      caseHistory: [
        { date: '2024-01-19', event: 'Medical evaluation completed', type: 'medical' },
        { date: '2024-01-12', event: 'Settlement offer received', type: 'negotiation' },
        { date: '2024-01-10', event: 'Case initiated', type: 'status' }
      ],
      documents: 8,
      notes: 'Strong evidence, expecting favorable settlement'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    caseType: '',
    status: 'Active',
    priority: 'Medium',
    opposingParty: '',
    opposingCounsel: '',
    courtDate: '',
    court: '',
    description: '',
    estimatedValue: '',
    notes: ''
  });

  const caseTypes = ['Divorce', 'Personal Injury', 'Criminal Defense', 'Corporate Law', 'Real Estate', 'Immigration', 'Estate Planning', 'Other'];
  const statusOptions = ['Active', 'On Hold', 'Pending', 'Closed'];
  const priorityLevels = ['Low', 'Medium', 'High', 'Urgent'];

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCase = () => {
    if (formData.title && formData.client && formData.caseType) {
      const newCase = {
        id: Date.now(),
        caseNumber: `CM-2024-${String(cases.length + 1).padStart(3, '0')}`,
        ...formData,
        dateOpened: new Date().toISOString().split('T')[0],
        assignedAttorney: 'Sarah Johnson',
        progress: 0,
        caseHistory: [
          { date: new Date().toISOString().split('T')[0], event: 'Case opened', type: 'status' }
        ],
        documents: 0
      };
      setCases(prev => [...prev, newCase]);
      setFormData({ 
        title: '', client: '', caseType: '', status: 'Active', priority: 'Medium', 
        opposingParty: '', opposingCounsel: '', courtDate: '', court: '', 
        description: '', estimatedValue: '', notes: '' 
      });
      setCurrentView('list');
    }
  };

  const handleUpdateCase = () => {
    const updatedCase = {
      ...selectedCase,
      ...formData,
      caseHistory: [
        { date: new Date().toISOString().split('T')[0], event: 'Case information updated', type: 'update' },
        ...selectedCase.caseHistory
      ]
    };
    setCases(prev => prev.map(caseItem => 
      caseItem.id === selectedCase.id ? updatedCase : caseItem
    ));
    setSelectedCase(updatedCase);
    setCurrentView('view');
  };

  const startEdit = (caseItem) => {
    setSelectedCase(caseItem);
    setFormData({
      title: caseItem.title,
      client: caseItem.client,
      caseType: caseItem.caseType,
      status: caseItem.status,
      priority: caseItem.priority,
      opposingParty: caseItem.opposingParty,
      opposingCounsel: caseItem.opposingCounsel || '',
      courtDate: caseItem.courtDate || '',
      court: caseItem.court || '',
      description: caseItem.description,
      estimatedValue: caseItem.estimatedValue,
      notes: caseItem.notes || ''
    });
    setCurrentView('edit');
  };

  const viewCase = (caseItem) => {
    setSelectedCase(caseItem);
    setCurrentView('view');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-800 bg-green-100';
      case 'On Hold': return 'text-yellow-800 bg-yellow-100';
      case 'Pending': return 'text-blue-800 bg-blue-100';
      case 'Closed': return 'text-slate-800 bg-slate-100';
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

  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4 text-blue-600" />;
      case 'filing': return <FileText className="w-4 h-4 text-green-600" />;
      case 'medical': return <Clock className="w-4 h-4 text-red-600" />;
      case 'negotiation': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'status': return <AlertCircle className="w-4 h-4 text-slate-600" />;
      default: return <CheckCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  if (currentView === 'list') {
    return (
      <div className="min-h-scree p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cases</h2>
            <p className="text-slate-600">Manage your legal cases</p>
          </div>
          <button
            onClick={() => setCurrentView('add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Case</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Cases</p>
                <p className="text-2xl font-bold text-slate-900">{cases.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'Active').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">On Hold</p>
                <p className="text-2xl font-bold text-yellow-600">{cases.filter(c => c.status === 'On Hold').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Closed</p>
                <p className="text-2xl font-bold text-slate-600">{cases.filter(c => c.status === 'Closed').length}</p>
              </div>
              <XCircle className="w-8 h-8 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Court Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{caseItem.title}</div>
                    <div className="text-sm text-slate-500">{caseItem.caseNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{caseItem.client}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{caseItem.caseType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{caseItem.courtDate || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => viewCase(caseItem)} className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => startEdit(caseItem)} className="text-green-600 hover:text-green-900 p-1">
                      <Edit className="w-4 h-4" />
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
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Case</h2>
            <p className="text-slate-600">Enter case information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Case Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Smith Divorce Case"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Case Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.caseType}
                onChange={(e) => handleInputChange('caseType', e.target.value)}
              >
                <option value="">Select type</option>
                {caseTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                {priorityLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opposing Party</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.opposingParty}
                onChange={(e) => handleInputChange('opposingParty', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opposing Counsel</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.opposingCounsel}
                onChange={(e) => handleInputChange('opposingCounsel', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.courtDate}
                onChange={(e) => handleInputChange('courtDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.court}
                onChange={(e) => handleInputChange('court', e.target.value)}
                placeholder="Superior Court"
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Case description..."
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>
          <div className="mt-6 flex space-x-3">
            <button onClick={handleAddCase} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Create Case</span>
            </button>
            <button onClick={() => setCurrentView('list')} className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'view' && selectedCase) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedCase.title}</h2>
              <p className="text-slate-600">{selectedCase.caseNumber}</p>
            </div>
          </div>
          <button onClick={() => startEdit(selectedCase)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Case</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Client</label>
                  <div className="flex items-center text-slate-900">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedCase.client}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Case Type</label>
                  <div className="flex items-center text-slate-900">
                    <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedCase.caseType}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Opposing Party</label>
                  <p className="text-slate-900">{selectedCase.opposingParty}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Opposing Counsel</label>
                  <p className="text-slate-900">{selectedCase.opposingCounsel || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Assigned Attorney</label>
                  <p className="text-slate-900">{selectedCase.assignedAttorney}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Court</label>
                  <div className="flex items-center text-slate-900">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedCase.court || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Court Date</label>
                  <div className="flex items-center text-slate-900">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedCase.courtDate || 'Not scheduled'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Estimated Value</label>
                  <div className="flex items-center text-slate-900">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    ${selectedCase.estimatedValue?.toLocaleString() || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{selectedCase.description}</p>
              </div>
              {selectedCase.notes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Notes</label>
                  <p className="text-slate-900 bg-blue-50 p-4 rounded-lg border border-blue-200">{selectedCase.notes}</p>
                </div>
              )}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Case Progress</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedCase.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{selectedCase.progress}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Case History</h3>
              <div className="space-y-4">
                {selectedCase.caseHistory.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{event.event}</p>
                      <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Paperclip className="w-4 h-4 mr-2" />
                  View Documents ({selectedCase.documents})
                </button>
                <button className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </button>
                <button className="w-full flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Client
                </button>
                <button className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status & Priority</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Priority</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedCase.priority)}`}>
                    {selectedCase.priority}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Dates</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Date Opened</label>
                  <p className="text-sm text-slate-900">{selectedCase.dateOpened}</p>
                </div>
                {selectedCase.courtDate && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Next Court Date</label>
                    <p className="text-sm font-medium text-blue-600">{selectedCase.courtDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'edit' && selectedCase) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('view')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Case</h2>
            <p className="text-slate-600">{selectedCase.caseNumber}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Case Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Case Type</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.caseType}
                onChange={(e) => handleInputChange('caseType', e.target.value)}
              >
                <option value="">Select type</option>
                {caseTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                {priorityLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opposing Party</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.opposingParty}
                onChange={(e) => handleInputChange('opposingParty', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opposing Counsel</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.opposingCounsel}
                onChange={(e) => handleInputChange('opposingCounsel', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court Date</label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.courtDate}
                onChange={(e) => handleInputChange('courtDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.court}
                onChange={(e) => handleInputChange('court', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Value</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.estimatedValue}
                onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Case Description</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
          <div className="mt-6 flex space-x-3">
            <button onClick={handleUpdateCase} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button onClick={() => setCurrentView('view')} className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SimpleCasesManagement;