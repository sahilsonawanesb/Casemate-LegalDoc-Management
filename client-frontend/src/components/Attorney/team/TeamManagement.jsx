import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Users, 
  Plus, 
  Search, 
  Eye,
  Edit,
  User,
  ArrowLeft,
  Check,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  CheckSquare,
  FileText,
  Activity,
  Award,
  Clock,
  TrendingUp,
  Trash2,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';

// Import Redux actions and selectors
import {
  fetchAllTeamMembers,
  fetchTeamMemberById,
  createTeamMember,
  modifyTeamMember,
  removeTeamMember,
  assignCase,
  unassignCase,
  fetchTeamMemberWorkload,
  fetchTeamStats,
  searchMembers,
  setFilters,
  clearFilters,
  clearSelectedTeamMember,
  clearSearchResults,
  clearError,
  selectAllTeamMembers,
  selectSelectedTeamMember,
  selectTeamLoading,
  selectTeamError,
  selectTeamFilters,
  selectTeamStats,
  selectTeamWorkloads,
  selectSearchResults,
  selectTotalCount
} from '../../../store/slices/teamSlice';

const TeamManagement = () => {
  // Redux
  const dispatch = useDispatch();
  const teamMembers = useSelector(selectAllTeamMembers);
  const selectedMember = useSelector(selectSelectedTeamMember);
  const loading = useSelector(selectTeamLoading);
  const error = useSelector(selectTeamError);
  const filters = useSelector(selectTeamFilters);
  const stats = useSelector(selectTeamStats);
  const workloads = useSelector(selectTeamWorkloads);
  const searchResults = useSelector(selectSearchResults);
  const totalCount = useSelector(selectTotalCount);

  // Local state
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showAssignCaseModal, setShowAssignCaseModal] = useState(false);
  const [selectedMemberForCase, setSelectedMemberForCase] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Legal Assistant',
    specializations: [],
    employmentType: 'Full-time',
    department: '',
    bio: '',
    notes: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    workSchedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    }
  });

  const [caseAssignData, setCaseAssignData] = useState({
    caseId: '',
    role: ''
  });

  const roles = ['Legal Assistant', 'Paralegal', 'Junior Associate', 'Senior Associate', 'Law Clerk', 'Office Manager'];
  const specializations = ['Family Law', 'Corporate Law', 'Personal Injury', 'Criminal Defense', 'Real Estate', 'Immigration', 'Tax Law', 'Employment Law'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];
  const departments = ['Litigation', 'Corporate', 'Family Law', 'Criminal Defense', 'Real Estate', 'Administration'];

  // Fetch team members on mount
  useEffect(() => {
    dispatch(fetchAllTeamMembers(filters));
    dispatch(fetchTeamStats());
  }, [dispatch, filters]);

  // Fetch workload when viewing a member
  useEffect(() => {
    if (currentView === 'view' && selectedMember) {
      dispatch(fetchTeamMemberWorkload(selectedMember._id));
    }
  }, [currentView, selectedMember, dispatch]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      const delaySearch = setTimeout(() => {
        dispatch(searchMembers(searchTerm));
      }, 500);
      return () => clearTimeout(delaySearch);
    } else {
      dispatch(clearSearchResults());
    }
  }, [searchTerm, dispatch]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const displayedMembers = searchTerm.trim().length > 2 ? searchResults : teamMembers;

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddMember = async () => {
    if (formData.name && formData.email && formData.role) {
      const result = await dispatch(createTeamMember(formData));
      if (result.type.endsWith('/fulfilled')) {
        resetForm();
        setCurrentView('list');
      }
    }
  };

  const handleUpdateMember = async () => {
    const result = await dispatch(modifyTeamMember({ 
      id: selectedMember._id, 
      memberData: formData 
    }));
    if (result.type.endsWith('/fulfilled')) {
      setCurrentView('view');
    }
  };

  const handleDeleteMember = async () => {
    if (memberToDelete) {
      const result = await dispatch(removeTeamMember(memberToDelete._id));
      if (result.type.endsWith('/fulfilled')) {
        setShowDeleteModal(false);
        setMemberToDelete(null);
        setCurrentView('list');
      }
    }
  };

  const handleAssignCase = async () => {
    if (selectedMemberForCase && caseAssignData.caseId) {
      const result = await dispatch(assignCase({
        memberId: selectedMemberForCase._id,
        caseData: caseAssignData
      }));
      if (result.type.endsWith('/fulfilled')) {
        setShowAssignCaseModal(false);
        setSelectedMemberForCase(null);
        setCaseAssignData({ caseId: '', role: '' });
      }
    }
  };

  const handleUnassignCase = async (memberId, caseId) => {
    await dispatch(unassignCase({ memberId, caseId }));
  };

  const startEdit = (member) => {
    dispatch(clearSelectedTeamMember());
    dispatch(fetchTeamMemberById(member._id)).then((result) => {
      if (result.type.endsWith('/fulfilled')) {
        const memberData = result.payload;
        setFormData({
          name: memberData.name || '',
          email: memberData.email || '',
          phone: memberData.phone || '',
          role: memberData.role || 'Legal Assistant',
          specializations: memberData.specializations || [],
          employmentType: memberData.employmentType || 'Full-time',
          department: memberData.department || '',
          bio: memberData.bio || '',
          notes: memberData.notes || '',
          address: memberData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          emergencyContact: memberData.emergencyContact || {
            name: '',
            relationship: '',
            phone: ''
          },
          workSchedule: memberData.workSchedule || {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '17:00' }
          }
        });
        setCurrentView('edit');
      }
    });
  };

  const viewMember = (member) => {
    dispatch(fetchTeamMemberById(member._id)).then(() => {
      setCurrentView('view');
    });
  };
  

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Legal Assistant',
      specializations: [],
      employmentType: 'Full-time',
      department: '',
      bio: '',
      notes: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      workSchedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      }
    });
  };

  const openDeleteModal = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const openAssignCaseModal = (member) => {
    setSelectedMemberForCase(member);
    setShowAssignCaseModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-800 bg-green-100';
      case 'On Leave': return 'text-yellow-800 bg-yellow-100';
      case 'Inactive': return 'text-slate-800 bg-slate-100';
      default: return 'text-slate-800 bg-slate-100';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading overlay
  if (loading && currentView === 'list') {
    return (
      <div className="p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  /*** ========== ERROR NOTIFICATION ========== ***/
  const ErrorNotification = () => {
    if (!error) return null;
    return (
      <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-md">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-900">Error</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  /*** ========== DELETE CONFIRMATION MODAL ========== ***/
  const DeleteModal = () => {
    if (!showDeleteModal || !memberToDelete) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Delete Team Member</h3>
              <p className="text-sm text-slate-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-slate-700 mb-6">
            Are you sure you want to delete <span className="font-semibold">{memberToDelete.name}</span>? 
            All assigned tasks will be unassigned.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteMember}
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setMemberToDelete(null);
              }}
              disabled={loading}
              className="flex-1 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  /*** ========== ASSIGN CASE MODAL ========== ***/
  const AssignCaseModal = () => {
    if (!showAssignCaseModal || !selectedMemberForCase) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Assign Case to {selectedMemberForCase.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Case ID *
              </label>
              <input
                type="text"
                value={caseAssignData.caseId}
                onChange={(e) => setCaseAssignData(prev => ({ ...prev, caseId: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter case ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role in Case
              </label>
              <input
                type="text"
                value={caseAssignData.role}
                onChange={(e) => setCaseAssignData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Lead Attorney, Assistant"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAssignCase}
              disabled={loading || !caseAssignData.caseId}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Assigning...' : 'Assign Case'}
            </button>
            <button
              onClick={() => {
                setShowAssignCaseModal(false);
                setSelectedMemberForCase(null);
                setCaseAssignData({ caseId: '', role: '' });
              }}
              disabled={loading}
              className="flex-1 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  /*** ========== LIST VIEW ========== ***/
  if (currentView === 'list') {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <ErrorNotification />
        <DeleteModal />
        <AssignCaseModal />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Team</h2>
            <p className="text-slate-600">Manage your legal team members ({totalCount} total)</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setCurrentView('add');
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Members</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalMembers || teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.activeMembers || teamMembers.filter(m => m.status === 'Active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Inactive</p>
                <p className="text-2xl font-bold text-slate-600">
                  {stats?.inactiveMembers || teamMembers.filter(m => m.status === 'Inactive').length}
                </p>
              </div>
              <Users className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Cases</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamMembers.reduce((sum, m) => sum + (m.assignedCases?.length || 0), 0)}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-600" />
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
                placeholder="Search team members..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={filters.role}
              onChange={(e) => dispatch(setFilters({ role: e.target.value }))}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          {(filters.status !== 'all' || filters.role !== 'all') && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Members Grid */}
        {displayedMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No team members found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first team member'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  resetForm();
                  setCurrentView('add');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Team Member
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMembers.map((member) => (
              <div key={member._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{getInitials(member.name)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                      <p className="text-sm text-slate-600">{member.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      {member.phone}
                    </div>
                  )}
                  {member.specializations && member.specializations.length > 0 && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.specializations.join(', ')}</span>
                    </div>
                  )}
                  {member.department && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Activity className="w-4 h-4 mr-2 flex-shrink-0" />
                      {member.department}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">Cases</p>
                    <p className="text-lg font-bold text-slate-900">{member.assignedCases?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-600">Completed</p>
                    <p className="text-lg font-bold text-green-600">{member.tasksCompleted || 0}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => viewMember(member)}
                    className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => startEdit(member)}
                    className="p-2 text-slate-400 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-blue-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(member)}
                    className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /*** ========== ADD MEMBER VIEW ========== ***/
  if (currentView === 'add') {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <ErrorNotification />
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => {
              resetForm();
              setCurrentView('list');
            }} 
            className="mr-4 p-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add Team Member</h2>
            <p className="text-slate-600">Add a new member to your legal team</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@lawfirm.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="tel"
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  >
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <select
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      const current = formData.specializations || [];
                      if (current.includes(spec)) {
                        handleInputChange('specializations', current.filter(s => s !== spec));
                      } else {
                        handleInputChange('specializations', [...current, spec]);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.specializations?.includes(spec)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bio & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Brief professional biography..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={handleAddMember}
              disabled={loading || !formData.name || !formData.email || !formData.role}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Add Member</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                resetForm();
                setCurrentView('list');
              }}
              disabled={loading}
              className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*** ========== EDIT VIEW ========== ***/
  if (currentView === 'edit' && selectedMember) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <ErrorNotification />
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setCurrentView('view')} 
            className="mr-4 p-2 text-slate-600 hover:text-slate-900"
            disabled={loading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Member</h2>
            <p className="text-slate-600">Update {selectedMember.name}'s details</p>
          </div>
        </div>

        {/* Edit Form - Same as Add Form but with Update button */}
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map(spec => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      const current = formData.specializations || [];
                      if (current.includes(spec)) {
                        handleInputChange('specializations', current.filter(s => s !== spec));
                      } else {
                        handleInputChange('specializations', [...current, spec]);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.specializations?.includes(spec)
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Street</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.address?.street || ''}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.address?.city || ''}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.address?.state || ''}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Zip Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.address?.zipCode || ''}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.emergencyContact?.name || ''}
                    onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Relationship</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.emergencyContact?.relationship || ''}
                    onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={formData.emergencyContact?.phone || ''}
                    onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Bio & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3 pt-6 border-t border-slate-200">
            <button
              onClick={handleUpdateMember}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={() => setCurrentView('view')}
              disabled={loading}
              className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*** ========== VIEW PROFILE ========== ***/
  if (currentView === 'view' && selectedMember) {
    const memberWorkload = workloads[selectedMember._id];
    
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        <ErrorNotification />
        <AssignCaseModal />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => {
                dispatch(clearSelectedTeamMember());
                setCurrentView('list');
              }} 
              className="mr-4 p-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Member Profile</h2>
              <p className="text-slate-600">Detailed information</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => startEdit(selectedMember)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => openAssignCaseModal(selectedMember)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Case</span>
            </button>
            <button
              onClick={() => openDeleteModal(selectedMember)}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedMember.name}</h3>
                    <p className="text-slate-600">{selectedMember.role}</p>
                    {selectedMember.department && (
                      <p className="text-sm text-slate-500">{selectedMember.department}</p>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMember.status)}`}>
                  {selectedMember.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-slate-700">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="text-sm">{selectedMember.email}</span>
                  </div>
                  {selectedMember.phone && (
                    <div className="flex items-center text-slate-700">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm">{selectedMember.phone}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {selectedMember.employmentType && (
                    <div className="flex items-center text-slate-700">
                      <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm">{selectedMember.employmentType}</span>
                    </div>
                  )}
                  {selectedMember.joinDate && (
                    <div className="flex items-center text-slate-700">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm">Joined {new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specializations */}
              {selectedMember.specializations && selectedMember.specializations.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.specializations.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedMember.bio && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Bio</h4>
                  <p className="text-sm text-slate-700">{selectedMember.bio}</p>
                </div>
              )}

              {/* Address */}
              {selectedMember.address && (selectedMember.address.street || selectedMember.address.city) && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Address</h4>
                  <p className="text-sm text-slate-700">
                    {selectedMember.address.street && <>{selectedMember.address.street}<br /></>}
                    {selectedMember.address.city && `${selectedMember.address.city}, `}
                    {selectedMember.address.state && `${selectedMember.address.state} `}
                    {selectedMember.address.zipCode}
                  </p>
                </div>
              )}
            </div>

            {/* Assigned Cases */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Assigned Cases</h3>
                <span className="text-sm text-slate-600">
                  {selectedMember.assignedCases?.length || 0} cases
                </span>
              </div>
              {selectedMember.assignedCases && selectedMember.assignedCases.length > 0 ? (
                <div className="space-y-3">
                  {selectedMember.assignedCases.map((assignment) => (
                    <div 
                      key={assignment._id} 
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {assignment.caseId?.caseTitle || 'Case'}
                        </p>
                        <p className="text-sm text-slate-600">
                          {assignment.caseId?.caseNumber || 'N/A'}
                        </p>
                        {assignment.role && (
                          <p className="text-xs text-slate-500 mt-1">Role: {assignment.role}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleUnassignCase(selectedMember._id, assignment.caseId._id || assignment.caseId)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">No cases assigned yet</p>
              )}
            </div>

            {/* Notes */}
            {selectedMember.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Internal Notes</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedMember.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Emergency Contact */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-600">Tasks Completed</span>
                  </div>
                  <span className="font-semibold text-slate-900">{selectedMember.tasksCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-600">Cases Handled</span>
                  </div>
                  <span className="font-semibold text-slate-900">{selectedMember.casesHandled || 0}</span>
                </div>
              </div>
            </div>

            {/* Workload Info */}
            {memberWorkload && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Current Workload</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Active Cases</span>
                    <span className="font-semibold text-slate-900">{memberWorkload.assignedCases || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Active Tasks</span>
                    <span className="font-semibold text-slate-900">{memberWorkload.assignedTasks || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Overdue Tasks</span>
                    <span className="font-semibold text-red-600">{memberWorkload.overdueTasks || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {selectedMember.emergencyContact && (selectedMember.emergencyContact.name || selectedMember.emergencyContact.phone) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Emergency Contact</h3>
                <div className="space-y-2">
                  {selectedMember.emergencyContact.name && (
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="text-sm font-medium text-slate-900">{selectedMember.emergencyContact.name}</p>
                    </div>
                  )}
                  {selectedMember.emergencyContact.relationship && (
                    <div>
                      <p className="text-xs text-slate-500">Relationship</p>
                      <p className="text-sm font-medium text-slate-900">{selectedMember.emergencyContact.relationship}</p>
                    </div>
                  )}
                  {selectedMember.emergencyContact.phone && (
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-900">{selectedMember.emergencyContact.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TeamManagement;