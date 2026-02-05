// FILE: repositories/appointmentRepository.js
// Repository layer for database operations

import mongoose from "mongoose";
import appointmentModel from "./appointment.model.js";

export default class AppointmentRepository {
    
    // Create
    async createAppointment(appointmentData) {
        try {
            const appointment = new appointmentModel(appointmentData);
            return await appointment.save();
        } catch(error) {
            throw new Error(`Error creating appointment: ${error.message}`);
        }
    }
    
    // READ 
    
    
    async getAllAppointments(attorneyId, filters = {}) {
        try {
            let query = { attorneyId };
            
            // Add filters
            if(filters.status && filters.status !== 'all') {
                query.status = filters.status;
            }
            
            if(filters.date) {
                query.appointmentDate = filters.date;
            }
            
            if(filters.priority) {
                query.priority = filters.priority;
            }
            
            if(filters.appointmentType) {
                query.appointmentType = filters.appointmentType;
            }
            
            const appointments = await appointmentModel.find(query)
                .select('-__v')
                .sort({ appointmentDate: -1, appointmentTime: -1 });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching appointments: ${error.message}`);
        }
    }
    
    /**
     * Get today's appointment
     */
    async getTodayAppointments(attorneyId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const appointments = await appointmentModel.find({
                attorneyId,
                appointmentDate: today,
                status: { $ne: 'Cancelled' }
            })
            .select('-__v')
            .sort({ appointmentTime: 1 });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching today appointments: ${error.message}`);
        }
    }
    
    /**
     * Get upcoming appointments (next 7 days)
     */
    async getUpcomingAppointments(attorneyId, days = 7) {
        try {
            const today = new Date();
            const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
            
            const todayStr = today.toISOString().split('T')[0];
            const futureDateStr = futureDate.toISOString().split('T')[0];
            
            const appointments = await appointmentModel.find({
                attorneyId,
                appointmentDate: { $gte: todayStr, $lte: futureDateStr },
                status: { $ne: 'Cancelled' }
            })
            .select('-__v')
            .sort({ appointmentDate: 1, appointmentTime: 1 });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching upcoming appointments: ${error.message}`);
        }
    }
    
    /**
     * Get single appointment by ID
     */
    async getAppointmentById(appointmentId, attorneyId) {
        try {
            if(!mongoose.Types.ObjectId.isValid(appointmentId)){
                throw new Error("Invalid appointment");
            }

            if(!mongoose.Types.ObjectId.isValid(attorneyId)){
                throw new Error("Invalid Attorney");
            }


            const appointment = await appointmentModel.findOne({
                _id: new mongoose.Types.ObjectId(appointmentId),
                attorneyId : new mongoose.Types.ObjectId(attorneyId)
            }).select('-__v');
            
            if(!appointment) {
                throw new Error('Appointment not found');
            }
            
            return appointment;
        } catch(error) {
            throw new Error(`Error fetching appointment: ${error.message}`);
        }
    }
    
    /**
     * Get appointments by client email
     */
    async getAppointmentsByClientEmail(clientEmail, attorneyId) {
        try {
            const appointments = await appointmentModel.find({
                clientEmail: clientEmail.toLowerCase(),
                attorneyId
            })
            .select('-__v')
            .sort({ appointmentDate: -1 });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching client appointments: ${error.message}`);
        }
    }
    
    /**
     * Check if time slot is available
     */
    async isTimeSlotAvailable(attorneyId, appointmentDate, appointmentTime) {
        try {
            const existing = await appointmentModel.findOne({
                attorneyId,
                appointmentDate,
                appointmentTime,
                status: { $ne: 'Cancelled' }
            });
            
            return !existing;  // Return true if no conflict
        } catch(error) {
            throw new Error(`Error checking availability: ${error.message}`);
        }
    }
    
    /**
     * Get appointments that need reminders
     */
    async getAppointmentsNeedingReminder(minutesBefore = 15) {
        try {
            const now = new Date();
            const reminderTime = new Date(now.getTime() + minutesBefore * 60000);
            
            const todayStr = reminderTime.toISOString().split('T')[0];
            const timeStr = reminderTime.toTimeString().slice(0, 5);
            
            const appointments = await appointmentModel.find({
                appointmentDate: todayStr,
                appointmentTime: timeStr,
                status: 'Scheduled',
                'notifications.fifteenMinBeforeEmail.sent': false
            });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching appointments for reminder: ${error.message}`);
        }
    }
    
    /**
     * Get appointments needing day-before reminder
     */
    async getAppointmentsNeedingDayBeforeReminder() {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            const appointments = await appointmentModel.find({
                appointmentDate: tomorrowStr,
                status: 'Scheduled',
                'notifications.dayBeforeEmail.sent': false
            });
            
            return appointments;
        } catch(error) {
            throw new Error(`Error fetching appointments for day-before reminder: ${error.message}`);
        }
    }
    
    // ============ UPDATE ============
    
    /**
     * Update appointment
     */
    async updateAppointment(appointmentId, attorneyId, updateData) {
        try {
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId, attorneyId },
                { 
                    ...updateData,
                    updatedAt: new Date()
                },
                { new: true, runValidators: true }
            ).select('-__v');
            
            if(!appointment) {
                throw new Error('Appointment not found');
            }
            
            return appointment;
        } catch(error) {
            throw new Error(`Error updating appointment: ${error.message}`);
        }
    }
    
    /**
     * Update appointment status
     */
    async updateStatus(appointmentId, attorneyId, status) {
        try {
            const updateData = { status };
            
            if(status === 'Completed') {
                updateData.completedAt = new Date();
            }
            
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId, attorneyId },
                updateData,
                { new: true, runValidators: true }
            ).select('-__v');
            
            if(!appointment) {
                throw new Error('Appointment not found');
            }
            
            return appointment;
        } catch(error) {
            throw new Error(`Error updating status: ${error.message}`);
        }
    }
    
    /**
     * Update notification status
     */
    async updateNotificationStatus(appointmentId, notificationType, sent = true, failureReason = null) {
        try {
            const updateData = {
                [`notifications.${notificationType}.sent`]: sent,
                [`notifications.${notificationType}.sentAt`]: new Date()
            };
            
            if(failureReason) {
                updateData[`notifications.${notificationType}.failureReason`] = failureReason;
            }
            
            const appointment = await appointmentModel.findByIdAndUpdate(
                appointmentId,
                updateData,
                { new: true }
            );
            
            return appointment;
        } catch(error) {
            throw new Error(`Error updating notification status: ${error.message}`);
        }
    }
    
    /**
     * Update meeting details
     */
    async updateMeetingDetails(appointmentId, attorneyId, meetingDetails) {
        try {
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId, attorneyId },
                { meetingDetails },
                { new: true }
            ).select('-__v');
            
            if(!appointment) {
                throw new Error('Appointment not found');
            }
            
            return appointment;
        } catch(error) {
            throw new Error(`Error updating meeting details: ${error.message}`);
        }
    }
    
    // ============ DELETE ============
    
    /**
     * Cancel appointment (soft delete)
     */
    async cancelAppointment(appointmentId, attorneyId) {
        try {
            const appointment = await appointmentModel.findOneAndUpdate(
                { _id: appointmentId, attorneyId },
                { 
                    status: 'Cancelled',
                    updatedAt: new Date()
                },
                { new: true }
            ).select('-__v');
            
            if(!appointment) {
                throw new Error('Appointment not found');
            }
            
            return appointment;
        } catch(error) {
            throw new Error(`Error cancelling appointment: ${error.message}`);
        }
    }
    
    /**
     * Delete appointment (hard delete)
     */
    async deleteAppointment(appointmentId, attorneyId) {
        try {
            const result = await appointmentModel.findOneAndDelete({
                _id: appointmentId,
                attorneyId
            });
            
            if(!result) {
                throw new Error('Appointment not found');
            }
            
            return result;
        } catch(error) {
            throw new Error(`Error deleting appointment: ${error.message}`);
        }
    }
    
    // ============ STATISTICS ============
    
    /**
     * Get appointment statistics
     * @param {String} attorneyId - Attorney's ID
     * @returns {Promise<Object>} - Statistics
     */
    async getAppointmentStats(attorneyId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            
            const stats = await appointmentModel.aggregate([
                { $match: { attorneyId: new moongoose.Types.ObjectId(attorneyId) } },
                {
                    $facet: {
                        total: [{ $count: 'count' }],
                        byStatus: [
                            { $group: { _id: '$status', count: { $sum: 1 } } }
                        ],
                        byPriority: [
                            { $group: { _id: '$priority', count: { $sum: 1 } } }
                        ],
                        todayCount: [
                            { $match: { appointmentDate: today } },
                            { $count: 'count' }
                        ],
                        completedCount: [
                            { $match: { status: 'Completed' } },
                            { $count: 'count' }
                        ]
                    }
                }
            ]);
            
            return stats[0];
        } catch(error) {
            throw new Error(`Error getting stats: ${error.message}`);
        }
    }
}

