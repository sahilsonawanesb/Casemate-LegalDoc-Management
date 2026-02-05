import express from "express";
import { cancelAppointment, createAppointment, getAllAppointments, getAppointmentById, getAppointmentStats, getTodayAppointments, getUpcomingAppointments, rescheduleAppointment, updateAppointment, updateAppointmentStatus } from "../features/appointment/appointment.controller.js";


const appointmentRouter = express.Router();


// get all appointments with optional filters..
appointmentRouter.get('/getAll', (req, res, next) => {
    getAllAppointments(req, res, next);
});

// get todays appointments..
appointmentRouter.get('/today', (req, res, next) => {
    getTodayAppointments(req, res, next);
});

// get upcoming appointments
appointmentRouter.get('/upcoming', (req, res, next) => {
    getUpcomingAppointments(req, res, next);
});

// get stats..
appointmentRouter.get('/stats', (req, res, next) => {
    getAppointmentStats(req, res, next);
});

// get appointments by id.
appointmentRouter.get('/:id', (req, res, next) => {
    getAppointmentById(req, res, next);
});


// create appointment..
appointmentRouter.post('/create', (req, res, next) => {
    createAppointment(req, res, next);
});

// update appointments.
appointmentRouter.put('/:id/update', (req, res, next) => {
    updateAppointment(req, res, next);
});

// update appointment status.
appointmentRouter.patch('/:id/status', (req, res, next) => {
    updateAppointmentStatus(req, res, next);
});

// reschdule appointments..
appointmentRouter.post('/:id/reschedule', (req, res, next) => {
    rescheduleAppointment(req, res, next);
});

// Delete appointments..
appointmentRouter.delete('/:id', (req, res, next) => {
    cancelAppointment(req, res, next);
});

export default appointmentRouter;

