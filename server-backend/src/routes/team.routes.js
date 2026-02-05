import express from "express";
import { addMember, assignCase, deleteMember, getAllTeamMembers, getMember, getTeamMemberWorkload, searchTeamMembers, unassignCase, updateTeamMember } from "../features/team/team.controller.js";
import { getStats } from "../features/task/task.controller.js";

const teamRouter = express.Router();


// getAllMemeber..
teamRouter.get('/getAll', (req, res, next) => {
    getAllTeamMembers(req, res, next);
});

// getSpecific Team Member.
teamRouter.get('/get/:id', (req, res, next) => {
    getMember(req, res, next);
});

// getTeamMember Workload.
teamRouter.get('/:id/workload', (req, res, next) => {
    getTeamMemberWorkload(req, res, next);
});

// getStats.
teamRouter.get('/stats', (req, res, next) => {
    getStats(req, res, next);
});

// searchTeamMember.
teamRouter.get('/search', (req, res, next) => {
    searchTeamMembers(req, res, next);
});

// updateTeam Member Routes..
teamRouter.put('/:id', (req, res, next) => {
    updateTeamMember(req, res, next);
});

// deleteMember Routes..
teamRouter.delete('/:id', (req, res, next) => {
    deleteMember(req, res, next);
});

// create member..
teamRouter.post('/', (req, res, next) => {
    addMember(req, res, next);
});

// assign case to team member..
teamRouter.post('/:id/assign-case', (req, res, next) => {
    assignCase(req, res, next);
});

// unassign-cases..
teamRouter.delete('/:id/unassign-case/:caseId', (req, res, next) => {
    unassignCase(req, res, next);
});


// addMember Routes..
teamRouter.post('/create', (req, res, next) => {
    addMember(req, res, next);
});


export default teamRouter;

