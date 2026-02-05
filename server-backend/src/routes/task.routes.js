import express from 'express';
import { createTask, deleteTasks, getAllTasks, getSingleTask, getTaskByCase, getTodaysTask, getUpcomingTasks, getOverDueTasks, markAsCompleted, toggleSubtask, updateTasks, getStats } from '../features/task/task.controller.js';

const taskRouter = express.Router();

// GET routes - SPECIFIC ROUTES FIRST, DYNAMIC ROUTES LAST

// Get all tasks
taskRouter.get('/', getAllTasks);

// Get today's tasks
taskRouter.get('/today', getTodaysTask);

// Get upcoming tasks
taskRouter.get('/upcoming', getUpcomingTasks);

// Get overdue tasks
taskRouter.get('/overDue', getOverDueTasks);

// Get stats
taskRouter.get('/getStats', getStats);

// Get tasks by case - MUST BE BEFORE /:id
taskRouter.get('/case/:caseId', getTaskByCase);

// Get single task - MUST BE LAST among GET routes
taskRouter.get('/:id', getSingleTask);

// POST routes
taskRouter.post('/create', createTask);

// PUT routes
taskRouter.put('/:id', updateTasks);

// PATCH routes
taskRouter.patch('/:id/complete', markAsCompleted);
taskRouter.patch('/:id/subtask/:subtaskId/toggle', toggleSubtask);  

// DELETE routes
taskRouter.delete('/:id', deleteTasks);

export default taskRouter;