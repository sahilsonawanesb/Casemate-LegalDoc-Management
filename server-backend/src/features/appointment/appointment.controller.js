// controller appointmentController..

import AppointmentRepository from "../appointment/appointment.repository.js";
// const { v4: uuidv4 } = require('uuid');
import {v4 as uuidv4 }from "uuid";
import { sendConfirmationEmail, scheduleAppointmentNotifications } from "../../services/appointmentNotificationService.js"
import { generateMeetingLink } from "../../services/mettingLinkService.js"
import ApplicationError from '../../error-handler/ApplicationError.js';


const appointmentRepository = new AppointmentRepository();

    /**
     * Create new appointment with meeting link
     * POST /api/appointments/create
     */
    // export const createAppointment = async(req, res, next) => {
    //     try {
    //         const {
    //             clientName,
    //             clientEmail,
    //             clientPhone,
    //             clientFirebaseToken,
    //             caseId,
    //             caseTitle,
    //             appointmentDate,
    //             appointmentTime,
    //             appointmentType = 'Consultation',
    //             priority = 'Scheduled',
    //             duration = 60,
    //             notes,
    //             meetingType = 'Google Meet'
    //         } = req.body;
            
    //         const attorneyId = req.user.id;
            
    //         // ========== VALIDATION ==========
            
    //         // Check required fields
    //         if(!clientName || !clientEmail || !appointmentDate || !appointmentTime) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Missing required fields: clientName, clientEmail, appointmentDate, appointmentTime'
    //             });
    //         }
            
    //         // Validate email format
    //         const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //         if(!emailRegex.test(clientEmail)) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Invalid email format'
    //             });
    //         }
            
    //         // Validate date format (YYYY-MM-DD)
    //         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    //         if(!dateRegex.test(appointmentDate)) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Date must be in YYYY-MM-DD format'
    //             });
    //         }
            
    //         // Validate time format (HH:MM)
    //         const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    //         if(!timeRegex.test(appointmentTime)) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Time must be in HH:MM format'
    //             });
    //         }
            
    //         // Check if appointment date is in future
    //         const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    //         if(appointmentDateTime < new Date()) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: 'Cannot book appointment in the past'
    //             });
    //         }
            
    //         // ========== CHECK TIME SLOT AVAILABILITY ==========
            
    //         const isAvailable = await appointmentRepository.isTimeSlotAvailable(
    //             attorneyId,
    //             appointmentDate,
    //             appointmentTime
    //         );
            
    //         if(!isAvailable) {
    //             return res.status(409).json({
    //                 success: false,
    //                 message: 'Time slot already booked. Please select another time.'
    //             });
    //         }
            
    //         // ========== GENERATE MEETING LINK ==========
            
    //         let meetingDetails = {};
            
    //         if(meetingType === 'Google Meet') {
    //             meetingDetails = await generateGoogleMeetLink(appointmentDate, appointmentTime);
    //         } else if(meetingType === 'Zoom') {
    //             // TODO: Implement Zoom integration
    //             meetingDetails = {
    //                 meetingType: 'Zoom',
    //                 meetingLink: `https://zoom.us/j/${uuidv4().substring(0, 10)}`
    //             };
    //         }
            
    //         // ========== CREATE APPOINTMENT ==========
            
    //         const appointmentData = {
    //             attorneyId,
    //             clientName: clientName.trim(),
    //             clientEmail: clientEmail.toLowerCase().trim(),
    //             clientPhone: clientPhone?.trim() || undefined,
    //             clientFirebaseToken: clientFirebaseToken || undefined,
    //             caseId: caseId?.trim() || undefined,
    //             caseTitle: caseTitle?.trim() || undefined,
    //             appointmentDate,
    //             appointmentTime,
    //             appointmentType,
    //             priority,
    //             duration,
    //             notes: notes?.trim() || undefined,
    //             meetingDetails,
    //             status: 'Scheduled',
    //             isOnlineMeeting: true
    //         };
            
    //         const appointment = await appointmentRepository.createAppointment(appointmentData);
            
    //         // ========== SEND CONFIRMATION EMAIL ==========
            
    //         const emailSent = await sendConfirmationEmail(appointment);
            
    //         if(!emailSent) {
    //             console.warn(`Confirmation email failed for ${clientEmail}`);
    //         }
            
    //         // ========== SCHEDULE REMINDERS ==========
            
    //         try {
    //             await scheduleAppointmentNotifications(appointment);
    //         } catch(error) {
    //             console.error('Error scheduling reminders:', error);
    //             // Don't fail if scheduling fails, reminders can be manual
    //         }
            
    //         // ========== RESPONSE ==========
            
    //         return res.status(201).json({
    //             success: true,
    //             message: 'Appointment created successfully',
    //             appointment: {
    //                 _id: appointment._id,
    //                 clientName: appointment.clientName,
    //                 clientEmail: appointment.clientEmail,
    //                 appointmentDate: appointment.appointmentDate,
    //                 appointmentTime: appointment.appointmentTime,
    //                 appointmentType: appointment.appointmentType,
    //                 caseTitle: appointment.caseTitle,
    //                 status: appointment.status,
    //                 priority: appointment.priority
    //             },
    //             meetingLink: appointment.meetingDetails?.meetingJoinUrl || null,
    //             notifications: {
    //                 confirmationSent: emailSent,
    //                 remindersScheduled: true
    //             }
    //         });
            
    //     } catch(error) {
    //         console.error('Error creating appointment:', error);
    //         return next(new ApplicationError('Unable to create new appointment', 500));
    //     }
    // }
    
    // ============ GET ALL APPOINTMENTS ============
    

