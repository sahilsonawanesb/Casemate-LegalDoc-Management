import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Plus,
    X,
    Edit,
    Trash2,
    AlertCircle,
    Loader,
    Check,
    Search,
    Video
} from 'lucide-react';

// Import Redux actions and selectors
import {
    fetchAllAppointments,
    fetchTodayAppointments,
    createNewAppointment,
    modifyAppointment,
    removeAppointment,
    clearError,
    selectAllAppointments,
    selectTodayAppointments,
    selectAppointmentLoading,
    selectAppointmentError,
    selectTotalAppointments
} from '../../../store/slices/appointmentSlice.js';

const AppointmentManagementUI = () => {
    const dispatch = useDispatch();
    
    // Redux state
    const appointments = useSelector(selectAllAppointments);
    const todayAppointments = useSelector(selectTodayAppointments);
    const loading = useSelector(selectAppointmentLoading);
    const error = useSelector(selectAppointmentError);
    const totalCount = useSelector(selectTotalAppointments);
    
    // Local UI state
    const [currentView, setCurrentView] = useState('today');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingAppointment, setEditingAppointment] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        caseId: '',
        caseTitle: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: 'Consultation',
        priority: 'medium',
        notes: ''
    });

    const appointmentTypes = ['Consultation', 'Strategy Meeting', 'Court Preparation', 'Client Review', 'Follow-up'];
    const priorities = ['low', 'medium', 'high'];

    // Fetch appointments on mount and view change
    useEffect(() => {
        if (currentView === 'today') {
            dispatch(fetchTodayAppointments());
        } else {
            dispatch(fetchAllAppointments());
        }
    }, [dispatch, currentView]);

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // Get appointments based on current view
    const displayAppointments = currentView === 'today' ? todayAppointments : appointments;

    // Filter appointments based on search
    const filteredAppointments = displayAppointments.filter(apt => 
        apt.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPriorityColor = (priority) => {
        switch(priority){
            case 'high': return 'text-red-800 bg-red-100';
            case 'medium': return 'text-yellow-800 bg-yellow-100';
            case 'low': return 'text-green-800 bg-green-100';
            default: return 'text-slate-800 bg-slate-100';
        }
    };

    const getStatusColor = (status) => {
        switch(status){
            case 'Scheduled': return 'text-blue-800 bg-blue-100';
            case 'Completed': return 'text-green-800 bg-green-100';
            case 'Cancelled': return 'text-red-800 bg-red-100';
            default: return 'text-slate-800 bg-slate-100';
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle opening edit modal
    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setFormData({
            clientName: appointment.clientName || '',
            clientEmail: appointment.clientEmail || '',
            clientPhone: appointment.clientPhone || '',
            caseId: appointment.caseId || '',
            caseTitle: appointment.caseTitle || '',
            appointmentDate: appointment.appointmentDate || '',
            appointmentTime: appointment.appointmentTime || '',
            appointmentType: appointment.appointmentType || 'Consultation',
            priority: appointment.priority || 'medium',
            notes: appointment.notes || ''
        });
        setShowAddModal(true);
    };

    // Handle form submission (create or update)
    const handleSubmit = async () => {
        try {
            if (editingAppointment) {
                // Update existing appointment
                await dispatch(modifyAppointment({
                    id: editingAppointment._id,
                    appointmentData: formData
                })).unwrap();
            } else {
                // Create new appointment
                await dispatch(createNewAppointment(formData)).unwrap();
            }
            
            // Close modal and reset form
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save appointment:', err);
        }
    };

    // Handle delete directly without confirmation modal
    const handleDelete = async (appointmentId) => {
        if (window.confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
            try {
                await dispatch(removeAppointment(appointmentId)).unwrap();
            } catch (err) {
                console.error('Failed to delete appointment:', err);
            }
        }
    };

    // Handle join meeting
    const handleJoinMeeting = (appointment) => {
        // Add your meeting join logic here
        console.log('Joining meeting for:', appointment.clientName);
        // Example: window.open(appointment.meetingLink, '_blank');
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingAppointment(null);
        setFormData({
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            caseId: '',
            caseTitle: '',
            appointmentDate: '',
            appointmentTime: '',
            appointmentType: 'Consultation',
            priority: 'medium',
            notes: ''
        });
    };

    // ========== ADD/EDIT APPOINTMENT MODAL ==========
    const AddAppointmentModal = () => {
        return (
            <>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {editingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
                                </h3>
                                <button 
                                    onClick={handleCloseModal}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {/* Client Information */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Client Name *</label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        value={formData.clientName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Enter client name"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="clientEmail"
                                            value={formData.clientEmail}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            name="clientPhone"
                                            value={formData.clientPhone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="(555) 123-4567"
                                        />
                                    </div>
                                </div>

                                {/* Case Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Case ID</label>
                                        <input
                                            type="text"
                                            name="caseId"
                                            value={formData.caseId}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Case ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Case Title</label>
                                        <input
                                            type="text"
                                            name="caseTitle"
                                            value={formData.caseTitle}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="Case title"
                                        />
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                                        <input
                                            type="date"
                                            name="appointmentDate"
                                            value={formData.appointmentDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Time *</label>
                                        <input
                                            type="time"
                                            name="appointmentTime"
                                            value={formData.appointmentTime}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Appointment Type & Priority */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                        <select 
                                            name="appointmentType"
                                            value={formData.appointmentType}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            {appointmentTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                                        <select 
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            {priorities.map(priority => (
                                                <option key={priority} value={priority}>
                                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-3 mt-6 pt-6 border-t border-slate-200">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.clientName || !formData.clientEmail || !formData.appointmentDate || !formData.appointmentTime}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            <span>{editingAppointment ? 'Update Appointment' : 'Book Appointment'}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                    className="flex-1 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <AddAppointmentModal />

            {/* Error Alert */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                    <button onClick={() => dispatch(clearError())}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                    <p className="text-slate-600">
                        Manage your appointments and schedule meetings ({totalCount} total)
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                    <span>Book Appointment</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setCurrentView('today')}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        currentView === 'today' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    Today's Appointments
                </button>
                <button
                    onClick={() => setCurrentView('all')}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                        currentView === 'all' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    All Appointments
                </button>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Loading State */}
            {loading && displayAppointments.length === 0 && (
                <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            )}

            {/* Appointments Grid */}
            {!loading && filteredAppointments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAppointments.map((appointment) => (
                        <div key={appointment._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{appointment.clientName}</h3>
                                    <p className="text-sm text-slate-600">{appointment.appointmentType}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>

                            {/* Case Title */}
                            {appointment.caseTitle && (
                                <div className="mb-3 p-2 bg-slate-50 rounded">
                                    <p className="text-sm text-slate-700">{appointment.caseTitle}</p>
                                </div>
                            )}

                            {/* Details */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {appointment.appointmentTime}
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {appointment.clientEmail}
                                </div>
                                {appointment.clientPhone && (
                                    <div className="flex items-center text-sm text-slate-600">
                                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                        {appointment.clientPhone}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                                    {appointment.priority}
                                </span>
                                <div className="flex space-x-2">
                                    {currentView === 'today' && (
                                        <button 
                                            onClick={() => handleJoinMeeting(appointment)}
                                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm font-medium"
                                        >
                                            <Video className="w-4 h-4" />
                                            <span>Join</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleEdit(appointment)}
                                        className="p-2 text-slate-400 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(appointment._id)}
                                        className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg hover:border-red-300 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredAppointments.length === 0 && (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No appointments found</h3>
                    <p className="text-slate-600 mb-4">
                        {searchTerm 
                            ? 'No appointments match your search criteria' 
                            : 'No appointments scheduled for this period'}
                    </p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Book First Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagementUI;