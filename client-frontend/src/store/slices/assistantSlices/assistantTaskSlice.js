// assistantTaskSlice.js - Redux slice for assistant task management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as taskService from '../../../services/assistantServices/taskServices.js';

// Async thunks
export const fetchMyAssignedTasks = createAsyncThunk(
    'assistantTask/fetchMyAssignedTasks',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const result = await taskService.getMyAssignedTasks(filters);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch tasks');
        }
    }
);

export const fetchTodaysTasks = createAsyncThunk(
    'assistantTask/fetchTodaysTasks',
    async (_, { rejectWithValue }) => {
        try {
            const result = await taskService.getTodaysTasks();
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch today\'s tasks');
        }
    }
);

export const fetchAssignedCases = createAsyncThunk(
    'assistantTask/fetchAssignedCases',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const result = await taskService.getAssignedCases(filters);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch assigned cases');
        }
    }
);

export const fetchCaseById = createAsyncThunk(
    'assistantTask/fetchCaseById',
    async (caseId, { rejectWithValue }) => {
        try {
            const result = await taskService.getCaseById(caseId);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch case details');
        }
    }
);

export const markTaskComplete = createAsyncThunk(
    'assistantTask/markTaskComplete',
    async (taskId, { rejectWithValue }) => {
        try {
            const result = await taskService.completeTask(taskId);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return { taskId, ...result };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to mark task as completed');
        }
    }
);

export const updateTaskData = createAsyncThunk(
    'assistantTask/updateTaskData',
    async ({ taskId, taskData }, { rejectWithValue }) => {
        try {
            const result = await taskService.updateTask(taskId, taskData);
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return { taskId, ...result };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update task');
        }
    }
);

export const fetchDashboardStats = createAsyncThunk(
    'assistantTask/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const result = await taskService.getMyDashboardStats();
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
        }
    }
);

export const fetchMyProfile = createAsyncThunk(
    'assistantTask/fetchMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const result = await taskService.getMyProfile();
            
            if (!result.success) {
                return rejectWithValue(result.message);
            }
            
            return result;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    }
);

// Initial state
const initialState = {
    tasks: [],
    todaysTasks: [],
    assignedCases: [],
    selectedCase: null,
    dashboardStats: {
        assignedCases: 0,
        tasks: {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
            today: 0
        },
        performance: {
            tasksCompleted: 0,
            casesHandled: 0
        }
    },
    profile: null,
    loading: false,
    tasksLoading: false,
    casesLoading: false,
    statsLoading: false,
    error: null,
    message: null,
    filters: {
        status: '',
        priority: '',
        startDate: '',
        endDate: ''
    }
};

// Slice
const assistantTaskSlice = createSlice({
    name: 'assistantTask',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        updateTaskLocally: (state, action) => {
            const { taskId, updates } = action.payload;
            const taskIndex = state.tasks.findIndex(t => t._id === taskId);
            if (taskIndex !== -1) {
                state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
            }
        },
        clearSelectedCase: (state) => {
            state.selectedCase = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch assigned tasks
            .addCase(fetchMyAssignedTasks.pending, (state) => {
                state.tasksLoading = true;
                state.error = null;
            })
            .addCase(fetchMyAssignedTasks.fulfilled, (state, action) => {
                state.tasksLoading = false;
                state.tasks = action.payload.data;
            })
            .addCase(fetchMyAssignedTasks.rejected, (state, action) => {
                state.tasksLoading = false;
                state.error = action.payload;
            })
            
            // Fetch today's tasks
            .addCase(fetchTodaysTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.todaysTasks = action.payload.data;
            })
            .addCase(fetchTodaysTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch assigned cases
            .addCase(fetchAssignedCases.pending, (state) => {
                state.casesLoading = true;
                state.error = null;
            })
            .addCase(fetchAssignedCases.fulfilled, (state, action) => {
                state.casesLoading = false;
                state.assignedCases = action.payload.data;
            })
            .addCase(fetchAssignedCases.rejected, (state, action) => {
                state.casesLoading = false;
                state.error = action.payload;
            })
            
            // Fetch case by ID
            .addCase(fetchCaseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCaseById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCase = action.payload.data;
            })
            .addCase(fetchCaseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Mark task complete
            .addCase(markTaskComplete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markTaskComplete.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                
                // Update task in the list
                const taskIndex = state.tasks.findIndex(t => t._id === action.payload.taskId);
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = action.payload.data;
                }
            })
            .addCase(markTaskComplete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update task
            .addCase(updateTaskData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskData.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
                
                // Update task in the list
                const taskIndex = state.tasks.findIndex(t => t._id === action.payload.taskId);
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = action.payload.data;
                }
            })
            .addCase(updateTaskData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch dashboard stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                state.dashboardStats = action.payload.data;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.statsLoading = false;
                state.error = action.payload;
            })
            
            // Fetch profile
            .addCase(fetchMyProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload.data;
            })
            .addCase(fetchMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Actions
export const {
    clearError,
    clearMessage,
    setFilters,
    clearFilters,
    updateTaskLocally,
    clearSelectedCase
} = assistantTaskSlice.actions;

// Selectors
export const selectTasks = (state) => state.assistantTask?.tasks || [];
export const selectTodaysTasks = (state) => state.assistantTask?.todaysTasks || [];
export const selectAssignedCases = (state) => state.assistantTask?.assignedCases || [];
export const selectSelectedCase = (state) => state.assistantTask?.selectedCase || null;
export const selectDashboardStats = (state) => state.assistantTask?.dashboardStats || {
    assignedCases: 0,
    tasks: {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        today: 0
    },
    performance: {
        tasksCompleted: 0,
        casesHandled: 0
    }
};
export const selectProfile = (state) => state.assistantTask?.profile || null;
export const selectTasksLoading = (state) => state.assistantTask?.tasksLoading || false;
export const selectCasesLoading = (state) => state.assistantTask?.casesLoading || false;
export const selectStatsLoading = (state) => state.assistantTask?.statsLoading || false;
export const selectLoading = (state) => state.assistantTask?.loading || false;
export const selectError = (state) => state.assistantTask?.error || null;
export const selectMessage = (state) => state.assistantTask?.message || null;
export const selectFilters = (state) => state.assistantTask?.filters || {
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
};
export default assistantTaskSlice.reducer;