//     export const createAppointment = async(req, res, next) => {
//     try {
//         // ✅ Debug logging
//         console.log('\n' + '='.repeat(60));
//         console.log('📨 RECEIVED REQUEST');
//         console.log('='.repeat(60));
//         console.log('Body:', JSON.stringify(req.body, null, 2));

//         const {
//             clientName,
//             clientEmail,
//             clientPhone,
//             clientFirebaseToken,
//             caseId,
//             caseTitle,
//             appointmentDate,
//             appointmentTime,
//             appointmentType = 'Consultation',
//             priority = 'Scheduled',  // ✅ FIXED: Changed from 'Scheduled' to 'medium'
//             duration = 60,
//             notes,
//             meetingType = 'Google Meet'
//         } = req.body;
        
//         const attorneyId = req.user.id;
//         const attorneyEmail = req.user.email;
        
//         // ✅ Debug: Log destructured values
//         console.log('\n' + '='.repeat(60));
//         console.log('🔍 AFTER DESTRUCTURING');
//         console.log('='.repeat(60));
//         console.log('clientName:', clientName);
//         console.log('clientEmail:', clientEmail);  // ← CRITICAL
//         console.log('priority:', priority);
//         console.log('appointmentDate:', appointmentDate);
//         console.log('appointmentTime:', appointmentTime);
        
//         // ========== VALIDATION ==========
        
//         // Check required fields
//         if(!clientName || !clientEmail || !appointmentDate || !appointmentTime) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: clientName, clientEmail, appointmentDate, appointmentTime'
//             });
//         }
        
//         // Validate email format
//         const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//         if(!emailRegex.test(clientEmail)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid email format'
//             });
//         }
        
//         // Validate date format (YYYY-MM-DD)
//         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//         if(!dateRegex.test(appointmentDate)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Date must be in YYYY-MM-DD format'
//             });
//         }
        
//         // Validate time format (HH:MM)
//         const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
//         if(!timeRegex.test(appointmentTime)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Time must be in HH:MM format'
//             });
//         }
        
//         // Check if appointment date is in future
//         const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00Z`);
//         if(appointmentDateTime < new Date()) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Cannot book appointment in the past'
//             });
//         }
        
//         // ========== CHECK TIME SLOT AVAILABILITY ==========
        
//         console.log('\n⏱️ Checking time slot availability...');
//         const isAvailable = await appointmentRepository.isTimeSlotAvailable(
//             attorneyId,
//             appointmentDate,
//             appointmentTime
//         );
        
//         if(!isAvailable) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Time slot already booked. Please select another time.'
//             });
//         }
        
//         // ========== GENERATE MEETING LINK ==========
        
//         let meetingDetails = {};
        
//         try {
//             console.log('\n🔗 Generating meeting link...');
            
//             if(meetingType === 'Google Meet') {
//                 // Prepare data for Google Meet service
//                 const appointmentDataForMeeting = {
//                     clientName,
//                     clientEmail,
//                     caseTitle,
//                     appointmentDate,
//                     appointmentTime,
//                     duration,
//                     attorneyEmail,  // ✅ CRITICAL FOR GOOGLE API
//                     description: notes || ''
//                 };
                
