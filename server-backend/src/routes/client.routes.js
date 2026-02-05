import express from 'express';
import { createClient, deleteClient, getAllClients, getClientById, logClientContact, searchClients, updateClient,getClientHistory } from '../features/client/client.controller.js';

// create router object here as follows.
const clientRouter = express.Router();

// getAllClient - Specific
clientRouter.get('/getAllClients', (req, res, next) => {
    getAllClients(req, res, next);
});

// getClientBy - ID
clientRouter.get('/:id', (req, res, next) => {
    getClientById(req, res, next);
});

// createClient - Create
clientRouter.post('/createClient', (req, res, next) => {
    createClient(req, res, next);
});

// updateClient - ID
clientRouter.put('/:id', (req, res, next) => {
    updateClient(req, res, next);
});

// deletClient - Id
clientRouter.delete('/:id', (req, res, next)=> {
    deleteClient(req, res, next);
});

// searchClient - Query
clientRouter.get('/search', (req, res, next) => {
    searchClients(req, res, next);
});


// /logging routes as follows..
clientRouter.post('/:id/contact', (req, res, next) => {
    logClientContact(req, res, next);
});

// consider the following router..
clientRouter.get('/:id/contact-history', (req, res, next) => {
    getClientHistory(req, res, next);
});

export default clientRouter;