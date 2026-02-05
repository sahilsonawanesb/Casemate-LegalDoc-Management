import React, { useEffect, useState } from 'react';
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
  Paperclip,
  Trash2,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import {
  clearError,
  createCase,
  deleteCase,
  fetchCases,
  setFilters,
  setSelectedCase,
  updateCase} from '../../../store/slices/caseSlice';
import { fetchClients } from '../../../store/slices/clientSlice';

/* ================= CONSTANTS ================= */
const statusOptions = ["Active", "On Hold", "Pending", "Closed"];
const priorityLevels = ["Urgent", "High", "Medium", "Low"];
const caseTypes = [
  'Divorce',
  'Personal Injury',
  'Criminal Defense',
  'Corporate Law',
  'Real Estate',
  'Immigration',
  'Employment',
  'Intellectual Property',
  'Tax Law',
  'Other'
];

const SimpleCasesManagement = () => {

  const dispatch = useDispatch();

  const caseState = useSelector((state) => state.cases);
  const cases = caseState.list || [];
  const selectedCase = caseState.selectedCase;
  const searchTerm = caseState.searchTerm || '';
  const filters = caseState.filters || {};
  const error = caseState.error;

  const { list: clients = [] } = useSelector((state) => state.clients);

  /* ================= LOCAL STATE ================= */
  const [currentView, setCurrentView] = useState('list');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    caseTitle: '',
    clientId: '',
    caseType: '',
    priority: 'Medium',
    status: 'Active',
    opposingParty: '',
    opposingCounsel: { name: '', email: '', phone: '' },
    courtName: '',
    courtDate: '',
    description: '',
    notes: '',
    estimatedValue: '',
    billingRate: ''
  });

  /* ================= EFFECTS ================= */
  useEffect(() => {
  dispatch(fetchCases());
  dispatch(fetchClients());
}, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setFormData({
      caseTitle: '',
      clientId: '',
      caseType: '',
      priority: 'Medium',
      status: 'Active',
      opposingParty: '',
      opposingCounsel: { name: '', email: '', phone: '' },
      courtName: '',
      courtDate: '',
      description: '',
      notes: '',
      estimatedValue: '',
      billingRate: ''
    });
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('opposingCounsel.')) {
      const key = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        opposingCounsel: { ...prev.opposingCounsel, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  /* ================= FILTER ================= */

//   const filters = caseState?.filters ?? {
//   status: 'All',
//   priority: 'All',
//   caseType: 'All',
// };
  const filteredCases = cases.filter(c => {
    if (!c) return false;

    const title = (c.title || '').toLowerCase();
    const number = (c.caseNumber || '').toLowerCase();
    const clientName = (c.client?.name || c.clientId?.name || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchSearch =
      title.includes(search) ||
      number.includes(search) ||
      clientName.includes(search);

    const matchStatus =
      !filters.status || 
      filters.status === '' || 
      filters.status === 'all' || 
      filters.status === 'All' || 
      c.status === filters.status;

    return matchSearch && matchStatus;
  });

  /* ================= PAYLOAD BUILDER ================= */
  const buildPayload = () => ({
    title: formData.caseTitle,
    clientId: formData.clientId,
    caseType: formData.caseType,
    priority: formData.priority,
    status: formData.status,
    opposingParty: formData.opposingParty,
    opposingCounsel: formData.opposingCounsel,
    courtName: formData.courtName,
    courtDate: formData.courtDate,
    courtDescription: formData.description,
    notes: formData.notes,
    estimatedValue: formData.estimatedValue,
    billingRate: formData.billingRate
  });

  /* ================= ACTIONS ================= */
  const handleAddCase = async () => {
    if (!formData.caseTitle || !formData.clientId || !formData.caseType) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      await dispatch(createCase(buildPayload())).unwrap();
      toast.success('Case created successfully');
      resetForm();
      setCurrentView('list');
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCase = async () => {
    try {
      await dispatch(updateCase({
        caseId: selectedCase._id,
        caseData: buildPayload()
      })).unwrap();
      toast.success('Case updated');
      setCurrentView('view');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCase = async (id) => {
    try {
      await dispatch(deleteCase(id)).unwrap();
      toast.success('Case deleted');
      setDeleteConfirm(null);
      setCurrentView('list');
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (c) => {
    dispatch(setSelectedCase(c));
    setFormData({
      caseTitle: c.title || '',
      clientId: c.clientId?._id || '',
      caseType: c.caseType || '',
      priority: c.priority || 'Medium',
      status: c.status || 'Active',
      opposingParty: c.opposingParty || '',
      opposingCounsel: c.opposingCounsel || { name: '', email: '', phone: '' },
      courtName: c.courtName || '',
      courtDate: c.courtDate?.split('T')[0] || '',
      description: c.courtDescription || '',
      notes: c.notes || '',
      estimatedValue: c.estimatedValue || '',
      billingRate: c.billingRate || ''
    });
    setCurrentView('edit');
  };

  const handleViewCase = (c) => {
    dispatch(setSelectedCase(c));
    setCurrentView('view');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-800 bg-green-100 border border-green-200';
      case 'On Hold': return 'text-yellow-800 bg-yellow-100 border border-yellow-200';
      case 'Pending': return 'text-blue-800 bg-blue-100 border border-blue-200';
      case 'Closed': return 'text-slate-800 bg-slate-100 border border-slate-200';
      default: return 'text-slate-800 bg-slate-100 border border-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-700 bg-red-100 border border-red-200';
      case 'High': return 'text-orange-700 bg-orange-100 border border-orange-200';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'Low': return 'text-green-700 bg-green-100 border border-green-200';
      default: return 'text-slate-700 bg-slate-100 border border-slate-200';
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

  // ========================
  // LIST VIEW
  // ========================
  if (currentView === 'list') {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Cases</h1>
              <p className="text-slate-600 mt-2">Manage and track your legal cases</p>
            </div>
            <button
              onClick={() => setCurrentView('add')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Case
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Cases</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{cases.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Active</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{cases.filter(c => c?.status === 'Active').length}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">On Hold</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">{cases.filter(c => c?.status === 'On Hold').length}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Closed</p>
                  <p className="text-3xl font-bold text-slate-600 mt-2">{cases.filter(c => c?.status === 'Closed').length}</p>
                </div>
                <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases, case numbers, or clients..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => dispatch(setFilters({ searchTerm: e.target.value }))}
              />
            </div>
            <select
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none font-medium"
              value={filters.status || 'all'}
              onChange={(e) => dispatch(setFilters({status : e.target.value}))}
            >
              <option value="all">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Case</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Court Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCases.map((caseItem) => (
                <tr key={caseItem._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{caseItem.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{caseItem.caseNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{caseItem.client?.name || caseItem.clientId?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{caseItem.caseType}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{caseItem.courtDate || 'Not scheduled'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewCase(caseItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleStartEdit(caseItem)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Case"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCases.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-600 font-medium">No cases found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========================
  // ADD CASE VIEW
  // ========================
  if (currentView === 'add') {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
            <h1 className="text-4xl font-bold text-slate-900">Create New Case</h1>
            <p className="text-slate-600 mt-2">Fill in the information below to create a new case</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                <span className="ml-auto text-xs text-red-500 font-semibold">* Required</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Case Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.caseTitle}
                    onChange={(e) => handleInputChange('caseTitle', e.target.value)}
                    placeholder="Smith Divorce Case"
                  />
                </div>

                <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Client <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  value={formData.clientId}
                  onChange={(e) =>
                    handleInputChange('clientId', e.target.value)
                  }
                >
                  <option value="">Select Client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Case Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.caseType}
                    onChange={(e) => handleInputChange('caseType', e.target.value)}
                  >
                    <option value="">Select case type</option>
                    {caseTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority Level</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    {priorityLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Value</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>

            {/* Parties Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Parties Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Opposing Party</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.opposingParty}
                    onChange={(e) => handleInputChange('opposingParty', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Opposing Counsel</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.opposingCounsel.name}
                    onChange={(e) => handleInputChange('opposingCounsel.name', e.target.value)}
                    placeholder="Michael Attorney"
                  />
                </div>
              </div>
            </div>

            {/* Court Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Court Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Court Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.courtName}
                    onChange={(e) => handleInputChange('courtName', e.target.value)}
                    placeholder="Superior Court of California"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Court Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.courtDate}
                    onChange={(e) => handleInputChange('courtDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Case Details</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Case Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the case..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-8 flex items-center justify-end space-x-3 rounded-b-xl">
            <button
              onClick={() => setCurrentView('list')}
              className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddCase()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>Create Case</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // VIEW CASE
  // ========================
  if (currentView === 'view' && selectedCase) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">{selectedCase.title}</h1>
                <p className="text-slate-600 mt-2">{selectedCase.caseNumber}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStartEdit(selectedCase)}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Case
                </button>
                <button
                  onClick={() => handleDeleteCase(selectedCase._id)}
                  className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Information */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Case Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Client</label>
                  <div className="flex items-center text-slate-900">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    <p className="font-medium">{selectedCase.client?.name || selectedCase.clientId?.name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Case Type</label>
                  <div className="flex items-center text-slate-900">
                    <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                    <p className="font-medium">{selectedCase.caseType}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Opposing Party</label>
                  <p className="font-medium text-slate-900">{selectedCase.opposingParty || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Opposing Counsel</label>
                  <p className="font-medium text-slate-900">{selectedCase.opposingCounsel?.name || selectedCase.opposingCounsel || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Assigned Attorney</label>
                  <p className="font-medium text-slate-900">{selectedCase.assignedAttorney || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Court</label>
                  <div className="flex items-center text-slate-900">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    <p className="font-medium">{selectedCase.courtName || selectedCase.court || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Court Date</label>
                  <div className="flex items-center text-slate-900">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <p className="font-medium">{selectedCase.courtDate || 'Not scheduled'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Estimated Value</label>
                  <div className="flex items-center text-slate-900">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    <p className="font-medium">${selectedCase.estimatedValue?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Description</label>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg border border-slate-200">{selectedCase.courtDescription || selectedCase.description || 'No description provided'}</p>
              </div>

              {selectedCase.notes && (
                <div className="mt-6">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Notes</label>
                  <p className="text-slate-900 bg-blue-50 p-4 rounded-lg border border-blue-200">{selectedCase.notes}</p>
                </div>
              )}

              {selectedCase.progress !== undefined && (
                <div className="mt-6">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Progress</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-slate-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedCase.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-12">{selectedCase.progress}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Case History */}
            {selectedCase.caseHistory && selectedCase.caseHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Case History</h2>
                </div>

                <div className="space-y-4">
                  {selectedCase.caseHistory.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b border-slate-100 last:border-0">
                      <div className="flex-shrink-0 mt-1 p-2 bg-slate-50 rounded-lg">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{event.event}</p>
                        <p className="text-xs text-slate-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Documents ({selectedCase.documents || 0})
                </button>

                <button className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Event
                </button>

                <button className="w-full flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium border border-orange-200">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Client
                </button>

                <button className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium border border-purple-200">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-indigo-600" />
                Status & Priority
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Status</label>
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Priority</label>
                  <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${getPriorityColor(selectedCase.priority)}`}>
                    {selectedCase.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-teal-600" />
                Key Dates
              </h3>

              <div className="space-y-4">
                {selectedCase.dateOpened && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Date Opened</label>
                    <p className="text-sm font-medium text-slate-900">{selectedCase.dateOpened}</p>
                  </div>
                )}

                {selectedCase.courtDate && (
                  <div className="pt-4 border-t border-slate-200">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Next Court Date</label>
                    <p className="text-sm font-bold text-blue-600">{selectedCase.courtDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Delete Case</h3>
                </div>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedCase.title}</span>? 
                This action cannot be undone and will permanently remove all case data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCase(selectedCase._id)}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========================
  // EDIT CASE
  // ========================
  if (currentView === 'edit' && selectedCase) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('view')}
            className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Case
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
            <h1 className="text-4xl font-bold text-slate-900">Edit Case</h1>
            <p className="text-slate-600 mt-2">{selectedCase.caseNumber}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Case Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.caseTitle}
                    onChange={(e) => handleInputChange('caseTitle', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.clientId}
                    onChange={(e) => handleInputChange('clientId', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Case Type</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.caseType}
                    onChange={(e) => handleInputChange('caseType', e.target.value)}
                  >
                    {caseTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    {priorityLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estimated Value</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.estimatedValue}
                    onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Parties Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Parties Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Opposing Party</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.opposingParty}
                    onChange={(e) => handleInputChange('opposingParty', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Opposing Counsel</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.opposingCounsel.name}
                    onChange={(e) => handleInputChange('opposingCounsel.name', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Court Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Court Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Court Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.courtName}
                    onChange={(e) => handleInputChange('courtName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Court Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.courtDate}
                    onChange={(e) => handleInputChange('courtDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="mb-8">
              <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Case Details</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Case Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-8 flex items-center justify-end space-x-3 rounded-b-xl">
            <button
              onClick={() => setCurrentView('view')}
              className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateCase}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Check className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SimpleCasesManagement;