//                 meetingDetails = await generateGoogleMeetLink(appointmentDataForMeeting);
//                 console.log('✅ Meeting link generated:', meetingDetails.meetingJoinUrl);
                
//             } else if(meetingType === 'Zoom') {
//                 // Placeholder - TODO: Implement Zoom integration
//                 const zoomId = Math.floor(100000000 + Math.random() * 900000000).toString();
//                 const zoomPassword = Math.random().toString(36).substring(2, 8).toUpperCase();
//                 const zoomLink = `https://zoom.us/wc/join/${zoomId}?pwd=${zoomPassword}`;
                
//                 meetingDetails = {
//                     meetingType: 'Zoom',
//                     meetingId: zoomId,
//                     meetingPassword: zoomPassword,
//                     meetingJoinUrl: zoomLink,
//                     meetingLink: zoomLink,
//                     meetingStartUrl: zoomLink
//                 };
//                 console.log('✅ Zoom meeting link generated');
                
//             } else {
//                 // Default to Google Meet
//                 const appointmentDataForMeeting = {
//                     clientName,
//                     clientEmail,
//                     caseTitle,
//                     appointmentDate,
//                     appointmentTime,
//                     duration,
//                     attorneyEmail,
//                     description: notes || ''
//                 };
//                 meetingDetails = await generateGoogleMeetLink(appointmentDataForMeeting);
//                 console.log('✅ Meeting link generated (default to Google Meet)');
//             }
            
//         } catch(error) {
//             console.error('❌ Error generating meeting link:', error.message);
//             console.warn('⚠️ Continuing without meeting link...');
//             meetingDetails = {
//                 meetingType: meetingType || 'Google Meet',
//                 meetingJoinUrl: null,
//                 error: error.message
//             };
//         }
        
//         // ========== CREATE APPOINTMENT DATA ==========
        
//         console.log('\n📝 Creating appointment data...');
        
//         const appointmentData = {
//             attorneyId,
//             clientName: clientName.trim(),
//             clientEmail: clientEmail.toLowerCase().trim(),  // ✅ ENSURE THIS IS SAVED
//             clientPhone: clientPhone?.trim() || undefined,
//             clientFirebaseToken: clientFirebaseToken || undefined,
//             caseId: caseId?.trim() || undefined,
//             caseTitle: caseTitle?.trim() || undefined,
//             appointmentDate,
//             appointmentTime,
//             appointmentType,
//             priority,  // ✅ NOW CORRECTLY SET TO 'medium' or other valid value
//             duration,
//             notes: notes?.trim() || undefined,
//             meetingDetails,
//             status: 'Scheduled',
//             isOnlineMeeting: true
//         };
        
//         // ✅ Debug: Log appointment data before save
//         console.log('\n✅ APPOINTMENT DATA OBJECT:');
//         console.log(JSON.stringify(appointmentData, null, 2));
//         console.log('Has clientEmail?', !!appointmentData.clientEmail);
//         console.log('clientEmail value:', appointmentData.clientEmail);
        
//         // ========== SAVE APPOINTMENT TO DATABASE ==========
        
//         console.log('\n💾 Saving appointment to database...');
//         const appointment = await appointmentRepository.createAppointment(appointmentData);
        
//         // ✅ Debug: Log what was saved
//         console.log('\n💾 AFTER DATABASE SAVE:');
//         console.log('_id:', appointment._id);
//         console.log('clientName:', appointment.clientName);
//         console.log('clientEmail:', appointment.clientEmail);  // ← VERIFY THIS
//         console.log('priority:', appointment.priority);
        
//         if(!appointment.clientEmail) {
//             console.error('❌ WARNING: clientEmail is undefined after save!');
//             console.error('   Appointment object keys:', Object.keys(appointment));
//         }
        
//         // ========== SEND CONFIRMATION EMAIL ==========
        
//         console.log('\n📧 Sending confirmation email...');
//         let emailSent = false;
        
//         try {
//             emailSent = await sendConfirmationEmail(appointment);
            
