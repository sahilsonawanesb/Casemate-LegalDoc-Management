// dashboardController.js

import Case from "../case/case.model.js";
import { clientModel } from "../client/client.model.js";
import { documentModel } from "../documents/document.model.js";
import Task from "../task/task.model.js";
import teamModel from "../team/team.model.js";

/* ================================
   DASHBOARD STATS
================================ */
export const getDashboardStats = async (req, res) => {
  try {
    const [totalClients, activeCases, documentsUploaded, pendingTasks] =
      await Promise.all([
        clientModel.countDocuments({ status: { $ne: "inactive" } }),
        Case.countDocuments({ status: { $in: ["open", "active", "in-progress"] } }),
        documentModel.countDocuments(),
        Task.countDocuments({ status: { $in: ["pending", "in-progress", "todo"] } })
      ]);

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const revenueAgg = await Case.aggregate([
      { $match: { createdAt: { $gte: currentMonth } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$billingAmount", 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalClients,
        activeCases,
        documentsUploaded,
        pendingTasks,
        upcomingDeadlines: 0,
        monthlyRevenue: revenueAgg[0]?.total || 0
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   RECENT DOCUMENTS
   GET /api/dashboard/recent/document
================================ */
export const getRecentDocuments = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const documents = await documentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("fileName fileType fileSize uploadedAt documentType");

    res.status(200).json({
      success: true,
      data: documents || [],
      count: documents.length
    });
  } catch (error) {
    console.error("Recent documents error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   TEAM ACTIVITY
   GET /api/dashboard/team/activity
================================ */
export const getTeamActivity = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const members = await teamModel
      .find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select("name role status updatedAt");

    const activity = members.map((m) => ({
      id: m._id,
      userName: m.name,
      action: "updated profile",
      description: `${m.role} - ${m.status}`,
      timestamp: m.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: activity,
      count: activity.length
    });
  } catch (error) {
    console.error("Team activity error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   UPCOMING DEADLINES
   GET /api/dashboard/deadlines
================================ */
export const getUpcomingDeadlines = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const tasks = await Task.find({
      dueDate: { $gte: new Date() },
      status: { $ne: "completed" }
    })
      .sort({ dueDate: 1 })
      .limit(limit)
      .select("title dueDate priority");

    res.status(200).json({
      success: true,
      data: tasks || [],
      count: tasks.length
    });
  } catch (error) {
    console.error("Deadlines error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   PENDING TASKS
   GET /api/dashboard/tasks/pending
================================ */
export const getPendingTasks = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const tasks = await Task.find({
      status: { $in: ["pending", "in-progress", "todo"] }
    })
      .sort({ dueDate: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      data: tasks || [],
      count: tasks.length
    });
  } catch (error) {
    console.error("Pending tasks error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   REVENUE ANALYTICS
   GET /api/dashboard/revenue
================================ */
export const getRevenueAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "monthly";
    let startDate = new Date();

    if (period === "weekly") startDate.setDate(startDate.getDate() - 7);
    if (period === "monthly") startDate.setMonth(startDate.getMonth() - 1);
    if (period === "yearly") startDate.setFullYear(startDate.getFullYear() - 1);

    const data = await Case.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: { $ifNull: ["$billingAmount", 0] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: { period, analytics: data }
    });
  } catch (error) {
    console.error("Revenue analytics error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================================
   CLIENT OVERVIEW
   GET /api/dashboard/clients/overview
================================ */
export const getClientOverview = async (req, res) => {
  try {
    const total = await clientModel.countDocuments();
    const active = await clientModel.countDocuments({ status: "active" });

    res.status(200).json({
      success: true,
      data: { total, active }
    });
  } catch (error) {
    console.error("Client overview error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Refresh all dashboard data
// @route   POST /api/dashboard/refresh
// @access  Private
export const refreshDashboard = async (req, res) => {
    try {
        // This will trigger a refresh of all dashboard data
        // You can add caching logic here if needed
        
        // Fetch all stats
        const totalClients = await clientModel.countDocuments({ status: { $ne: 'inactive' } });
        const activeCases = await Case.countDocuments({ 
            status: { $in: ['open', 'active', 'in-progress'] } 
        });
        const documentsUploaded = await documentModel.countDocuments();
        const pendingTasks = await Task.countDocuments({ 
            status: { $in: ['pending', 'in-progress', 'todo'] } 
        });

        // Get recent documents
        const recentDocuments = await documentModel.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select('fileName fileType fileSize uploadedAt');

        // Get team activity
        const teamMembers = await teamModel.find()
            .sort({ updatedAt: -1 })
            .limit(3)
            .select('name email role status updatedAt');

        const teamActivity = teamMembers.map(member => ({
            member: member.name,
            action: 'updated profile',
            task: `${member.role} - ${member.status}`,
            timestamp: member.updatedAt
        }));

        res.status(200).json({
            success: true,
            message: 'Dashboard refreshed successfully',
            data: {
                stats: {
                    totalClients,
                    activeCases,
                    documentsUploaded,
                    pendingTasks,
                    upcomingDeadlines: 0,
                    monthlyRevenue: 0
                },
                recentDocuments,
                teamActivity
            }
        });

    } catch (error) {
        console.error('Error refreshing dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refresh dashboard',
            error: error.message
        });
    }
};

export const getCaseStatistics = async (req, res) => {
    try {
        const stats = await Case.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const casesByPriority = await Case.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const casesByType = await Case.aggregate([
            {
                $group: {
                    _id: '$caseType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byStatus: stats,
                byPriority: casesByPriority,
                byType: casesByType
            }
        });

    } catch (error) {
        console.error('Error fetching case statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch case statistics',
            error: error.message
        });
    }
};


export default {
    getDashboardStats,
    getRecentDocuments,
    getTeamActivity,
    getUpcomingDeadlines,
    getPendingTasks,
    getRevenueAnalytics,
    getCaseStatistics,
    getClientOverview,
    refreshDashboard
};