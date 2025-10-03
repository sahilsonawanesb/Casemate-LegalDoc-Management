import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';

const TeamManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Lisa Martinez',
      email: 'lisa.martinez@lawfirm.com',
      phone: '(555) 123-4567',
      role: 'Legal Assistant',
      status: 'Active',
      dateJoined: '2023-06-15',
      assignedCases: 8,
      completedTasks: 45,
      pendingTasks: 5,
      rating: 4.8,
      specialization: 'Family Law',
      avatar: 'LM',
      performance: {
        tasksCompleted: 45,
        avgCompletionTime: '2.5 days',
        clientSatisfaction: 4.8,
        onTimeDelivery: 92
      }
    },
    {
      id: 2,
      name: 'Mike Paralegal',
      email: 'mike.p@lawfirm.com',
      phone: '(555) 987-6543',
      role: 'Paralegal',
      status: 'Active',
      dateJoined: '2023-03-20',
      assignedCases: 12,
      completedTasks: 67,
      pendingTasks: 3,
      rating: 4.6,
      specialization: 'Corporate Law',
      avatar: 'MP',
      performance: {
        tasksCompleted: 67,
        avgCompletionTime: '2 days',
        clientSatisfaction: 4.6,
        onTimeDelivery: 88
      }
    },
    {
      id: 3,
      name: 'Sarah Assistant',
      email: 'sarah.a@lawfirm.com',
      phone: '(555) 456-7890',
      role: 'Legal Assistant',
      status: 'Active',
      dateJoined: '2024-01-10',
      assignedCases: 5,
      completedTasks: 23,
      pendingTasks: 4,
      rating: 4.9,
      specialization: 'Personal Injury',
      avatar: 'SA',
      performance: {
        tasksCompleted: 23,
        avgCompletionTime: '1.8 days',
        clientSatisfaction: 4.9,
        onTimeDelivery: 95
      }
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Legal Assistant',
    specialization: ''
  });

  const roles = ['Legal Assistant', 'Paralegal', 'Junior Associate', 'Senior Associate'];
  const specializations = ['Family Law', 'Corporate Law', 'Personal Injury', 'Criminal Defense', 'Real Estate', 'Immigration'];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMember = () => {
    if (formData.name && formData.email && formData.phone) {
      const newMember = {
        id: Date.now(),
        ...formData,
        status: 'Active',
        dateJoined: new Date().toISOString().split('T')[0],
        assignedCases: 0,
        completedTasks: 0,
        pendingTasks: 0,
        rating: 0,
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        performance: {
          tasksCompleted: 0,
          avgCompletionTime: 'N/A',
          clientSatisfaction: 0,
          onTimeDelivery: 0
        }
      };
      setTeamMembers(prev => [...prev, newMember]);
      setFormData({ name: '', email: '', phone: '', role: 'Legal Assistant', specialization: '' });
      setCurrentView('list');
    }
  };

  const handleUpdateMember = () => {
    const updatedMember = { ...selectedMember, ...formData };
    setTeamMembers(prev => prev.map(member => 
      member.id === selectedMember.id ? updatedMember : member
    ));
    setSelectedMember(updatedMember);
    setCurrentView('view');
  };

  const startEdit = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      specialization: member.specialization
    });
    setCurrentView('edit');
  };

  const viewMember = (member) => {
    setSelectedMember(member);
    setCurrentView('view');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-800 bg-green-100';
      case 'On Leave': return 'text-yellow-800 bg-yellow-100';
      case 'Inactive': return 'text-slate-800 bg-slate-100';
      default: return 'text-slate-800 bg-slate-100';
    }
  };

  /*** ========== LIST VIEW ========== ***/
  if (currentView === 'list') {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Team</h2>
            <p className="text-slate-600">Manage your legal team members</p>
          </div>
          <button
            onClick={() => setCurrentView('add')}
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
                <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">{teamMembers.filter(m => m.status === 'Active').length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamMembers.reduce((sum, m) => sum + m.completedTasks, 0)}
                </p>
              </div>
              <CheckSquare className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1)}
                </p>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
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
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{member.avatar}</span>
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
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {member.phone}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {member.specialization}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Cases</p>
                  <p className="text-lg font-bold text-slate-900">{member.assignedCases}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Tasks</p>
                  <p className="text-lg font-bold text-blue-600">{member.completedTasks}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-600">Rating</p>
                  <p className="text-lg font-bold text-orange-600">{member.rating}</p>
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
                  className="p-2 text-slate-400 hover:text-green-600 border border-slate-200 rounded-lg hover:border-green-300"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /*** ========== ADD MEMBER VIEW ========== ***/
  if (currentView === 'add') {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add Team Member</h2>
            <p className="text-slate-600">Add a new member to your legal team</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
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

            {/* Email */}
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
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

            {/* Role */}
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

            {/* Specialization */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
              <select
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
              >
                <option value="">Select specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleAddMember}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Add Member</span>
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
    );
  }

  /*** ========== EDIT VIEW ========== ***/
  if (currentView === 'edit' && selectedMember) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('view')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
                        <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Member</h2>
            <p className="text-slate-600">Update {selectedMember.name}'s details</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            {/* Role */}
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

            {/* Specialization */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
              <select
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleUpdateMember}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
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
    );
  }

  /*** ========== VIEW PROFILE ========== ***/
  if (currentView === 'view' && selectedMember) {
    return (
      <div className="p-6 bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Member Profile</h2>
            <p className="text-slate-600">Detailed information</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                {selectedMember.avatar}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedMember.name}</h3>
                <p className="text-slate-600">{selectedMember.role}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedMember.status)}`}>
              {selectedMember.status}
            </span>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <div className="flex items-center text-slate-700">
                <Mail className="w-4 h-4 mr-2" /> {selectedMember.email}
              </div>
              <div className="flex items-center text-slate-700">
                <Phone className="w-4 h-4 mr-2" /> {selectedMember.phone}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-slate-700">
                <Briefcase className="w-4 h-4 mr-2" /> {selectedMember.specialization}
              </div>
              <div className="flex items-center text-slate-700">
                <Calendar className="w-4 h-4 mr-2" /> Joined {selectedMember.dateJoined}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">Completed Tasks</p>
              <p className="text-xl font-bold">{selectedMember.performance.tasksCompleted}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">Avg Time</p>
              <p className="text-xl font-bold">{selectedMember.performance.avgCompletionTime}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">Client Satisfaction</p>
              <p className="text-xl font-bold">{selectedMember.performance.clientSatisfaction}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">On-Time Delivery</p>
              <p className="text-xl font-bold">{selectedMember.performance.onTimeDelivery}%</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => startEdit(selectedMember)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TeamManagement;

