import express from "express";
import { completeTask, deleteDocuments, downloadDocuments, getAssignedCases, getCasesById, getDocumentByClient, getDocumentStats, getMyAssignedTasks, getMyClients, getMyDashboardStats, getMyDocuments, getMyProfile, getTodaysTasks, search, updateTasks, uploadDocuments } from "../features/assistant/assistant.controller.js";
import { upload } from "../middleware/upload.middleware.js";


// assistantRouter..
const assistantRouter = express.Router();

// Dashboard stats..
assistantRouter.get('/stats', (req, res, next) => {
    getMyDashboardStats(req, res, next);
});

assistantRouter.get('/profile', (req, res, next) => {
    getMyProfile(req, res, next);
});

// Cases:
assistantRouter.get('/cases', (req, res, next) => {
    getAssignedCases(req, res, next);
});
assistantRouter.get('/cases/:id', (req, res, next) => {
    getCasesById(req, res, next);
});

// Tasks:
assistantRouter.get('/tasks', (req, res, next) => {
    getMyAssignedTasks(req, res, next);
});

assistantRouter.get('/tasks/today', (req, res, next) => {
    getTodaysTasks(req, res, next);
});

assistantRouter.patch('/task/:id/complete', (req, res, next) => {
    completeTask(req, res, next);
});

assistantRouter.put('/task/:id', (req, res, next) => {
    updateTasks(req, res, next);
});

// Documents:-
assistantRouter.get('/documents', (req, res, next) => {
    getMyDocuments(req, res, next);
});

// search documents.
assistantRouter.get('/documents/search', (req, res, next) => {
    search(req, req, next);
});

// documents stats..
assistantRouter.get('/documents/stats', (req, res, next) => {
    getDocumentStats(req, res, next);
});


// documents by client.
assistantRouter.get('/document/client/:clientId', (req, res, next) => {
    getDocumentByClient(req, res, next);
});


// download documents.
assistantRouter.get('/documents/:id/download', (req, res, next) => {
    downloadDocuments(req, res, next);
});

// upload documents..
assistantRouter.post('/documents', upload.single('file'),(req, res, next) => {
    uploadDocuments(req, res, next);
});

// delete documents.
assistantRouter.delete('/document/:id', (req, res, next) => {
    deleteDocuments(req, res, next);
});

// clients..
assistantRouter.get('/clients', (req, res, next) => {
    getMyClients(req, res, next);
});

export default assistantRouter;