//             if(emailSent) {
//                 console.log(`✅ Confirmation email sent to ${appointment.clientEmail}`);
//             } else {
//                 console.warn(`⚠️ Confirmation email failed for ${appointment.clientEmail}`);
//             }
//         } catch(error) {
//             console.error('❌ Error sending email:', error.message);
//             emailSent = false;
//         }
        
//         // ========== SCHEDULE REMINDERS ==========
        
//         console.log('\n📅 Scheduling reminders...');
//         let remindersScheduled = false;
        
//         try {
//             remindersScheduled = await scheduleAppointmentNotifications(appointment);
            
//             if(remindersScheduled) {
//                 console.log('✅ Reminders scheduled successfully');
//             }
//         } catch(error) {
//             console.error('⚠️ Error scheduling reminders:', error.message);
//             remindersScheduled = false;
//         }
        
//         // ========== RETURN RESPONSE ==========
        
//         console.log('\n' + '='.repeat(60));
//         console.log('✅ APPOINTMENT CREATED SUCCESSFULLY');
//         console.log('='.repeat(60));
        
//         return res.status(201).json({
//             success: true,
//             message: 'Appointment created successfully',
//             appointment: {
//                 _id: appointment._id,
//                 clientName: appointment.clientName,
//                 clientEmail: appointment.clientEmail,  // ✅ VERIFY IN RESPONSE
//                 appointmentDate: appointment.appointmentDate,
//                 appointmentTime: appointment.appointmentTime,
//                 appointmentType: appointment.appointmentType,
//                 caseTitle: appointment.caseTitle,
//                 status: appointment.status,
//                 priority: appointment.priority
//             },
//             meetingLink: appointment.meetingDetails?.meetingJoinUrl || null,
//             calendarLink: appointment.meetingDetails?.htmlLink || null,
//             notifications: {
//                 confirmationSent: emailSent,
//                 remindersScheduled: remindersScheduled
//             }
//         });
        
//     } catch(error) {
//         console.error('\n❌ ERROR IN createAppointment:');
//         console.error('Message:', error.message);
//         console.error('Stack:', error.stack);
//         return res.status(500).json({
//             success: false,
//             message: 'Unable to create new appointment',
//             error: error.message
//         });
//     }
// };

