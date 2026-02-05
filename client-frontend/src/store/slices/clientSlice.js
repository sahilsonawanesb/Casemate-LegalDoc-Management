import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClient
} from '../../services/attorneyServices/clientServices';

// --------------------
// Initial State
// --------------------
const initialState = {
  list: [],
  selectedClient: null,
  searchTerm: '',
  filters: {
    status: 'All',
    caseType: 'ALL'
  },
  loading: false,
  error: null,
  totalCount: 0
};

// --------------------
// Async Thunks
// --------------------
export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAllClients(filters);
      // Handle case where data.clients might be undefined
      return data.clients || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch clients'
      );
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchById',
  async (clientId, { rejectWithValue }) => {
    try {
      const data = await getClientById(clientId);
      return data.clients;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch client'
      );
    }
  }
);

export const createClients = createAsyncThunk(
  'clients/create',
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await createClient(clientData);
      return data.client;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create client'
      );
    }
  }
);

export const updateClients = createAsyncThunk(
  'clients/update',
  async ({ clientId, clientData }, { rejectWithValue }) => {
    try {
      const data = await updateClient(clientId, clientData);
      return data.client;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update client'
      );
    }
  }
);

export const deleteClients = createAsyncThunk(
  'clients/delete',
  async (clientId, { rejectWithValue }) => {
    try {
      await deleteClient(clientId);
      return clientId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete client'
      );
    }
  }
);

export const searchClients = createAsyncThunk(
  'clients/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const data = await searchClient(searchTerm);
      // Handle case where data.clients might be undefined
      return data.clients || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search clients'
      );
    }
  }
);

// --------------------
// Slice
// --------------------
const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    clearSelectedClient: (state) => {
      state.selectedClient = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.totalCount = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single client
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create client
      .addCase(createClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(createClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update client
      .addCase(updateClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClients.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.list.findIndex(
          (c) => c._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }

        if (state.selectedClient?._id === action.payload._id) {
          state.selectedClient = action.payload;
        }
      })
      .addCase(updateClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete client
      .addCase(deleteClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (c) => c._id !== action.payload
        );
        state.totalCount -= 1;

        if (state.selectedClient?._id === action.payload) {
          state.selectedClient = null;
        }
      })
      .addCase(deleteClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search clients
      .addCase(searchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.totalCount = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(searchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// --------------------
// Exports
// --------------------
export const {
  setSelectedClient,
  clearSelectedClient,
  setSearchTerm,
  setFilters,
  clearError
} = clientSlice.actions;

export default clientSlice.reducer;