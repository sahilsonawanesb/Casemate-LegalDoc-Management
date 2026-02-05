import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createTask, deleteTask, getAllTasks, getOverDueTask, getTaskByCase, getTaskById, getTaskStats, getTodaysTask, getUpcomingTasks, markTaskCompleted, toogleSubtask, updateTask } from "../../services/attorneyServices/taskServices"



// initial state..
const initialState = {
    tasks : [],
    selectedTask : null,
    loading : false,
    error : null,
    filters : {
        status : 'all',
        priority : 'all',
        caseId : 'all'
    },
    stats : {
        totalTasks : 0,
        overdueTasks : 0,
        todayTasks : 0,
        byStatus : [],
        byPriority : []
    },
    todayTasks : [],
    upcomingTasks : [],
    overdueTasks : [],
    totalCount : 0
}

// async thunks so that we can communicate with backend services..
// Fetch all tasks..
export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAll',
    async(filters = {}, {rejectWithValue}) => {
        try{
            const data = await getAllTasks(filters);
            if(!data.success) return rejectWithValue(data.message);
            return data.tasks;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch tasks'
            )
        }
    }
);

// Fetch tasks by Id.
export const fetchTaskById = createAsyncThunk(
    'tasks/fetchById',
    async(taskId, {rejectWithValue}) => {
        try{
            const data = await getTaskById(taskId);
            if(!data.success) return rejectWithValue(data.message);
            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch all tasks'
            )
        }
    }
);

// Create Task.
export const createNewTask = createAsyncThunk(
    'tasks/create',
    async(taskData, {rejectWithValue}) => {
        try{
            const data = await createTask(taskData);
            if(!data.success) return rejectWithValue(data.message);

            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to create tasks'
            )
        }
    }
);

// Update Task.
export const updateExistingTask = createAsyncThunk(
    'tasks/update',
    async({id, taskData}, {rejectWithValue}) => {
        try{
            const data = await updateTask(id, taskData);
            if(!data.success) return rejectWithValue(data.message);
            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to update task'
            )
        }
    }
);

// Delete tasks
export const deleteExistingTask = createAsyncThunk(
    'tasks/delete',
    async(id, {rejectWithValue}) => {
        try{
            const data = await deleteTask(id);

            if(!data.success) return rejectWithValue(data.message); 

            return id;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to delete task'
            )
        }
    }
)

// Mark as completed.
export const markComplete = createAsyncThunk(
    'tasks/markComplete',
    async(id, {rejectWithValue}) => {
        try{
            const data = await markTaskCompleted(id);
            if(!data.success) return rejectWithValue(data.message);
            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to mark task as completed'
            );
        }
    }
);

// Toogle subtasks completed
export const toogleSubtaskCompletion = createAsyncThunk(
    'tasks/toogleSubtask',
    async({taskId, subtaskId}, {rejectWithValue}) => {
        try{
            const data = await toogleSubtask(taskId, subtaskId);
            if(!data.success) return rejectWithValue(data.message);

            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to toogle subtask'
            )
        }
    }
);

// Fetch Tasks by cases..
export const fetchTasksByCase = createAsyncThunk(
    'tasks/fetchByCase',
    async(caseId, {rejectWithValue}) => {
        try{
            const data = await getTaskByCase(caseId);
            if(!data.success) return rejectWithValue(data.message);
            return data.task;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch tasks by case'
            );
        }
    }
);

// Fetch today's tasks.
export const fetchTodaysTasks = createAsyncThunk(
    'tasks/fetchTodays',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getTodaysTask();
            if(!data.success) return rejectWithValue(data.message);
            return data.tasks;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch todays tasks'
            )
        }
    }
);

export const fetchUpcomingTasks = createAsyncThunk(
    'tasks/fetchUpcoming',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getUpcomingTasks();
            if (!data.success) return rejectWithValue(data.message);
            return data.task;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch upcoming tasks'
            );
        }
    }
);

