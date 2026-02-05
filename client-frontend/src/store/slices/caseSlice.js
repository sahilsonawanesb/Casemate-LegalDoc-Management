import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { getAllCases, getCaseById, createCases, updateCases, deletCases, getCasesByClients, addCaseActivitys } from '../../services/attorneyServices/caseServices.js';


// Initial State..
const initialState = {
    list : [],
    selectedCase : null,
    searchTerm : '',
    filters : {
        status : 'All',
        priority : 'All',
        caseType : 'All',
    },
    loading : false,
    error : null,
    totalCount : 0
};

// create async thunks so that it can connect or communicate with backend api's.

// fetch cases..
export const fetchCases = createAsyncThunk(
  'cases/fetchAll',
  async (_, { rejectWithValue }) => { // '_' because no argument needed
    try {
      const data = await getAllCases();
      if (!data.success) return rejectWithValue(data.message);
      return data.cases;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch all cases'
      );
    }
  }
);

// get cases by Id.
export const fetchCaseById = createAsyncThunk(
    'cases/fetchById',
    async(caseId, {rejectWithValue}) => {
        try{
            const data = await getCaseById(caseId);
            return data.cases;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch case by id'
            )
        }
    }
);

// create case.
export const createCase = createAsyncThunk(
    'cases/create', 
    async(caseData, {rejectWithValue}) => {
        try{
            const data = await createCases(caseData);
            return data.cases;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create cases'
            )
        }
});

// update case.
export const updateCase = createAsyncThunk(
    'cases/update',     
    async({caseId, caseData}, {rejectWithValue}) => {
        try{
            const data = await updateCases(caseId, caseData);
            return data.cases;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update the cases'
            )
        }
});

// function to delete case.
export const deleteCase = createAsyncThunk(
    'cases/delete', async(caseId, {rejectWithValue}) => {
        try{
            await deletCases(caseId);
            return caseId;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete the case'
            );
        }
});

// get Cases by clients
export const getCasesByClient = createAsyncThunk(
    'cases/fetchByClient', 
    async(clientId, {rejectWithValue}) => {
        try{
            const data = await getCasesByClients(clientId);
            return data.cases;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch cases by clients'
            );
        }
});

// add cases activity.
export const addCaseActivity = createAsyncThunk(
    'cases/addActivity', 
    async({caseId, activityData}, {rejectWithValue}) => {
        try{
            const data = await addCaseActivitys(caseId, activityData);
            return data.case;
        }catch(error){
            return rejectWithValue(
                error.response?.data.message || 'Failed to add activity of cases'
            )
        }
});


// create slice as follows..

const casesSlice = createSlice({
    name : 'Cases',
    initialState,
    reducers : {
        setSelectedCase : (state, action) => {
            state.selectedCase = action.payload
        },

        clearSelectedCase : (state) => {
            state.selectedCase = null;
        },

        setSearchTerm : (state, action) => {
            state.searchTerm = action.payload;
        },

        setFilters : (state, action) => {
            state.filters = {...state.filters, ...action.payload}
        },

        clearError : (state) => {
            state.error = null;
        }
    },

    extraReducers : (builder) => {
        builder 

        // fetch all cases.
        .addCase(fetchCases.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchCases.fulfilled, (state, action) => {
            state.loading = false;

            state.list = Array.isArray(action.payload) ? action.payload : [];
            // state.list = action.payload.cases;

            state.totalCount = Array.isArray(action.payload) ? action.payload.length : 0
        })

        .addCase(fetchCases.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // fetch single case.
        .addCase(fetchCaseById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchCaseById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedCase = action.payload;
        })

        .addCase(fetchCaseById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Create cases..
        .addCase(createCase.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(createCase.fulfilled, (state, action) => {
            state.loading = false;
            if(action.payload){
            state.list.push(action.payload);
            state.totalCount += 1;
            }
        })

        .addCase(createCase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // Update Case.
        .addCase(updateCase.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(updateCase.fulfilled, (state, action) => {
            state.loading = false;
            if(!action.payload) return;

            const index = state.list.findIndex(c => c._id === action.payload._id);

            if(index !== -1){
                state.list[index] = action.payload;
            }
            
            if(state.selectedCase?._id === action.payload._id){
                state.selectedCase = action.payload;
            }
        })

        .addCase(updateCase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // deleteCases :-

        .addCase(deleteCase.pending, (state, action) => {
            state.loading = true;
            state.error = action.payload;
        })

        .addCase(deleteCase.fulfilled, (state, action) => {
            state.loading = false;
            state.list = state.list.filter(c => c._id !== action.payload);
            state.totalCount -= 1;
            if(state.selectedCase?._id === action.payload){
                state.selectedCase = null;
            }
        })

        .addCase(deleteCase.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })


        // add case activity..
        .addCase(addCaseActivity.fulfilled, (state, action) => {
            const index = state.list.findIndex(c => c._id === action.payload._id);

            if(index !== -1){
                state.list[index] = action.payload;
            }

            if(state.selectedCase?._id === action.payload._id){
                state.selectedCase = action.payload;
            }
        })
        
    }
    
});

export const {setSelectedCase, clearSelectedCase, setSearchTerm, setFilters, clearError} = casesSlice.actions;

export default casesSlice.reducer;