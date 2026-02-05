import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import toast from 'react-hot-toast';
import { Users, Plus, Search, Eye, Edit, Phone, Mail, Calendar, FileText, X, User, MapPin, Briefcase, Check, ArrowLeft, Trash2 } from 'lucide-react';
import {
  fetchClients,
  createClients,
  updateClients,
  deleteClients,
  setSelectedClient,
  setSearchTerm,
  clearError
} from '../../../store/slices/clientSlice';

const SimpleClientManagement = () => {
  // Redux state
  const dispatch = useDispatch();
  const {
    list: clients,
    selectedClient,
    searchTerm,
    loading,
    error
  } = useSelector((state) => state.clients);

  // Local State
  const [currentView, setCurrentView] = useState('list');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    caseType: '',
    status: 'Active', 
    notes: ''
  });

  // Fetch clients on mount
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      caseType: '',
      status : 'Active',
      notes: ''
    });
  };

  // Reset form when view changes
  useEffect(() => {
    if(currentView === 'add'){
      resetForm();
    }
  }, [currentView]);

  const filteredClients = Array.isArray(clients) ? clients.filter(client =>
    client && client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client && client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client && client.caseType && client.caseType.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleInputChange = (field, value) => {
    if(field.startsWith('address')){
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({...prev, [field]: value}));
    }
  };

