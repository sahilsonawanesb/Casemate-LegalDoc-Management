import express from "express";
import { addReply, createTicket, getMyTickets, getTicketById, getTicketsStats, markResolved, searchTickets, updateTicketStatus } from "../features/supportTicket/supportTicket.controller.js";
import { checkRole } from "../middleware/checkRole.middleware.js";


const ticketRouter = express.Router();

// check Role.
ticketRouter.use(checkRole('Assistant'));


// getMyTickets.
ticketRouter.get('/', (req, res, next) => {
    getMyTickets(req, res, next);
});

// search Tickets..
ticketRouter.get('/search', (req, res, next) => {
    searchTickets(req, res, next);
});

// Tickets stats.
ticketRouter.get('/stats', (req, res, next) => {
    getTicketsStats(req, res, next);
});

// Ticket by Id..
ticketRouter.get('/:id', (req, res, next) => {
    getTicketById(req, res, next);
});

// create Ticket.
ticketRouter.post('/', (req, res, next) => {
    createTicket(req,res,next);
});

// add Reply.
ticketRouter.post('/:id/reply', (req, res, next) => {
    addReply(req, res, next);
});

// resolved Tickets..
ticketRouter.post('/:id/resolve', (req, res, next) => {
    markResolved(res, res, next);
});

// update Ticket status..
ticketRouter.post('/:id', (req, res, next) => {
    updateTicketStatus(req, res, next);
});



export default ticketRouter;