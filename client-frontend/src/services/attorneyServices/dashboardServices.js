import { api } from "../api.js";

/* ================================
   DASHBOARD STATS
================================ */
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats");

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Unable to fetch dashboard stats"
    };
  }
};

/* ================================
   RECENT DOCUMENTS
================================ */
export const getRecentDocuments = async (limit = 5) => {
  try {
    const response = await api.get(
      `/documents/recent?limit=${limit}`
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Unable to fetch recent documents"
    };
  }
};

/* ================================
   TEAM ACTIVITY
================================ */
export const getTeamActivity = async (limit = 5) => {
  try {
    const response = await api.get(
      `/team/activity?limit=${limit}`
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Unable to fetch team activity"
    };
  }
};

/* ================================
   UPCOMING DEADLINES
================================ */
export const getUpcomingDeadlines = async (limit = 10) => {
  try {
    const response = await api.get(
      `/dashboard/deadlines?limit=${limit}`
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Unable to fetch upcoming deadlines"
    };
  }
};

/* ================================
   PENDING TASKS
================================ */
export const getPendingTasks = async (limit = 10) => {
  try {
    const response = await api.get(
      `/dashboard/tasks/pending?limit=${limit}`
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Unable to fetch pending tasks"
    };
  }
};

/* ================================
   REVENUE ANALYTICS
================================ */
export const getRevenueAnalytics = async (
  period = "monthly"
) => {
  try {
    const response = await api.get(
      `/dashboard/revenue?period=${period}`
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Unable to fetch revenue analytics"
    };
  }
};

/* ================================
   CASE STATISTICS
================================ */
export const getCaseStatistics = async () => {
  try {
    const response = await api.get(
      "/dashboard/cases/stats"
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Unable to fetch case statistics"
    };
  }
};

/* ================================
   CLIENT OVERVIEW
================================ */
export const getClientOverview = async () => {
  try {
    const response = await api.get(
      "/dashboard/clients/overview"
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Unable to fetch client overview"
    };
  }
};

/* ================================
   REFRESH DASHBOARD
================================ */
export const refreshDashboard = async () => {
  try {
    const response = await api.post(
      "/dashboard/refresh"
    );

    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Unable to refresh dashboard"
    };
  }
};
