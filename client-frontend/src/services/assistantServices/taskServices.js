import {api} from "../api.js";

// Get all assistant tasks for assistant..
export const getMyAssignedTasks = async(filters = {}) => {
    try{
        const params = new URLSearchParams();

        if(filters.status) params.append('status', filters.status);
        if(filters.priority) params.append('priority', filters.priority);
        if(filters.startDate) params.append('startDate', filters.startDate);
        if(filters.endDate) params.append('endDate', filters.endDate);

        const response = await api.get(`/tasks?${params.toString()}`);

        return {
            success : true,
            data : response.data.tasks || response.data,
            count : response.data.count
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to fetch assisgned tasks'
        }
    }
}

// Get today's tasks..
export const getTodaysTasks = async() => {
    try{
        const response = await api.get('/tasks/today');

        return {
            success : true,
            data : response.data.tasks || response.data,
            count : response.data.count
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.error || 'Unable to fetch todays tasks'
        };
    }
};

// get Tasks by Id.
export const getTaskById = async(id) => {
    try{
        const response = await api.get(`/tasks/${id}`);

        return {
            success : true,
            data : response.data.task || response.data
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to fetch tasks details'
        };
    }
};

// Mark tasks as completed..
export const completeTask = async(taskId) => {
    try{

        const response = await api.put(`/tasks/${taskId}/complete`);

        return {
            success : true,
            data : response.data.task || response.data.tasks,
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to mark task as completed'

        }
    }
}

// update task (status, notes, progress)
export const updateTask = async(taskId, taskData) => {
    try{
        const response = await api.put(`/tasks/${taskId}`, taskData);
        return {
            success : true,
            data : response.data.task || response.data.tasks
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update tasks status'
        }
    }
};

// Update tasks progress.
export const updateTaskProgress = async(taskId, progress) => {
    try{

        const response = await api.put(`/tasks/${taskId}`, {
            progress,
            status : progress === 100 ? 'Completed' : 'In Progress'
        });

        return {
            success : true,
            data : response.data.task || response.data.tasks
        };        
    }catch(error){
        return{
        success : false,
        message : error.response?.data?.message || 'Unable to update progress'
        };
    }
};

// Get task statistics
export const getTaskStats = async () => {
    try {
        const response = await api.get('/tasks/stats');

        return {
            success: true,
            data: response.data.stats || response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Unable to fetch task statistics'
        };
    }
};

// Get assigned cases
export const getAssignedCases = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);

        const response = await api.get(`/cases?${params.toString()}`);

        return {
            success: true,
            data: response.data.cases || response.data,
            count: response.data.count
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Unable to fetch assigned cases'
        };
    }
};

// Get case by ID
export const getCaseById = async (caseId) => {
    try {
        const response = await api.get(`/cases/${caseId}`);

        return {
            success: true,
            data: response.data.case || response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Unable to fetch case details'
        };
    }
};

export default {
    getMyAssignedTasks,
    getTodaysTasks,
    getTaskById,
    completeTask,
    updateTask,
    updateTaskProgress,
    getTaskStats,
    getAssignedCases,
    getCaseById
};