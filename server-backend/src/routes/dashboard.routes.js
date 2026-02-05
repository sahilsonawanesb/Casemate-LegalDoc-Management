import express from "express";
import { getCaseStatistics, getDashboardStats, getPendingTasks, getRevenueAnalytics,getUpcomingDeadlines, refreshDashboard, getClientOverview, getRecentDocuments, getTeamActivity } from "../features/dashboard/dashboardController.js";

const dashboardRouter = express.Router();

// get dashboard stats..
dashboardRouter.get('/stats', (req, res, next) => {
    getDashboardStats(req, res, next);
});

// get recent documents..
dashboardRouter.get('/recent/document', (req, res, next) => {
    getRecentDocuments(req, res, next);
});

// get team activity...
dashboardRouter.get('/team/activity', (req, res, next) => {
    getTeamActivity(req, res, next);
});

// upcoming deadlines..
dashboardRouter.get('/deadlines', (req, res, next) => {
    getUpcomingDeadlines(req, res, next);
});

// tasks pending.
dashboardRouter.get('/tasks/pending', (req, res, next) => {
    getPendingTasks(req, res, next);
});

// revenue.
dashboardRouter.get('/revenue', (req, res, next) => {
    getRevenueAnalytics(req, res, next);
});

// cases statitcs..
dashboardRouter.get('/cases/stats', (req, res, next) => {
    getCaseStatistics(req, res, next);
});

// client overview.
dashboardRouter.get('/clients/overview', (req, res, next) => {
    getClientOverview(req, res, next);
});

// refresh all dashboard data..
dashboardRouter.post('/refresh', (req, res, next) => {
    refreshDashboard(req, res, next);
});

export default dashboardRouter;