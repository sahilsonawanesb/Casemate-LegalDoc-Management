import express from "express";
import { addActivityNotes, createCase, deleteCase, getAllCases, getCasesByClient, getCasesById, search, updateCaseData } from "../features/case/case.controller.js";
const caseRouter = express.Router();


// router-getAll..
caseRouter.get('/getAllCases', (req, res, next) => {
    getAllCases(req, res, next);
});

// router-Create-Case
caseRouter.post('/create-case', (req, res, next) => {
    createCase(req, res, next);
});

caseRouter.get('/search', (req, res, next) => {
    search(req, res, next);
})

// router-getCaseById
caseRouter.get('/:id', (req, res, next) => {
    getCasesById(req, res, next);
});

// router - updateCase.
caseRouter.put('/:id', (req, res, next) => {
    updateCaseData(req, res, next);
});

// router - getCasesByClientId.
caseRouter.get('/client/:id', (req, res, next) => {
    getCasesByClient(req, res, next);
});
// router - deletCase.
caseRouter.delete('/:id', (req, res, next) => {
    deleteCase(req, res, next);
});

// router - addCaseActivity..
caseRouter.post('/:id/activity', (req, res, next) => {
    addActivityNotes(req, res, next);
});

// router - search cases.







export default caseRouter;