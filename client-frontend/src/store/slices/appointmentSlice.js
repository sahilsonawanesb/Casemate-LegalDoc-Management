// appointmentSlice.js - Redux state management for appointments

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { 
    getAllAppointments, 
    getAppointmentById, 
    createAppointment, 
    updateAppointment, 
    cancelAppointment,
    getUpcomingAppointments,
    getTodayAppointments
} from "../../services/attorneyServices/appointmentServices";

// Async Thunks
export const fetchAllAppointments = createAsyncThunk(
    'appointments/fetchAll',
    async(filters = {}, {rejectWithValue}) => {
        try{
            const result = await getAllAppointments(filters);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.data;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAppointmentById = createAsyncThunk(
    'appointments/fetchById',
    async(id, {rejectWithValue}) => {
        try{
            const result = await getAppointmentById(id);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.data;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const createNewAppointment = createAsyncThunk(
    'appointments/create',
    async(appointmentData, {rejectWithValue}) => {
        try{
            const result = await createAppointment(appointmentData);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.data;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const modifyAppointment = createAsyncThunk(
    'appointments/modify',
    async({id, appointmentData}, {rejectWithValue}) => {
        try{
            const result = await updateAppointment(id, appointmentData);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.data;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const removeAppointment = createAsyncThunk(
    'appointments/remove',
    async(id, {rejectWithValue}) => {
        try{
            const result = await cancelAppointment(id);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return id;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUpcomingSlots = createAsyncThunk(
    'appointments/fetchSlots',
    async(days, {rejectWithValue}) => {
        try{
            const result = await getUpcomingAppointments(days);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return {
                days,
                slots: result.slots
            };
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTodayAppointments = createAsyncThunk(
    'appointments/fetchToday',
    async(_, {rejectWithValue}) => {
        try{
            const result = await getTodayAppointments();
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.data;
        }catch(error){
            return rejectWithValue(error.message);
        }
    }
);

// Initial State
const initialState = {
    appointments: [],
    todayAppointments: [],
    upcomingAppointments : {},
    selectedAppointment: null,
    loading: false,
    error: null,
    filters: {
        status: 'all',
        date: null
    },
    totalCount: 0
};

// Slice
const appointmentSlice = createSlice({
    name: 'appointments',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearSelectedAppointment: (state) => {
            state.selectedAppointment = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all appointments
            .addCase(fetchAllAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchAllAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch today's appointments
            .addCase(fetchTodayAppointments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodayAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.todayAppointments = action.payload || [];
            })
            .addCase(fetchTodayAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create appointment
            .addCase(createNewAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments.push(action.payload);
                state.totalCount += 1;
            })
            .addCase(createNewAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Update appointment
            .addCase(modifyAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyAppointment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.appointments.findIndex(
                    apt => apt._id === action.payload._id
                );
                if(index !== -1){
                    state.appointments[index] = action.payload;
                }
                if(state.selectedAppointment?._id === action.payload._id){
                    state.selectedAppointment = action.payload;
                }
            })
            .addCase(modifyAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Delete appointment
            .addCase(removeAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = state.appointments.filter(
                    apt => apt._id !== action.payload
                );
                state.totalCount -= 1;
            })
            .addCase(removeAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch available slots
            .addCase(fetchUpcomingSlots.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUpcomingSlots.fulfilled, (state, action) => {
                state.loading = false;
                const { date, slots } = action.payload;

  state.upcomingAppointments[date] = slots; // ✅ OK 1029sahilsonawane@gmail.com
            })
            .addCase(fetchUpcomingSlots.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

// Actions
export const {
    setFilters,
    clearFilters,
    clearSelectedAppointment,
    clearError
} = appointmentSlice.actions;

// Selectors
export const selectAllAppointments = (state) => state.appointments.appointments;
export const selectTodayAppointments = (state) => state.appointments.todayAppointments;
export const selectSelectedAppointment = (state) => state.appointments.selectedAppointment;
export const selectUpcomingSlots = (state) => state.appointments.upcomingAppointments;
export const selectAppointmentLoading = (state) => state.appointments.loading;
export const selectAppointmentError = (state) => state.appointments.error;
export const selectAppointmentFilters = (state) => state.appointments.filters;
export const selectTotalAppointments = (state) => state.appointments.totalCount;

export default appointmentSlice.reducer;