import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addTeamMember, assignCaseToMember, deleteMember, getAllMembers, getTeamMemberById, getTeamMemberWorkload, getTeamStats, searchTeamMembers, unassignCaseFromMember, updateTeamMember } from "../../services/attorneyServices/teamServices";



// Async thunks... 
// so we can interact with backend services as follows..
export const fetchAllTeamMembers = createAsyncThunk(
    'team/fetchAll',
    async(filters = {}, {rejectWithValue}) => {
        try{
            const result = await getAllMembers(filters);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return result.data;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch team members'
            )
        }
    }
);

export const fetchTeamMemberById = createAsyncThunk(
    'team/fetchById',
    async(id, {rejectWithValue}) => {
        try{
            const result = await getTeamMemberById(id);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            let memberData = result.data;

            if(Array.isArray(memberData)){
                memberData = memberData[0]
            }

            return memberData   ;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch team member'
            )
        }
    }
);

export const createTeamMember = createAsyncThunk(
    'team/create',
    async(memberData, {rejectWithValue}) => {
        try{

            const result = await addTeamMember(memberData);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return result.teamMember;

        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to create team member'
            )
        }
    }
);


export const modifyTeamMember = createAsyncThunk(
    'team/modify',
    async({id, memberData}, {rejectWithValue}) => {
        try{
            const result = await updateTeamMember(id, memberData);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return result.teamMember;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to update team member'
            )
        }
    }
);


export const removeTeamMember = createAsyncThunk(
    'team/remove',
    async(id, {rejectWithValue}) => {
        try{
            const result = await deleteMember(id);
            if(!result.success){
                return rejectWithValue(result.message);
            }
            return id;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to delete team member'
            );
        }
    }
);

export const assignCase = createAsyncThunk(
    'team/assignCase',
    async({memberId, caseData}, {rejectWithValue}) => {
        try{
            const result = await assignCaseToMember(memberId, caseData);

            if(!result.success){
                return rejectWithValue(result.message);
            }
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to assign case'
            );
        }
    }
);

export const unassignCase = createAsyncThunk(
    'team/unassignCase',
    async({memberId, caseId}, {rejectWithValue}) => {
        try{   
            const result = await unassignCaseFromMember(memberId, caseId);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return result.teamMember;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to unassign case'
            );
        }
    }
);

export const fetchTeamMemberWorkload = createAsyncThunk(
    'team/fetchWorkload',
    async(id, {rejectWithValue}) => {
        try{

            const result = await getTeamMemberWorkload(id);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return {
                id,
                workload : result.workload
            };
            
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to fetch workload'
            );
        }
    }
);

export const fetchTeamStats = createAsyncThunk(
    'team/fetchStats',
    async(_, {rejectWithValue}) => {
        try{

            const result = await getTeamStats();
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return result.stats;

        }catch(error){
            return rejectWithValue(
                error.response?.message || 'Unable to fetch team stats'
            )
        }
    }
);

export const searchMembers = createAsyncThunk(
    'team/search',
    async(query, {rejectWithValue}) => {
        try{
            const result = await searchTeamMembers(query);
            if(!result.success){
                return rejectWithValue(result.message);
            }

            return result.teamMembers;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to search team members'
            );
        }
    }
);


// Initial State..
const initialState = {
    teamMembers : [],
    selectedTeamMember : null,
    workloads : {},
    stats : {
        totalMembers : 0,
        activeMembers : 0,
        byRole : [],
        byStatus : [],
        totalTasks : 0,
    },
    searchResults : [],
    loading : false,
    error : null,
    filters : {
        status : 'all',
        role : 'all'
    },
    totalCount : 0
};


const teamSlice = createSlice({
    name : 'team',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        clearSelectedTeamMember: (state) => {
            state.selectedTeamMember = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch all team members
            .addCase(fetchAllTeamMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTeamMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.teamMembers = action.payload || [];
                state.totalCount = action.payload?.length || 0;
            })
            .addCase(fetchAllTeamMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch team member by ID
            .addCase(fetchTeamMemberById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMemberById.fulfilled, (state, action) => {
                state.selectedTeamMember = action.payload;
                state.loading = false;
                
            })
            .addCase(fetchTeamMemberById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create team member
            .addCase(createTeamMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTeamMember.fulfilled, (state, action) => {
                state.loading = false;
                state.teamMembers.push(action.payload);
                state.totalCount += 1;
            })
            .addCase(createTeamMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Modify team member
            .addCase(modifyTeamMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(modifyTeamMember.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.teamMembers.findIndex(
                    member => member._id === action.payload._id
                );
                if (index !== -1) {
                    state.teamMembers[index] = action.payload;
                }
                if (state.selectedTeamMember?._id === action.payload._id) {
                    state.selectedTeamMember = action.payload;
                }
            })
            .addCase(modifyTeamMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Remove team member
            .addCase(removeTeamMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTeamMember.fulfilled, (state, action) => {
                state.loading = false;
                state.teamMembers = state.teamMembers.filter(
                    member => member._id !== action.payload
                );
                state.totalCount -= 1;
                if (state.selectedTeamMember?._id === action.payload) {
                    state.selectedTeamMember = null;
                }
            })
            .addCase(removeTeamMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Assign case
            .addCase(assignCase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignCase.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.teamMembers.findIndex(
                    member => member._id === action.payload._id
                );
                if (index !== -1) {
                    state.teamMembers[index] = action.payload;
                }
                if (state.selectedTeamMember?._id === action.payload._id) {
                    state.selectedTeamMember = action.payload;
                }
            })
            .addCase(assignCase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Unassign case
            .addCase(unassignCase.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unassignCase.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.teamMembers.findIndex(
                    member => member._id === action.payload._id
                );
                if (index !== -1) {
                    state.teamMembers[index] = action.payload;
                }
                if (state.selectedTeamMember?._id === action.payload._id) {
                    state.selectedTeamMember = action.payload;
                }
            })
            .addCase(unassignCase.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch workload
            .addCase(fetchTeamMemberWorkload.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamMemberWorkload.fulfilled, (state, action) => {
                state.loading = false;
                state.workloads[action.payload.id] = action.payload.workload;
            })
            .addCase(fetchTeamMemberWorkload.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch stats
            .addCase(fetchTeamStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeamStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload || initialState.stats;
            })
            .addCase(fetchTeamStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Search members
            .addCase(searchMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload || [];
            })
            .addCase(searchMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Actions 
export const {
    setFilters,
    clearFilters,
    clearSelectedTeamMember,
    clearSearchResults,
    clearError
} = teamSlice.actions;


// Selectors.
export const selectAllTeamMembers = (state) => state.team.teamMembers;
export const selectSelectedTeamMember = (state) => state.team.selectedTeamMember;
export const selectTeamLoading = (state) => state.team.loading;
export const selectTeamError = (state) => state.team.error;
export const selectTeamFilters = (state) => state.team.filters;
export const selectTeamStats = (state) => state.team.stats;
export const selectTeamWorkloads = (state) => state.team.workloads;
export const selectSearchResults = (state) => state.team.searchResults;
export const selectTotalCount = (state) => state.team.totalCount;

export default teamSlice.reducer;


