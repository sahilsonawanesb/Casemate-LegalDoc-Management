import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardStats,
  getRecentDocuments,
  getTeamActivity,
  getUpcomingDeadlines,
  getPendingTasks,
  getRevenueAnalytics,
  getCaseStatistics,
  getClientOverview,
  refreshDashboard
} from "../../services/attorneyServices/dashboardServices.js";

/* ================================
   ASYNC THUNKS
================================ */

// Dashboard stats
export const fetchDashboardStat = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    const result = await fetchDashboardStats();
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Recent documents
export const fetchRecentDocuments = createAsyncThunk(
  "dashboard/fetchRecentDocuments",
  async (limit = 5, { rejectWithValue }) => {
    const result = await getRecentDocuments(limit);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Team activity
export const fetchTeamActivity = createAsyncThunk(
  "dashboard/fetchTeamActivity",
  async (limit = 5, { rejectWithValue }) => {
    const result = await getTeamActivity(limit);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Upcoming deadlines
export const fetchUpcomingDeadlines = createAsyncThunk(
  "dashboard/fetchUpcomingDeadlines",
  async (limit = 10, { rejectWithValue }) => {
    const result = await getUpcomingDeadlines(limit);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Pending tasks
export const fetchPendingTasks = createAsyncThunk(
  "dashboard/fetchPendingTasks",
  async (limit = 10, { rejectWithValue }) => {
    const result = await getPendingTasks(limit);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Revenue analytics
export const fetchRevenueAnalytics = createAsyncThunk(
  "dashboard/fetchRevenueAnalytics",
  async (period = "monthly", { rejectWithValue }) => {
    const result = await getRevenueAnalytics(period);
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Case statistics
export const fetchCaseStatistics = createAsyncThunk(
  "dashboard/fetchCaseStatistics",
  async (_, { rejectWithValue }) => {
    const result = await getCaseStatistics();
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Client overview
export const fetchClientOverview = createAsyncThunk(
  "dashboard/fetchClientOverview",
  async (_, { rejectWithValue }) => {
    const result = await getClientOverview();
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

// Refresh dashboard
export const refreshDashboardData = createAsyncThunk(
  "dashboard/refreshDashboard",
  async (_, { rejectWithValue }) => {
    const result = await refreshDashboard();
    if (!result.success) {
      return rejectWithValue(result.message);
    }
    return result.data;
  }
);

/* ================================
   INITIAL STATE
================================ */
const initialState = {
  stats: {
    totalClients: 0,
    activeCases: 0,
    documentsUploaded: 0,
    monthlyRevenue: 0,
    pendingTasks: 0,
    upcomingDeadlines: 0
  },
  recentDocuments: [],
  teamActivity: [],
  upcomingDeadlines: [],
  pendingTasks: [],
  revenueAnalytics: null,
  caseStatistics: null,
  clientOverview: null,
  loading: false,
  error: null,
  lastRefreshed: null
};

/* ================================
   SLICE
================================ */
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: () => initialState
  },
  extraReducers: (builder) => {
    builder

      /* DASHBOARD STATS */
      .addCase(fetchDashboardStat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStat.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload ?? initialState.stats;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchDashboardStat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* RECENT DOCUMENTS */
      .addCase(fetchRecentDocuments.fulfilled, (state, action) => {
        state.recentDocuments = action.payload ?? [];
      })

      /* TEAM ACTIVITY */
      .addCase(fetchTeamActivity.fulfilled, (state, action) => {
        state.teamActivity = action.payload ?? [];
      })

      /* UPCOMING DEADLINES */
      .addCase(fetchUpcomingDeadlines.fulfilled, (state, action) => {
        state.upcomingDeadlines = action.payload ?? [];
      })

      /* PENDING TASKS */
      .addCase(fetchPendingTasks.fulfilled, (state, action) => {
        state.pendingTasks = action.payload ?? [];
      })

      /* REVENUE */
      .addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
        state.revenueAnalytics = action.payload ?? null;
      })

      /* CASE STATS */
      .addCase(fetchCaseStatistics.fulfilled, (state, action) => {
        state.caseStatistics = action.payload ?? null;
      })

      /* CLIENT OVERVIEW */
      .addCase(fetchClientOverview.fulfilled, (state, action) => {
        state.clientOverview = action.payload ?? null;
      })

      /* REFRESH DASHBOARD */
      .addCase(refreshDashboardData.fulfilled, (state, action) => {
        state.stats = action.payload?.stats ?? state.stats;
        state.recentDocuments =
          action.payload?.recentDocuments ?? state.recentDocuments;
        state.teamActivity =
          action.payload?.teamActivity ?? state.teamActivity;
        state.lastRefreshed = new Date().toISOString();
      });
  }
});

/* ================================
   EXPORTS
================================ */
export const { clearError, clearDashboard } =
  dashboardSlice.actions;

// Selectors (SAFE)
export const selectDashboardStats = (state) =>
  state.dashboard?.stats ?? initialState.stats;

export const selectRecentDocuments = (state) =>
  state.dashboard?.recentDocuments ?? [];

export const selectTeamActivity = (state) =>
  state.dashboard?.teamActivity ?? [];

export const selectUpcomingDeadlines = (state) =>
  state.dashboard?.upcomingDeadlines ?? [];

export const selectPendingTasks = (state) =>
  state.dashboard?.pendingTasks ?? [];

export const selectRevenueAnalytics = (state) =>
  state.dashboard?.revenueAnalytics;

export const selectCaseStatistics = (state) =>
  state.dashboard?.caseStatistics;

export const selectClientOverview = (state) =>
  state.dashboard?.clientOverview;

export const selectDashboardLoading = (state) =>
  state.dashboard?.loading;

export const selectDashboardError = (state) =>
  state.dashboard?.error;

export const selectLastRefreshed = (state) =>
  state.dashboard?.lastRefreshed;

export default dashboardSlice.reducer;
