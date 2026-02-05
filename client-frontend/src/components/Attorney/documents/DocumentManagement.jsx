import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Plus, Search, Download, Eye, Edit, Trash2, Upload, ArrowLeft, Check, Filter, Folder, File, Calendar, User, ChevronDown, ChevronRight, Clock, Lock, X, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  fetchAllDocuments,  // ✅ Correct name
  fetchDocumentById,
  uploadDocument,
  deleteDocument,
  deleteBulkDocuments,
  searchDocument,  // ✅ Also fix this (singular, not plural)
  clearSelectedDocument,
  clearError,
  selectAllDocuments,
  selectSelectedDocument,
  selectDocumentsLoading,
  selectDocumentsError,
  selectTotalCount,
} from '../../../store/slices/documentSlice.js';

import {fetchCases} from '../../../store/slices/caseSlice.js';

const DocumentsManagement = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const documents = useSelector(selectAllDocuments);
  const selectedDocument = useSelector(selectSelectedDocument);
  const loading = useSelector(selectDocumentsLoading);
  const error = useSelector(selectDocumentsError);
  const totalCount = useSelector(selectTotalCount);

  // Local state
  const [currentView, setCurrentView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [expandedFolders, setExpandedFolders] = useState(['pleadings', 'evidence', 'contracts', 'discovery']);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [notification, setNotification] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    caseId: '',
    category: '',
    status: 'Draft',
    description: '',
    tags: '',
    isConfidential: false,
    documentDate: '',
    notes: ''
  });

  const categories = ['Pleadings', 'Discovery', 'Evidence', 'Contracts', 'Correspondence', 'Court Orders', 'Research', 'Other'];
  const statusOptions = ['Draft', 'Under Review', 'Final', 'Sent', 'Filed'];
  // const cases = ['CM-2024-001', 'CM-2024-002']; // This should come from your cases state


  // Fetch documents on mount
  useEffect(() => {
    dispatch(fetchAllDocuments({ category: filterCategory, status: filterStatus }));
  }, [dispatch, filterCategory, filterStatus]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchDocument(searchTerm));
      } else {
        dispatch(fetchAllDocuments({ category: filterCategory, status: filterStatus }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filterCategory, filterStatus]);

  // Show notification for errors
  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // const [cases, setCases] = useState([]);

  useEffect(() => {
    dispatch(fetchCases());
  }, [dispatch]);

  // read cases from redux store
  const {list : cases} = useSelector(state => state.cases);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredAndSortedDocuments = React.useMemo(() => {
    if(!documents || !Array.isArray(documents)){
      return [];
    }
    
    let filtered = [...documents];
    if (filterCase !== 'all') {
      filtered = filtered.filter(doc => doc.caseId?._id === filterCase || doc.caseId === filterCase);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastModified || b.updatedAt) - new Date(a.lastModified || a.updatedAt);
        case 'oldest':
          return new Date(a.lastModified || a.updatedAt) - new Date(b.lastModified || b.updatedAt);
        case 'name':
          return (a.documentName || a.name).localeCompare(b.documentName || b.name);
        case 'size':
          return (b.fileSize || 0) - (a.fileSize || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, filterCase, sortBy]);

  const groupedDocuments = React.useMemo(() => {
    if (!filteredAndSortedDocuments || !Array.isArray(filteredAndSortedDocuments)) {
        return {};
    }
    return filteredAndSortedDocuments.reduce((acc, doc) => {
      if(!doc || !doc.category) return acc;
      const category = doc.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(doc);
      return acc;
    }, {});
  }, [filteredAndSortedDocuments]);

  const toggleFolder = (folder) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const toggleSelectDocument = (id) => {
    setSelectedDocuments(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'Draft': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Under Review': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Final': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      'Sent': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      'Filed': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
    };
    return statusMap[status] || statusMap['Draft'];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Final':
        return <CheckCircle className="w-3 h-3" />;
      case 'Draft':
        return <Edit className="w-3 h-3" />;
      case 'Under Review':
        return <Clock className="w-3 h-3" />;
      default:
        return <File className="w-3 h-3" />;
    }
  };

  const viewDocument = async (doc) => {
    console.log('Viewing document:', doc);
    try{
      const result = await dispatch(fetchDocumentById(doc._id)).unwrap();
      console.log('Fetched Document:', result);
      setCurrentView('view');
    }catch(error){
      console.error('Failed to fetch document:', error);
      showNotification('Failed to load documents', 'error');
    }
    
  };

  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await dispatch(deleteDocument(id)).unwrap();
        showNotification('Document deleted successfully', 'success');
        if (selectedDocument?._id === id) {
          setCurrentView('list');
        }
      } catch (err) {
        showNotification(err || 'Failed to delete document', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocuments.size === 0) return;

    if (window.confirm(`Delete ${selectedDocuments.size} document(s)? This action cannot be undone.`)) {
      try {
        await dispatch(deleteBulkDocuments(Array.from(selectedDocuments))).unwrap();
        setSelectedDocuments(new Set());
        showNotification(`${selectedDocuments.size} document(s) deleted successfully`, 'success');
      } catch (err) {
        showNotification(err || 'Failed to delete documents', 'error');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // check file size in 50MB limit..
      const maxSize = 50 * 1024 * 1024;
      if(file.size > maxSize){
        showNotification('File size execceds 50MB limit', 'error');
        e.target.value = '';
        return;
      }

      setUploadFile(file);
      if (!uploadForm.documentName) {
        setUploadForm(prev => ({
          ...prev,
          documentName: file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadForm.documentName || !uploadForm.caseId || !uploadForm.category || !uploadForm.description) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    if (!uploadFile) {
      showNotification('Please select a file to upload', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('documentName', uploadForm.documentName);
    formData.append('caseId', uploadForm.caseId);
    formData.append('category', uploadForm.category);
    formData.append('status', uploadForm.status);
    formData.append('description', uploadForm.description);
    formData.append('tags', uploadForm.tags);
    formData.append('isConfidential', uploadForm.isConfidential);
    if (uploadForm.documentDate) formData.append('documentDate', uploadForm.documentDate);
    if (uploadForm.notes) formData.append('notes', uploadForm.notes);

    try {
      await dispatch(uploadDocument(formData)).unwrap();
      showNotification('Document uploaded successfully', 'success');
      setUploadForm({
        documentName: '',
        caseId: '',
        category: '',
        status: 'Draft',
        description: '',
        tags: '',
        isConfidential: false,
        documentDate: '',
        notes: ''
      });
      setUploadFile(null);
      setCurrentView('list');
    } catch (err) {
      showNotification(err || 'Failed to upload document', 'error');
    }
  };

//   const handleDownload = async (doc) => {

//     try {
//   // eslint-disable-next-line no-undef
// const response = await fetch(`${process.env.REACT_APP_API_URL}/documents/download/${doc._id}`, {
//   headers: {
//     'Authorization': `Bearer ${localStorage.getItem('token')}`
//   }
// });;
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = doc.fileName || doc.documentName;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//       showNotification('Download started', 'success');
//     // eslint-disable-next-line no-unused-vars
//     } catch (err) {
//       showNotification('Failed to download document', 'error');
//     }
//   };

const handleDownload = async (doc) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/documents/${doc._id}/download`, {
      method : 'GET',
      headers : {
        'Authorization' : `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName || doc.documentName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showNotification('Download started', 'success');
  } catch (err) {
    console.error('Download error:', err);
    showNotification('Failed to download document', 'error');
  }
};

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const NotificationComponent = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const textColor = notification.type === 'success' ? 'text-green-700' : 'text-red-700';

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className={`${bgColor} border ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center justify-between`}>
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className={`ml-4 ${textColor} hover:opacity-70`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // LIST VIEW
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
        <NotificationComponent />

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Documents
              </h1>
              <p className="text-slate-600 mt-1">Manage case documents and files securely</p>
            </div>
            <button
              onClick={() => setCurrentView('upload')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Documents', value: totalCount, icon: FileText, color: 'blue' },
            { label: 'Drafts', value: documents.filter(d => d.status === 'Draft').length, icon: Edit, color: 'yellow' },
            { label: 'Finalized', value: documents.filter(d => d.status === 'Final').length, icon: Check, color: 'green' },
            { label: 'Storage Used', value: formatFileSize(documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0)), icon: Folder, color: 'slate' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="lg:col-span-8 flex gap-2 flex-wrap">
              <select
                className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={filterCase}
                onChange={(e) => setFilterCase(e.target.value)}
              >
                <option value="all">All Cases</option>
                {cases.map(caseItem => (
                  <option key={caseItem._id} value={caseItem._id}>
                    {caseItem.caseNumber} - {caseItem.title}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="size">Size (Large-Small)</option>
              </select>
            </div>
          </div>

          {selectedDocuments.size > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">
                {selectedDocuments.size} selected
              </span>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {loading && documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600">Loading documents...</p>
            </div>
          ) : filteredAndSortedDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {Object.keys(groupedDocuments).map(category => (
                <div key={category}>
                  <div
                    onClick={() => toggleFolder(category.toLowerCase())}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedFolders.includes(category.toLowerCase()) ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                      )}
                      <Folder className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-900">{category}</span>
                      <span className="text-sm text-slate-500">({groupedDocuments[category].length})</span>
                    </div>
                  </div>

                  {expandedFolders.includes(category.toLowerCase()) && (
                    <div className="bg-slate-50">
                      {groupedDocuments[category].map((doc) => {
                        const colors = getStatusColor(doc.status);
                        const isSelected = selectedDocuments.has(doc._id);
                        return (
                          <div
                            key={doc._id}
                            className={`flex items-center p-4 border-l-4 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-white'} transition-all`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectDocument(doc._id)}
                              className="mt-1 w-4 h-4 rounded border-slate-300 cursor-pointer"
                            />
                            <div className="flex-1 ml-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <File className="w-5 h-5 text-slate-600" />
                                  <h3 className="font-semibold text-slate-900">{doc.documentName || doc.fileName}</h3>
                                  {doc.isConfidential && (
                                    <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-medium">
                                      <Lock className="w-3 h-3" />
                                      <span>Confidential</span>
                                    </span>
                                  )}
                                  <span className={`inline-flex items-center space-x-1 ${colors.bg} ${colors.text} border ${colors.border} px-2 py-1 rounded-md text-xs font-medium`}>
                                    {getStatusIcon(doc.status)}
                                    <span>{doc.status}</span>
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{doc.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <span>{doc.caseId?.title || 'Unknown Case'} • {formatFileSize(doc.fileSize)} • {formatDate(doc.updatedAt)}</span>
                              </div>
                              {doc.tags && doc.tags.length > 0 && (
                                <div className="flex items-center space-x-2 mt-2">
                                  {doc.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="bg-slate-200 text-slate-700 px-2 py-1 rounded-md text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {doc.tags.length > 2 && (
                                    <span className="text-xs text-slate-500">
                                      +{doc.tags.length - 2} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => viewDocument(doc)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc._id)}
                                disabled={loading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // UPLOAD VIEW
  if (currentView === 'upload') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
        <NotificationComponent />

        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center">
            <button
              onClick={() => {
                setCurrentView('list');
                setUploadForm({
                  documentName: '',
                  caseId: '',
                  category: '',
                  status: 'Draft',
                  description: '',
                  tags: '',
                  isConfidential: false,
                  documentDate: '',
                  notes: ''
                });
                setUploadFile(null);
              }}
              className="mr-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Upload Document</h1>
              <p className="text-slate-600 mt-1">Add a new document to the case management system</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xlsx,.xls"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-700 font-medium mb-1">
                      {uploadFile ? uploadFile.name : 'Click to upload or drag and drop'}
                    </p>
                {uploadFile && (
                    <p className="text-sm text-blue-600 font-medium">
                  Size: {formatFileSize(uploadFile.size)}
                </p>
                )}
                <p className="text-sm text-slate-500">PDF, DOC, DOCX, XLSX up to 50MB</p>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentName: e.target.value }))}
                  placeholder="Enter document name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Case <span className="text-red-500">*</span>
                  </label>
<select
    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={uploadForm.caseId}
    onChange={(e) => setUploadForm(prev => ({ ...prev, caseId: e.target.value }))}
    required
>
    <option value="">Select case</option>
  {cases.map(caseItem => (
    <option key={caseItem._id} value={caseItem._id}>
      {caseItem.caseNumber} - {caseItem.title}
    </option>
  ))}
</select>

     </div>
  </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.status}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the document"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-slate-500 mt-1">Separate tags with commas (e.g., legal, confidential, urgent)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Document Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={uploadForm.documentDate}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentDate: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="2"
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={uploadForm.isConfidential}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, isConfidential: e.target.checked }))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="confidential" className="text-sm text-slate-700 font-medium flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-red-600" />
                  <span>Mark as Confidential</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('list');
                    setUploadForm({
                      documentName: '',
                      caseId: '',
                      category: '',
                      status: 'Draft',
                      description: '',
                      tags: '',
                      isConfidential: false,
                      documentDate: '',
                      notes: ''
                    });
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload Document</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // VIEW DOCUMENT
  if (currentView === 'view' && selectedDocument) {
    const colors = getStatusColor(selectedDocument.status);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
        <NotificationComponent />

        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setCurrentView('list');
                  dispatch(clearSelectedDocument());
                }}
                className="mr-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Document Details</h1>
                <p className="text-slate-600 mt-1">View and manage document information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload(selectedDocument)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                <Edit className="w-5 h-5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteDocument(selectedDocument._id)}
                disabled={loading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedDocument.documentName || selectedDocument.fileName}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center space-x-1 ${colors.bg} ${colors.text} border ${colors.border} px-3 py-1 rounded-lg text-sm font-medium`}>
                          {getStatusIcon(selectedDocument.status)}
                          <span>{selectedDocument.status}</span>
                        </span>
                        {selectedDocument.isConfidential && (
                          <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium">
                            <Lock className="w-4 h-4" />
                            <span>Confidential</span>
                          </span>
                        )}
                        <span className="text-sm text-slate-500">
                          Version {selectedDocument.versions?.[selectedDocument.versions.length - 1]?.versionNumber || '1.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <p className="text-slate-600">{selectedDocument.description}</p>
                </div>

                {selectedDocument.notes && (
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                    <p className="text-slate-600">{selectedDocument.notes}</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Document Preview</h3>
                <div className="bg-slate-100 rounded-lg p-12 text-center border-2 border-dashed border-slate-300">
                  <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium mb-2">Preview not available</p>
                  <p className="text-sm text-slate-500">Download the document to view its contents</p>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="mt-4 inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download {selectedDocument.fileType}</span>
                  </button>
                </div>
              </div>

              {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDocument.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Case Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Case Number</p>
                    <p className="font-medium text-slate-900">
                      {selectedDocument.caseId?.caseNumber || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Case Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedDocument.caseId?.title || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Category</p>
                    <p className="font-medium text-slate-900">{selectedDocument.category}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">File Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <File className="w-4 h-4" />
                      <span className="text-sm">File Type</span>
                    </div>
                    <span className="font-medium text-slate-900">{selectedDocument.fileType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Folder className="w-4 h-4" />
                      <span className="text-sm">File Size</span>
                    </div>
                    <span className="font-medium text-slate-900">{formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Access Level</span>
                    </div>
                    <span className="font-medium text-slate-900 capitalize">
                      {selectedDocument.isConfidential ? 'Private' : 'Internal'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Activity</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center space-x-2 text-slate-600 mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs">Uploaded By</span>
                    </div>
                    <p className="font-medium text-slate-900 ml-6">
                      {selectedDocument.uploadedBy?.name || selectedDocument.attorneyId?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-slate-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Upload Date</span>
                    </div>
                    <p className="font-medium text-slate-900 ml-6">{formatDate(selectedDocument.createdAt)}</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 text-slate-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Last Modified</span>
                    </div>
                    <p className="font-medium text-slate-900 ml-6">{formatDate(selectedDocument.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DocumentsManagement