const handleAddClient = async() => {
  if(!formData.name || !formData.email || !formData.phone){
    toast.error('Please fill in all required fields');
    return;
  }

  try{
    // Clean the data before sending
    const cleanData = {
      name: String(formData.name).trim(),
      email: String(formData.email).trim().toLowerCase(),
      phone: String(formData.phone).trim(),
      caseType: String(formData.caseType || 'Other'),  // ✅ Ensure it's a string
      address: {
        street: String(formData.address?.street || ''),
        city: String(formData.address?.city || ''),
        state: String(formData.address?.state || ''),
        zipCode: String(formData.address?.zipCode || '')
      },
      notes: String(formData.notes || '')
    };

    await dispatch(createClients(cleanData)).unwrap();
    toast.success('Client added successfully!');
    resetForm();
    setCurrentView('list');
  }catch(error){
    console.error('Error adding client:', error);
    toast.error(error?.message || 'Failed to add client');
  }
};

 const handleUpdateClient = async() => {
  if(!formData.name || !formData.email || !formData.phone){
    toast.error('Please fill in all required fields');
    return;
  }

  try{
    // Clean the data before sending
    const cleanData = {
      name: String(formData.name).trim(),
      email: String(formData.email).trim().toLowerCase(),
      phone: String(formData.phone).trim(),
      caseType: String(formData.caseType || 'Other'),  // ✅ Ensure it's a string
      status: String(formData.status || 'Active'),      // ✅ Ensure it's a string
      address: {
        street: String(formData.address?.street || ''),
        city: String(formData.address?.city || ''),
        state: String(formData.address?.state || ''),
        zipCode: String(formData.address?.zipCode || '')
      },
      notes: String(formData.notes || '')
    };

    await dispatch(updateClients({
      clientId: selectedClient._id,
      clientData: cleanData  // ✅ Send clean data
    })).unwrap();

    toast.success('Client updated successfully');
    setCurrentView('view');
  }catch(error){
    console.error('Error updating client:', error);
    toast.error(error?.message || 'Failed to update client');
  }
};


  const handleDeleteClient = async(clientId) => {
    try{
      await dispatch(deleteClients(clientId)).unwrap();
      toast.success('Client Deleted Successfully!');
      setDeleteConfirm(null);
      if(currentView === 'view'){
        setCurrentView('list');
      }
    }catch(error){
      console.log(error);
    }
  };

  const handleViewClient = (client) => {
    dispatch(setSelectedClient(client));
    setCurrentView('view');
  };

  const handleStartEdit = (client) => {
    dispatch(setSelectedClient(client));
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || {street: '', city: '', state: '', zipCode: ''},
      caseType: client.caseType || '',
      status : client.status || 'Active',
      notes: client.notes || ''
    });
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    dispatch(setSelectedClient(null));
    resetForm();
  };

  const CASE_TYPES = ['Criminal', 'Civil', 'Family', 'Corporate', 'Immigration', 'Bankruptcy', 'Other'];

  // Client List View
  if (currentView === 'list') {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Clients</h2>
            <p className="text-slate-600">Manage your client information</p>
          </div>
          <button
            onClick={() => setCurrentView('add')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Client Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-lg">No clients found</p>
                      <p className="text-slate-400 text-sm mt-1">Add your first client to get started</p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-white font-semibold text-sm">
                              {client.avatar || client.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                            <div className="text-sm text-slate-500">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{client.phone}</div>
                        <div className="text-xs text-slate-500">
                          {client.address?.city || 'No location'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'Active'
                            ? 'text-green-800 bg-green-100 border border-green-200'
                            : 'text-yellow-800 bg-yellow-100 border border-yellow-200'
                        }`}>
                          {client.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="text-blue-600 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(client)}
                            className="text-green-600 hover:text-green-900 p-1.5 hover:bg-green-50 rounded transition-colors"
                            title="Edit Client"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.location.href = `tel:${client.phone}`}
                            className="text-purple-600 hover:text-purple-900 p-1.5 hover:bg-purple-50 rounded transition-colors"
                            title="Call Client"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(client._id)}
                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Delete Client</h3>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this client? This action cannot be undone and will remove all associated data.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClient(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

 // ========================
// ADD CLIENT FORM - MODERN
// ========================
if (currentView === 'add') {
  const CASE_TYPES = ['Criminal', 'Civil', 'Family', 'Corporate', 'Immigration', 'Bankruptcy', 'Other'];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
          <h1 className="text-4xl font-bold text-slate-900">Add New Client</h1>
          <p className="text-slate-600 mt-2">Fill in the information below to add a new client to your system</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        
        {/* Form Content */}
        <div className="p-8">
          
          {/* Section 1: Basic Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
              <span className="ml-auto text-xs text-red-500 font-semibold">* Required fields</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Initial Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Initial Status
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white hover:border-slate-400 appearance-none font-medium"
                    value={formData.status || 'Active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Case Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Case Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Case Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Case Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white hover:border-slate-400 appearance-none"
                    value={formData.caseType || ''}
                    onChange={(e) => handleInputChange('caseType', e.target.value)}
                  >
                    <option value="">Select a case type</option>
                    {CASE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500 mt-2">Select the primary type of case for this client</p>
              </div>
            </div>
          </div>

          {/* Section 3: Address Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Address Information</h2>
            </div>

            {/* Street Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                  rows={2}
                  value={formData.address?.street || ''}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
            </div>

            {/* City, State, Zip Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.city || ''}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.state || ''}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Zip Code
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Notes */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Additional Information</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any important notes or details about this client..."
              />
              <p className="text-xs text-slate-500 mt-2">
                {formData.notes.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-8 flex items-center justify-between rounded-b-xl">
          <p className="text-sm text-slate-600">
            All fields marked with <span className="text-red-500">*</span> are required
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToList}
              className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-semibold hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={handleAddClient}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Adding Client...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Add Client</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ========================
// VIEW CLIENT PROFILE - MODERN
// ========================
if (currentView === 'view' && selectedClient) {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              {/* Client Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">
                  {selectedClient.avatar || selectedClient.name.substring(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Client Header Info */}
              <div>
                <h1 className="text-4xl font-bold text-slate-900">{selectedClient.name}</h1>
                <p className="text-slate-600 mt-1">{selectedClient.email}</p>
                
                <div className="flex items-center space-x-4 mt-4">
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                    selectedClient.status === 'Active'
                      ? 'text-green-700 bg-green-100 border border-green-300'
                      : selectedClient.status === 'Inactive'
                      ? 'text-yellow-700 bg-yellow-100 border border-yellow-300'
                      : 'text-red-700 bg-red-100 border border-red-300'
                  }`}>
                    {selectedClient.status || 'Active'}
                  </span>
                  
                  {selectedClient.caseType && (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-indigo-700 bg-indigo-100 border border-indigo-300">
                      {selectedClient.caseType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStartEdit(selectedClient)}
                className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(selectedClient._id)}
                className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Contact Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <a href={`mailto:${selectedClient.email}`} className="text-lg text-blue-600 hover:text-blue-700 font-medium break-all">
                    {selectedClient.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <a href={`tel:${selectedClient.phone}`} className="text-lg text-blue-600 hover:text-blue-700 font-medium">
                    {selectedClient.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          {selectedClient.address && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedClient.address.street && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Street Address</label>
                    <p className="text-slate-900 font-medium">{selectedClient.address.street}</p>
                  </div>
                )}

                {selectedClient.address.city && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">City</label>
                    <p className="text-slate-900 font-medium">{selectedClient.address.city}</p>
                  </div>
                )}

                {selectedClient.address.state && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">State</label>
                    <p className="text-slate-900 font-medium">{selectedClient.address.state}</p>
                  </div>
                )}

                {selectedClient.address.zipCode && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Zip Code</label>
                    <p className="text-slate-900 font-medium">{selectedClient.address.zipCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Card */}
          {selectedClient.notes && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Notes</h2>
              </div>
              <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-lg border-l-4 border-purple-400 whitespace-pre-wrap">
                {selectedClient.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Quick Actions
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => window.location.href = `tel:${selectedClient.phone}`}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors font-semibold border border-blue-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Client
              </button>

              <button
                onClick={() => window.location.href = `mailto:${selectedClient.email}`}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors font-semibold border border-green-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </button>

              <button className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 rounded-lg hover:from-orange-100 hover:to-orange-200 transition-colors font-semibold border border-orange-200">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Meeting
              </button>

              <button className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors font-semibold border border-purple-200">
                <FileText className="w-5 h-5 mr-2" />
                View Documents
              </button>
            </div>
          </div>

          {/* Case Details Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
              Case Details
            </h3>

            <div className="space-y-4">
              {selectedClient.caseType && (
                <div className="pb-4 border-b border-slate-200">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Case Type</label>
                  <p className="text-slate-900 font-medium text-lg">{selectedClient.caseType}</p>
                </div>
              )}

              <div className="pb-4 border-b border-slate-200">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Current Status</label>
                <p className={`text-sm font-bold py-1 px-3 rounded-full w-fit ${
                  selectedClient.status === 'Active'
                    ? 'text-green-700 bg-green-100'
                    : selectedClient.status === 'Inactive'
                    ? 'text-yellow-700 bg-yellow-100'
                    : 'text-red-700 bg-red-100'
                }`}>
                  {selectedClient.status || 'Active'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-teal-600" />
              Timeline
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Date Added</label>
                <p className="text-slate-900 font-medium">
                  {new Date(selectedClient.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedClient.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Last Updated</label>
                <p className="text-slate-900 font-medium">
                  {new Date(selectedClient.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedClient.updatedAt).toLocaleTimeString()}
                </p>
              </div>

              {selectedClient.lastContact && (
                <div className="pt-4 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Last Contact</label>
                  <p className="text-slate-900 font-medium">
                    {new Date(selectedClient.lastContact).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
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
                <h3 className="text-2xl font-bold text-slate-900">Delete Client</h3>
              </div>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{selectedClient.name}</span>? 
              This action cannot be undone and will permanently remove all associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(deleteConfirm)}
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
  // EDIT CLIENT FORM
  // ========================
  // ========================
// EDIT CLIENT FORM
// ========================
// ========================
// EDIT CLIENT FORM - MODERN
// ========================
if (currentView === 'edit' && selectedClient) {
  const CASE_TYPES = ['Criminal', 'Civil', 'Family', 'Corporate', 'Immigration', 'Bankruptcy', 'Other'];
  const STATUS_OPTIONS = ['Active', 'Inactive', 'Closed'];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('view')}
          className="mb-4 inline-flex items-center px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Edit Client</h1>
              <p className="text-slate-600 mt-2">Update {selectedClient.name}'s information</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">Last Modified</p>
              <p className="text-slate-900 font-medium">
                {new Date(selectedClient.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        
        {/* Form Content */}
        <div className="p-8">
          
          {/* Section 1: Basic Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Status - NEW */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Client Status
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white hover:border-slate-400 appearance-none font-medium"
                    value={formData.status || 'Active'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formData.status === 'Active' && '✓ Client is actively working on cases'}
                  {formData.status === 'Inactive' && '⏸ Client account is inactive'}
                  {formData.status === 'Closed' && '✕ Client case is closed'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Case Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Briefcase className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Case Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Case Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Case Type
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white hover:border-slate-400 appearance-none"
                    value={formData.caseType || ''}
                    onChange={(e) => handleInputChange('caseType', e.target.value)}
                  >
                    <option value="">Select a case type</option>
                    {CASE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Address Information */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Address Information</h2>
            </div>
            

            {/* Street Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Street Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                <textarea
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                  rows={2}
                  value={formData.address?.street || ''}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
            </div>

            {/* City, State, Zip Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.city || ''}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.state || ''}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Zip Code
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Additional Notes */}
          <div className="mb-8">
            <div className="flex items-center mb-6 pb-4 border-b-2 border-slate-200">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Additional Information</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white hover:border-slate-400"
                rows={4}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about the client..."
              />
              <p className="text-xs text-slate-500 mt-2">
                {formData.notes.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-8 flex items-center justify-between rounded-b-xl">
          <p className="text-sm text-slate-600">
            All changes will be saved to this client's profile
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('view')}
              className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-semibold hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateClient}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center space-x-2 shadow-md hover:shadow-lg disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  return null;
};
export default SimpleClientManagement;