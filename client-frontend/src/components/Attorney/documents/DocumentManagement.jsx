import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  Filter,
  Folder,
  File,
  Calendar,
  User,
  Paperclip,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';

const DocumentsManagement = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [expandedFolders, setExpandedFolders] = useState(['pleadings']);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Divorce Petition',
      category: 'Pleadings',
      caseNumber: 'CM-2024-001',
      caseName: 'Smith Divorce Case',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-20',
      tags: ['petition', 'divorce', 'filing'],
      description: 'Initial divorce petition filed with the court',
      status: 'Final',
      version: '2.0'
    },
    {
      id: 2,
      name: 'Medical Records - Client',
      category: 'Evidence',
      caseNumber: 'CM-2024-002',
      caseName: 'Brown Personal Injury',
      fileType: 'PDF',
      fileSize: '5.8 MB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-01-12',
      lastModified: '2024-01-12',
      tags: ['medical', 'evidence', 'injury'],
      description: 'Complete medical records documenting injuries',
      status: 'Final',
      version: '1.0'
    },
    {
      id: 3,
      name: 'Settlement Agreement Draft',
      category: 'Contracts',
      caseNumber: 'CM-2024-002',
      caseName: 'Brown Personal Injury',
      fileType: 'DOCX',
      fileSize: '156 KB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-01-18',
      lastModified: '2024-01-22',
      tags: ['settlement', 'contract', 'draft'],
      description: 'Draft settlement agreement for review',
      status: 'Draft',
      version: '3.0'
    },
    {
      id: 4,
      name: 'Discovery Request',
      category: 'Discovery',
      caseNumber: 'CM-2024-001',
      caseName: 'Smith Divorce Case',
      fileType: 'PDF',
      fileSize: '890 KB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-01-10',
      lastModified: '2024-01-10',
      tags: ['discovery', 'interrogatories'],
      description: 'Discovery request to opposing counsel',
      status: 'Sent',
      version: '1.0'
    },
    {
      id: 5,
      name: 'Client Retainer Agreement',
      category: 'Contracts',
      caseNumber: 'CM-2024-001',
      caseName: 'Smith Divorce Case',
      fileType: 'PDF',
      fileSize: '425 KB',
      uploadedBy: 'Sarah Johnson',
      uploadDate: '2024-01-15',
      lastModified: '2024-01-15',
      tags: ['retainer', 'contract', 'signed'],
      description: 'Signed client retainer agreement',
      status: 'Final',
      version: '1.0'
    }
  ]);

  const categories = ['Pleadings', 'Discovery', 'Evidence', 'Contracts', 'Correspondence', 'Court Orders', 'Research', 'Other'];
  const statusOptions = ['Draft', 'Under Review', 'Final', 'Sent', 'Filed'];
  const cases = ['CM-2024-001', 'CM-2024-002'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesCase = filterCase === 'all' || doc.caseNumber === filterCase;
    return matchesSearch && matchesCategory && matchesCase;
  });

  const groupedDocuments = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const getFileIcon = () => {
    return <File className="w-5 h-5 text-blue-600" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'text-yellow-800 bg-yellow-100';
      case 'Under Review': return 'text-blue-800 bg-blue-100';
      case 'Final': return 'text-green-800 bg-green-100';
      case 'Sent': return 'text-purple-800 bg-purple-100';
      case 'Filed': return 'text-slate-800 bg-slate-100';
      default: return 'text-slate-800 bg-slate-100';
    }
  };

  const viewDocument = (doc) => {
    setSelectedDocument(doc);
    setCurrentView('view');
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (selectedDocument?.id === id) {
        setCurrentView('list');
        setSelectedDocument(null);
      }
    }
  };

  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Documents</h2>
            <p className="text-slate-600">Manage case documents and files</p>
          </div>
          <button
            onClick={() => setCurrentView('upload')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Documents</p>
                <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'Draft').length}
                </p>
              </div>
              <Edit className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Final</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'Final').length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Size</p>
                <p className="text-2xl font-bold text-slate-900">9.7 MB</p>
              </div>
              <Folder className="w-8 h-8 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-3">
              <select
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCase}
                onChange={(e) => setFilterCase(e.target.value)}
              >
                <option value="all">All Cases</option>
                {cases.map(caseNum => (
                  <option key={caseNum} value={caseNum}>{caseNum}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {Object.keys(groupedDocuments).map(category => (
            <div key={category} className="border-b border-slate-200 last:border-0">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => toggleFolder(category.toLowerCase())}
              >
                <div className="flex items-center space-x-3">
                  {expandedFolders.includes(category.toLowerCase()) ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                  <Folder className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-slate-900">{category}</span>
                  <span className="text-sm text-slate-500">
                    ({groupedDocuments[category].length} files)
                  </span>
                </div>
              </div>
              
              {expandedFolders.includes(category.toLowerCase()) && (
                <div className="bg-slate-50">
                  {groupedDocuments[category].map(doc => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-4 pl-16 border-t border-slate-200 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {getFileIcon(doc.fileType)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-slate-500">{doc.caseName}</p>
                            <p className="text-sm text-slate-400">•</p>
                            <p className="text-sm text-slate-500">{doc.fileSize}</p>
                            <p className="text-sm text-slate-400">•</p>
                            <p className="text-sm text-slate-500">{doc.uploadDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    caseNumber: '',
    description: '',
    tags: '',
    status: 'Draft'
  });

  if (currentView === 'upload') {

    const handleUpload = () => {
      if (uploadForm.name && uploadForm.category && uploadForm.caseNumber) {
        const newDoc = {
          id: Date.now(),
          name: uploadForm.name,
          category: uploadForm.category,
          caseNumber: uploadForm.caseNumber,
          caseName: documents.find(d => d.caseNumber === uploadForm.caseNumber)?.caseName || 'Unknown Case',
          fileType: 'PDF',
          fileSize: '1.2 MB',
          uploadedBy: 'Sarah Johnson',
          uploadDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
          description: uploadForm.description,
          status: uploadForm.status,
          version: '1.0'
        };
        setDocuments(prev => [...prev, newDoc]);
        setCurrentView('list');
      }
    };

    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Document</h2>
            <p className="text-slate-600">Add a new document to the system</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 mb-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-500">PDF, DOC, DOCX up to 10MB</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter document name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Case Number</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.caseNumber}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caseNumber: e.target.value }))}
                >
                  <option value="">Select case</option>
                  {cases.map(caseNum => <option key={caseNum} value={caseNum}>{caseNum}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.status}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="contract, draft, review"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={uploadForm.description}
                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the document..."
              />
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={handleUpload}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
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
      </div>
    );
  }

  if (currentView === 'view' && selectedDocument) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button onClick={() => setCurrentView('list')} className="mr-4 p-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{selectedDocument.name}</h2>
              <p className="text-slate-600">{selectedDocument.category}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button 
              onClick={() => handleDeleteDocument(selectedDocument.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Document Preview</p>
                  <p className="text-sm text-slate-500 mt-2">{selectedDocument.fileType} - {selectedDocument.fileSize}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
              <p className="text-slate-700">{selectedDocument.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                    {selectedDocument.status}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Case</label>
                  <p className="text-sm text-slate-900">{selectedDocument.caseName}</p>
                  <p className="text-xs text-slate-500">{selectedDocument.caseNumber}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">File Type</label>
                  <p className="text-sm text-slate-900">{selectedDocument.fileType}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">File Size</label>
                  <p className="text-sm text-slate-900">{selectedDocument.fileSize}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Version</label>
                  <p className="text-sm text-slate-900">{selectedDocument.version}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Uploaded By</label>
                  <p className="text-sm text-slate-900">{selectedDocument.uploadedBy}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Upload Date</label>
                  <p className="text-sm text-slate-900">{selectedDocument.uploadDate}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Last Modified</label>
                  <p className="text-sm text-slate-900">{selectedDocument.lastModified}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DocumentsManagement;