// Fetch overdue tasks
export const fetchOverdueTasks = createAsyncThunk(
    'tasks/fetchOverdue',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getOverDueTask();
            if (!data.success) return rejectWithValue(data.message);
            return data.tasks;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch overdue tasks'
            );
        }
    }
);

// Fetch task stats
export const fetchTaskStats = createAsyncThunk(
    'tasks/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getTaskStats();
            if (!data.success) return rejectWithValue(data.message);
            return data.stats;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch task stats'
            );
        }
    }
);


// Slice..
const taskSlice = createSlice({
    name : 'tasks',
    initialState,
    reducers : {
        setFilters : (state, action) => {
            state.filters = {...state.filters, ...action.payload};
        },

        clearSelectedTask : (state) => {
            state.selectedTask = null
        },
        clearError : (state) => {
            state.error = null;
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(fetchAllTasks.pending, (state) => {
                state.loading = true,
                state.error = null
            })

            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })

            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch Tasks by Id/
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload;
            })

            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Task.
            .addCase(createNewTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createNewTask.fulfilled, (state, action) => {
                state.loading = false
                state.tasks.push(action.payload);
                state.totalCount = -1;
            })

            .addCase(createNewTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Tasks
            .addCase(updateExistingTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateExistingTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(
                    task => task._id === action.payload._id
                );

                if(index !== -1){
                    state.tasks[index] = action.payload;
                }

                if(state.selectedTask?._id === action.payload._id){
                    state.selectedTask = action.payload;
                }
            })

            .addCase(updateExistingTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteTasks
            .addCase(deleteExistingTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task._id !== action.payload);
                state.totalCount =- 1;

                if(state.selectedTask?._id === action.payload){
                    state.selectedTask = null;
                }
            })

            .addCase(deleteExistingTask.rejected, (state,action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark as completed.
            .addCase(markComplete.pending, (state,action) => {
                state.loading = true;
                const index = state.tasks.findIndex(
                    task => task._id === action.payload._id
                )
                if(index !== -1){
                    state.tasks[index] = action.payload;
                }

                if(state.selectedTask?._id === action.payload._id){
                    state.selectedTask = action.payload;
                }
            })

            .addCase(markComplete.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    task => task._id === action.payload._id
                )

                if(index !== -1){
                    state.tasks[index] = action.payload;
                }

                if(state.selectedTask._id === action.payload._id){
                    state.selectedTask = action.payload;
                }
            })

            // Toogle Subtask..
            .addCase(toogleSubtaskCompletion.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);

                if(index !== -1){
                    state.tasks[index] = action.payload;
                }

                if(state.selectedTask?._id === action.payload._id){
                    state.selectedTask = action.payload
                }
            })

            // Fetch tasks by case
            .addCase(fetchTasksByCase.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload || [];
                state.totalCount = action.payload?.length || [];
            })

            // Fetch today's tasks.
            .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
                state.todayTasks = action.payload || [];
            })

            // fetch upcoming tasks.
            .addCase(fetchUpcomingTasks.fulfilled, (state, action) => {
                state.upcomingTasks = action.payload || [];
            })

            // Fetch overdue tasks..
            .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
                state.overdueTasks = action.payload || [];
            })

            // Fetch stats..
            .addCase(fetchTaskStats.fulfilled, (state, action) => {
                state.stats = action.payload || initialState.stats;
            });
    }
});

// Actions..
export const  {
    setFilters,
    clearSelectedTask,
    clearError
} = taskSlice.actions;

// Selectors...
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectSelectedTask = (state) => state.tasks.selectedTask;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectFilters = (state) => state.tasks.filters;
export const selectTasksStats = (state) => state.tasks.stats;
export const selectTodayTasks = (state) => state.tasks.todayTasks;
export const selectUpcomingTasks = (state) => state.tasks.upcomingTasks;
export const selectOverdueTasks = (state) => state.tasks.overdueTasks;
export const selectTotalCount = (state) => state.tasks.totalCount;


export default taskSlice.reducer;