import { api } from "../api";

// Get all appointments..
export const getAllAppointments = async(filters = {}) => {
    try{
        const params = new URLSearchParams();
        
        if(filters.status) params.append('status', filters.status);
        if(filters.date) params.append('date', filters.date);
        if(filters.priority) params.append('priority', filters.priority);
        if(filters.appointmentType) params.append('appointmentType', filters.appointmentType);


        const response = await api.get(`/appointments/getAll?${params.toString()}`);

        return {
            success : true,
            data : response.data.data,
            count : response.data.count
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to fetch all appointments'
        }
    }
}

// Get todays appointment
export const getTodayAppointments = async() => {
    try{
        const response = await api.get('/appointments/today');

        return {
            success : true,
            data : response.data.data,
            count : response.data.count
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get Todays appointment'
        }
    }
};

// create appointment
export const createAppointment = async(appointmentData) => {
    try{
        const response = await api.post('/appointments/create', appointmentData);

       
    return {
        success: true,
        data: response.data.appointment,
        meetingLink: response.data.meetingLink,
        message: response.data.message
      }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to create new appointment'
        }
    }
};


// upcoming appointments..
export const getUpcomingAppointments = async(days = 7) => {
    try{
        const response = await api.get('/appointments/upcoming', {
            params : {days}
        });

        return {
            success : true,
            data : response.data.data,
            count : response.data.count
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get upcoming appointments'
        }
    }
}

// get single appointment by id..
export const getAppointmentById = async(id) => {
    try{
        const response = await api.get(`/appointments/${id}`);
        return {
            success : true,
            data : response.data.appointment
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get appointment by id'
        }
    }
}

// update appointment
export const updateAppointment = async(id, appointmentData) => {
    try{
        const response = await api.put(`/appointments/${id}/update`, appointmentData);

        return {
            success : true,
            data : response.data.appointment,
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update appointments'
        }
    }
}

// update appointment status..
export const updateAppointmentStatus = async(id, status) => {
    try{
        const response = await api.patch(`/appointments/${id}/status`, status);

        return {
            success : true,
            data : response.data.appointment
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update status'
        }
    }
}


// delete/cancel appointment..
export const cancelAppointment = async(id) => {
    try{
        const response = await api.delete(`/appointments/${id}`);

        return {
            success : true,
            data : response.data.appointment
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to cancel appointments'
        }
    }
}

// reschedule appointments.
export const rescheduleAppointment = async(appointmentId, appointmentDate, appointmentTime) => {
    try{
        const response = await api.post(`/appointments/${appointmentId}`,{
            appointmentDate,
            appointmentTime
        });

        return {
            success : true,
            data : response.data.appointment
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to reschedule appointment'
        }
    }
}

// get appointment stats.
export const getAppointmentStats = async() => {
    try{
        const response = await api.get('/appointments/stats');
        return {
            success : true,
            data : response.data.stats
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Failed to fetch statistics'
        }
    }
}