export const createAppointment = async(req, res, next) => {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('RECEIVED REQUEST');
        console.log('='.repeat(60));
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const {
            clientName,
            clientEmail,
            clientPhone,
            clientFirebaseToken,
            caseId,
            caseTitle,
            appointmentDate,
            appointmentTime,
            appointmentType = 'Consultation',
            priority = 'Scheduled',  
            duration = 60,
            notes,
            meetingType = 'Google Meet'
        } = req.body;
        
        const attorneyId = req.user.id;
        const attorneyEmail = req.user.email;  
        
        console.log('\n' + '='.repeat(60));
        console.log('AFTER DESTRUCTURING');
        console.log('='.repeat(60));
        console.log('clientName:', clientName);
        console.log('clientEmail:', clientEmail);
        console.log('priority:', priority);  
        console.log('attorneyEmail:', attorneyEmail);
        console.log('appointmentDate:', appointmentDate);
        console.log('appointmentTime:', appointmentTime);
        
        // ========== VALIDATION ==========
        
        // Check required fields
        if(!clientName || !clientEmail || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: clientName, clientEmail, appointmentDate, appointmentTime'
            });
        }
        
        // Validate email format
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailRegex.test(clientEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateRegex.test(appointmentDate)) {
            return res.status(400).json({
                success: false,
                message: 'Date must be in YYYY-MM-DD format'
            });
        }
        
        // Validate time format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if(!timeRegex.test(appointmentTime)) {
            return res.status(400).json({
                success: false,
                message: 'Time must be in HH:MM format'
            });
        }
        
        // Check if appointment date is in future
        const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00Z`);
        if(appointmentDateTime < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book appointment in the past'
            });
        }
        
        // ========== CHECK TIME SLOT AVAILABILITY ==========
        
        console.log('\n Checking time slot availability...');
        const isAvailable = await appointmentRepository.isTimeSlotAvailable(
            attorneyId,
            appointmentDate,
            appointmentTime
        );
        
        if(!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'Time slot already booked. Please select another time.'
            });
        }
        
        // ========== GENERATE MEETING LINK ==========
        // ✅ FIX #2: Completely corrected meeting link generation
        
        let meetingDetails = {};
        
        try {
            console.log('\n🔗 Generating meeting link...');
            
            if(meetingType === 'Google Meet') {
                // ✅ Create proper data object for Google Meet service
                const appointmentDataForMeeting = {
                    clientName,
                    clientEmail,
                    caseTitle,
                    appointmentDate,      // ✅ String: "2026-02-10"
                    appointmentTime,      // ✅ String: "14:00"
                    duration,
                    attorneyEmail,        // ✅ Critical for Google API
                    description: notes || ''
                };
                
                console.log('📤 Data for Google Meet service:');
                console.log('   appointmentDate type:', typeof appointmentDataForMeeting.appointmentDate);
                console.log('   appointmentDate value:', appointmentDataForMeeting.appointmentDate);
                console.log('   attorneyEmail:', appointmentDataForMeeting.attorneyEmail);
                
                // ✅ FIX #2: Call generateMeetingLink with object parameter
                meetingDetails = await generateMeetingLink('Google Meet', appointmentDataForMeeting);
                
                console.log('✅ Meeting link generated:', meetingDetails.meetingJoinUrl);
                
            } else if(meetingType === 'Zoom') {
                console.log('⚠️ Zoom not yet implemented');
                meetingDetails = {
                    meetingType: 'Zoom',
                    meetingJoinUrl: null,
                    error: 'Zoom integration coming soon'
                };
            } else {
                // Default to Google Meet
                const appointmentDataForMeeting = {
                    clientName,
                    clientEmail,
                    caseTitle,
                    appointmentDate,
                    appointmentTime,
                    duration,
                    attorneyEmail,
                    description: notes || ''
                };
                
                meetingDetails = await generateMeetingLink('Google Meet', appointmentDataForMeeting);
            }
            
        } catch(error) {
            console.error('❌ Error generating meeting link:', error.message);
            console.warn('⚠️ Continuing without meeting link...');
            meetingDetails = {
                meetingType: meetingType || 'Google Meet',
                meetingJoinUrl: null,
                error: error.message
            };
        }
        
        // ========== CREATE APPOINTMENT DATA ==========
        
        console.log('\n📝 Creating appointment data...');
        
        const appointmentData = {
            attorneyId,
            clientName: clientName.trim(),
            clientEmail: clientEmail.toLowerCase().trim(),  // ✅ Ensure correct
            clientPhone: clientPhone?.trim() || undefined,
            clientFirebaseToken: clientFirebaseToken || undefined,
            caseId: caseId?.trim() || undefined,
            caseTitle: caseTitle?.trim() || undefined,
            appointmentDate,
            appointmentTime,
            appointmentType,
            priority,  // ✅ Now 'medium' (valid enum)
            duration,
            notes: notes?.trim() || undefined,
            meetingDetails,
            status: 'Scheduled',
            isOnlineMeeting: true
        };
        
        console.log('\n✅ APPOINTMENT DATA OBJECT:');
        console.log(JSON.stringify(appointmentData, null, 2));
        console.log('\nHas clientEmail?', !!appointmentData.clientEmail);
        console.log('clientEmail value:', appointmentData.clientEmail);
        console.log('priority value:', appointmentData.priority);  // ✅ Should be 'medium'
        console.log('meetingJoinUrl:', appointmentData.meetingDetails?.meetingJoinUrl);
        
        // ========== SAVE APPOINTMENT TO DATABASE ==========
        
        console.log('\n💾 Saving appointment to database...');
        const appointment = await appointmentRepository.createAppointment(appointmentData);
        
        console.log('\n💾 AFTER DATABASE SAVE:');
        console.log('_id:', appointment._id);
        console.log('clientName:', appointment.clientName);
        console.log('clientEmail:', appointment.clientEmail);  // ✅ Should exist
        console.log('priority:', appointment.priority);  // ✅ Should be 'medium'
        
        if(!appointment.clientEmail) {
            console.error('❌ WARNING: clientEmail is undefined after save!');
            console.error('   Check if model validation failed');
            console.error('   Check priority value is valid');
        }
        
        // ========== SEND CONFIRMATION EMAIL ==========
        
        console.log('\n📧 Sending confirmation email...');
        let emailSent = false;
        
        try {
            emailSent = await sendConfirmationEmail(appointment);
            
            if(emailSent) {
                console.log(`✅ Confirmation email sent to ${appointment.clientEmail}`);
            } else {
                console.warn(`⚠️ Confirmation email failed for ${appointment.clientEmail}`);
            }
        } catch(error) {
            console.error('❌ Error sending email:', error.message);
            emailSent = false;
        }
        
        // ========== SCHEDULE REMINDERS ==========
        
        console.log('\n📅 Scheduling reminders...');
        let remindersScheduled = false;
        
        try {
            remindersScheduled = await scheduleAppointmentNotifications(appointment);
            
            if(remindersScheduled) {
                console.log('✅ Reminders scheduled successfully');
            }
        } catch(error) {
            console.error('⚠️ Error scheduling reminders:', error.message);
            remindersScheduled = false;
        }
        
        // ========== RETURN RESPONSE ==========
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ APPOINTMENT CREATED SUCCESSFULLY');
        console.log('='.repeat(60));
        
        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment: {
                _id: appointment._id,
                clientName: appointment.clientName,
                clientEmail: appointment.clientEmail,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                appointmentType: appointment.appointmentType,
                caseTitle: appointment.caseTitle,
                status: appointment.status,
                priority: appointment.priority
            },
            meetingLink: appointment.meetingDetails?.meetingJoinUrl || null,  // ✅ REAL LINK
            calendarLink: appointment.meetingDetails?.htmlLink || null,
            notifications: {
                confirmationSent: emailSent,
                remindersScheduled: remindersScheduled
            }
        });
        
    } catch(error) {
        console.error('\n❌ ERROR IN createAppointment:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: 'Unable to create new appointment',
            error: error.message
        });
    }
};

    /**
     * Get all appointments with filters
     * GET /api/appointments
     */
    export const getAllAppointments = async(req, res, next) => {
        try {
            const attorneyId = req.user.id;
            const { status, date, priority, appointmentType } = req.query;
            
            const filters = {
                status,
                date,
                priority,
                appointmentType
            };
            
            const appointments = await appointmentRepository.getAllAppointments(attorneyId, filters);
            
            return res.status(200).json({
                success: true,
                data: appointments,
                count: appointments.length
            });
            
        } catch(error) {
            console.error('Error fetching appointments:', error);
            return next(new ApplicationError('Unable to get all appointments', 500));
        }
    }
    
    // ============ GET TODAY APPOINTMENTS ============
    
    /**
     * Get today's appointments
     * GET /api/appointments/today
     */
    export const getTodayAppointments = async(req, res, next) => {
        try {
            const attorneyId = req.user.id;
            
            const appointments = await appointmentRepository.getTodayAppointments(attorneyId);
            
            return res.status(200).json({
                success: true,
                data: appointments,
                count: appointments.length
            });
            
        } catch(error) {
            console.error('Error fetching today appointments:', error);
            return next(new ApplicationError('Unable to fetch todays appointments', 500));
        }
    }
    
    // ============ GET UPCOMING APPOINTMENTS ============
    
    /**
     * Get upcoming appointments (next 7 days)
     * GET /api/appointments/upcoming
     */
    export const getUpcomingAppointments = async(req, res, next) => {
        try {
            const attorneyId = req.user.id;
            const { days = 7 } = req.query;
            
            const appointments = await appointmentRepository.getUpcomingAppointments(attorneyId, days);
            
            return res.status(200).json({
                success: true,
                data: appointments,
                count: appointments.length
            });
            
        } catch(error) {
            console.error('Error fetching upcoming appointments:', error);
            next(new ApplicationError('Unable to get upcoming appointments', 500));
        }
    }
    
    // ============ GET SINGLE APPOINTMENT ============
    
    /**
     * Get appointment by ID
     * GET /api/appointments/:id
     */
    export const getAppointmentById = async(req, res, next) => {
        try {
            const id  = req.params.id;
            const attorneyId = req.user.id;
            
            const appointment = await appointmentRepository.getAppointmentById(id, attorneyId);
            
            return res.status(200).json({
                success: true,
                appointment
            });
            
        } catch(error) {
            if(error.message === 'Appointment not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            console.error('Error fetching appointment:', error);
            next(new ApplicationError('Unable to get appointment by id', 500));
        }
    }
    
    // ============ UPDATE APPOINTMENT ============
    
    /**
     * Update appointment details
     * PUT /api/appointments/:id
     */
    export const updateAppointment = async(req, res, next) =>  {
        try {
            const { id } = req.params;
            const attorneyId = req.user.id;
            
            const updateData = req.body;
            
            // Prevent status update through this endpoint
            if(updateData.status) {
                delete updateData.status;
            }
            
            const appointment = await appointmentRepository.updateAppointment(id, attorneyId, updateData);
            
            return res.status(200).json({
                success: true,
                message: 'Appointment updated successfully',
                appointment
            });
            
        } catch(error) {
            if(error.message === 'Appointment not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            console.error('Error updating appointment:', error);
            next(new ApplicationError('Unable to update appointment', 500));
        }
    }
    
    // ============ UPDATE APPOINTMENT STATUS ============
    
    /**
     * Update appointment status (Scheduled, Completed, Cancelled)
     * PATCH /api/appointments/:id/status
     */
    export const updateAppointmentStatus = async(req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const attorneyId = req.user.id;
            
            // Validate status
            const validStatuses = ['Scheduled', 'Completed', 'Cancelled', 'No-show', 'Rescheduled'];
            if(!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }
            
            const appointment = await appointmentRepository.updateStatus(id, attorneyId, status);
            
            return res.status(200).json({
                success: true,
                message: `Appointment marked as ${status}`,
                appointment
            });
            
        } catch(error) {
            if(error.message === 'Appointment not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            console.error('Error updating status:', error);
            next(new ApplicationError('Unable to update appointment status', 500));
        }
    }
    
    // ============ CANCEL APPOINTMENT ============
    
    /**
     * Cancel appointment
     * DELETE /api/appointments/:id
     */
    export const cancelAppointment = async(req, res, next)=>{
        try {
            const { id } = req.params;
            const attorneyId = req.user.id;
            
            const appointment = await appointmentRepository.cancelAppointment(id, attorneyId);
            
            // TODO: Send cancellation email to client
            
            return res.status(200).json({
                success: true,
                message: 'Appointment cancelled successfully',
                appointment
            });
            
        } catch(error) {
            if(error.message === 'Appointment not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }
            console.error('Error cancelling appointment:', error);
            next(new ApplicationError('Unable to cancel appointment', 500));
        }
    }
    
    // ============ GET APPOINTMENT STATISTICS ============
    
    /**
     * Get appointment statistics
     * GET /api/appointments/stats
     */
    export const getAppointmentStats = async(req, res, next) => {
        try {
            const attorneyId = req.user.id;
            
            const stats = await appointmentRepository.getAppointmentStats(attorneyId);
            
            return res.status(200).json({
                success: true,
                stats: {
                    totalAppointments: stats.total[0]?.count || 0,
                    byStatus: stats.byStatus,
                    byPriority: stats.byPriority,
                    todayCount: stats.todayCount[0]?.count || 0,
                    completedCount: stats.completedCount[0]?.count || 0
                }
            });
            
        } catch(error) {
            console.error('Error fetching stats:', error);
            next(new ApplicationError('Unable to get appointment stats', 500));
        }
    }
    
    // ============ RESCHEDULE APPOINTMENT ============
    
    /**
     * Reschedule appointment to new date/time
     * POST /api/appointments/:id/reschedule
     */
    export const rescheduleAppointment = async(req, res, next) => {
        try {
            const { id } = req.params;
            const { appointmentDate, appointmentTime } = req.body;
            const attorneyId = req.user.id;
            
            // Validation
            if(!appointmentDate || !appointmentTime) {
                return res.status(400).json({
                    success: false,
                    message: 'New appointment date and time are required'
                });
            }
            
            // Check availability
            const isAvailable = await appointmentRepository.isTimeSlotAvailable(
                attorneyId,
                appointmentDate,
                appointmentTime
            );
            
            if(!isAvailable) {
                return res.status(409).json({
                    success: false,
                    message: 'New time slot is not available'
                });
            }
            
            const appointment = await appointmentRepository.updateAppointment(
                id,
                attorneyId,
                { appointmentDate, appointmentTime, status: 'Rescheduled' }
            );
            
            // TODO: Send reschedule notification email
            
            return res.status(200).json({
                success: true,
                message: 'Appointment rescheduled successfully',
                appointment
            });
            
        } catch(error) {
            console.error('Error rescheduling appointment:', error);
            next(new ApplicationError('Unable to Reschdule appointment', 500));
        }
    }


