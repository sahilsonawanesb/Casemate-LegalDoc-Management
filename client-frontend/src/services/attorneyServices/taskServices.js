import { Aperture, FastForward } from "lucide-react";
import {api} from "../api.js";



// task servies so that it can communicate with backend servies..

// get all tasks with optional filters..
export const getAllTasks = async (filters = {}) => {
    try{
        const params = new URLSearchParams();
        if(filters.status) params.append('status', filters.status);
        if(filters.priority) params.append('priority', filters.priority);
        if(filters.caseId) params.append('caseId', filters.caseId);
        if(filters.startDate) params.append('startDate', filters.startDate);
        if(filters.dueDate) params.append('dueDate', filters.dueDate);


        const response = await api.get(`/tasks?${params.toString()}`);

        return {
            success : true,
            tasks : response.data.tasks || []
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get all tasks'
        }
    }
}


// get task by Id..
export const getTaskById = async(id) => {
    try{

        const response = await api.get(`/tasks/${id}`);

        return {
            success : true,
            task : response.data.task
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get task by id'
        }
    }
}

// create new task:-
export const createTask = async(taskData) => {
    try{
        const response = await api.post('/tasks/create', taskData);

        return {
            success : true,
            task : response.data.task
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to create new task'
        }
    }
}

// Update task
export const updateTask = async(id, taskData) => {
    try{
          console.log('Updating task with data:', taskData);  
        const response = await api.put(`/tasks/${id}`, taskData);

        return {
            success : true,
            task : response.data.task
        };
    }catch(error){
          console.error('Update error:', error.response?.data);
        return {
            success : false,
            message : error.response?.data?.error || 'Unable to update task'
        }
    }
}


// Delete tasks..
export const deleteTask = async(id) => {
    try{
        const response = await api.delete(`/tasks/${id}`);

        return {
            success : true,
            message : response.data.message,

        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to delete task'
        }
    }
}

// Mark tasks as completed 
export const markTaskCompleted = async(id) => {
    try{
        const response = await api.patch(`/tasks/${id}/complete`);

        return {
            success : true,
            task : response.data.task
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Unable to mark as completed'
        }
    }
}

// Toogle subtasks
export const toogleSubtask = async(taskId, subtaskId) => {
    try{
        const response = await api.patch(`/tasks/${taskId}/subtask/${subtaskId}/toggle`);

        return {
            success : true,
            task : response.data.task
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Unable to toggle subtasks'
        }
    }
}


// Get tasks by cases..
export const getTaskByCase = async(caseId) => {
    try{
        const response = await api.get(`/tasks/case/${caseId}`);

        return {
            success : true,
            task : response.data.task || []
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get tasks by case'
        }
    }
}

// Get today's tasks..
export const getTodaysTask = async() => {
    try{
        const response = await api.get(`/tasks/today`);

        return {
            succsses : true,
            tasks : response.data.tasks || []
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get todays tasks'
        }
    }
}

// Get upcoming tasks
export const getUpcomingTasks = async() => {
    try{
        const response = await api.get('/tasks/upcoming');
        return {
            success : true,
            task : response.data.response || []
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get upcoming tasks'
        }
    }
}

// Get overdue tasks..
export const getOverDueTask = async() => {
    try{
        const response = await api.get('/tasks/overDue');

        return {
            success : true,
            tasks : response.data.tasks || []
        };
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get overdue tasks'
        }
    }
}

// get Tasks staticts ..

export const getTaskStats = async() => {
    try{
        const response = await api.get('/tasks/getStats');

        return {
            success : true,
            stats : response.data.stats,
        }
    }catch(error){
        return {
            success : false,
            message : error?.response?.data?.message || 'Unable to get task stats'
        }
    }
}

