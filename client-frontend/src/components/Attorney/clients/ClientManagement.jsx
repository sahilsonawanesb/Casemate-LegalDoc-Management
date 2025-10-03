import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  FileText,
  X,
  User,
  MapPin,
  Briefcase,
  Check,
  ArrowLeft
} from 'lucide-react';

const SimpleClientManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'view', 'edit'
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock client data
  const [clients, setClients] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      caseType: 'Divorce',
      status: 'Active',
      dateAdded: '2024-01-15',
      lastContact: '2024-01-20',
      notes: 'Custody case ongoing',
      avatar: 'JD'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Brooklyn, NY 11201',
      caseType: 'Personal Injury',
      status: 'Active',
      dateAdded: '2024-01-10',
      lastContact: '2024-01-18',
      notes: 'Car accident settlement',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '(555) 456-7890',
      address: '789 Pine Rd, Queens, NY 11354',
      caseType: 'Criminal Defense',
      status: 'On Hold',
      dateAdded: '2024-01-05',
      lastContact: '2024-01-15',
      notes: 'Waiting for court date',
      avatar: 'MJ'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    caseType: '',
    notes: ''
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.caseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClient = () => {
    if (formData.name && formData.email && formData.phone) {
      const newClient = {
        id: Date.now(),
        ...formData,
        status: 'Active',
        dateAdded: new Date().toISOString().split('T')[0],
        lastContact: new Date().toISOString().split('T')[0],
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setClients(prev => [...prev, newClient]);
      setFormData({ name: '', email: '', phone: '', address: '', caseType: '', notes: '' });
      setCurrentView('list');
    }
  };

  const handleUpdateClient = () => {
    setClients(prev => prev.map(client => 
      client.id === selectedClient.id 
        ? { ...client, ...formData, lastContact: new Date().toISOString().split('T')[0] }
        : client
    ));
    setCurrentView('view');
  };

  const startEdit = (client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      caseType: client.caseType,
      notes: client.notes
    });
    setCurrentView('edit');
  };

  const viewClient = (client) => {
    setSelectedClient(client);
    setCurrentView('view');
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Case Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{client.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{client.name}</div>
                        <div className="text-sm text-slate-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {client.caseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Active' 
                        ? 'text-green-800 bg-green-100' 
                        : 'text-yellow-800 bg-yellow-100'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {client.lastContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => viewClient(client)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEdit(client)}
                      className="text-green-600 hover:text-green-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 p-1">
                      <Phone className="w-4 h-4" />
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

  // Add Client Form
  if (currentView === 'add') {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView('list')}
            className="mr-4 p-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Add New Client</h2>
            <p className="text-slate-600">Enter client information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Case Type
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.caseType}
                  onChange={(e) => handleInputChange('caseType', e.target.value)}
                >
                  <option value="">Select case type</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Personal Injury">Personal Injury</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <textarea
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St, City, State ZIP"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about the client or case..."
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleAddClient}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Client</span>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // View Client Profile
  if (currentView === 'view' && selectedClient) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentView('list')}
              className="mr-4 p-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h2>
              <p className="text-slate-600">{selectedClient.caseType}</p>
            </div>
          </div>
          <button
            onClick={() => startEdit(selectedClient)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Client</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                  <div className="flex items-center text-slate-900">
                    <Mail className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedClient.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
                  <div className="flex items-center text-slate-900">
                    <Phone className="w-4 h-4 mr-2 text-slate-400" />
                    {selectedClient.phone}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                <div className="flex items-start text-slate-900">
                  <MapPin className="w-4 h-4 mr-2 text-slate-400 mt-0.5" />
                  {selectedClient.address}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-600 mb-1">Case Type</label>
                <div className="flex items-center text-slate-900">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-400" />
                  {selectedClient.caseType}
                </div>
              </div>

              {selectedClient.notes && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
                  <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedClient.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Client
                </button>
                
                <button className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </button>
                
                <button className="w-full flex items-center justify-center p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                
                <button className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </button>
              </div>
            </div>

            {/* Client Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Client Details</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedClient.status === 'Active' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-yellow-800 bg-yellow-100'
                  }`}>
                    {selectedClient.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Date Added</span>
                  <span className="text-slate-900">{selectedClient.dateAdded}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Contact</span>
                  <span className="text-slate-900">{selectedClient.lastContact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Edit Client Form
  if (currentView === 'edit' && selectedClient) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setCurrentView('view')}
            className="mr-4 p-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Edit Client</h2>
            <p className="text-slate-600">Update client information</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Case Type
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.caseType}
                  onChange={(e) => handleInputChange('caseType', e.target.value)}
                >
                  <option value="">Select case type</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Personal Injury">Personal Injury</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
              <textarea
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleUpdateClient}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => setCurrentView('view')}
              className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SimpleClientManagement;