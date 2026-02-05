// FILE: services/appointmentNotificationService.js
// FIXED - Email and notification sending service

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Appointment from "../../src/features/appointment/appointment.model.js";

dotenv.config();

/* ================= EMAIL TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter
transporter.verify((error) => {
    if (error) {
        console.error("Email transporter error:", error.message);
    } else {
        console.log("Email transporter ready");
    }
});

/* ================= HELPERS ================= */

/**
 * FIXED: Get recipient email from appointment
 * Checks multiple possible locations for email
 */
const getRecipientEmail = (appointment) => {
    // Try different email field locations
    const email = 
        appointment?.clientEmail ||           // Primary location
        appointment?.email ||                 // Backup location
        appointment?.client?.email ||         // If client is nested object
        null;

    if (!email) {
        console.warn('Warning: No email found in appointment:', {
            hasClientEmail: !!appointment?.clientEmail,
            hasEmail: !!appointment?.email,
            hasNestedEmail: !!appointment?.client?.email,
            appointmentKeys: Object.keys(appointment || {})
        });
    }

    return email;
};

/**
 * Get meeting join URL from appointment
 */
const getMeetingJoinUrl = (appointment) => {
    return (
        appointment?.meetingDetails?.meetingJoinUrl ||
        appointment?.meetingDetails?.meetingLink ||
        appointment?.meetingLink ||
        "#"
    );
};

/**
 * Format appointment date for email
 */
const formatAppointmentDate = (dateStr) => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            // If dateStr is already a date string (YYYY-MM-DD), parse it properly
            const [year, month, day] = dateStr.split('T')[0].split('-');
            const parsedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
            return parsedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    } catch (error) {
        console.warn("Error formatting date:", dateStr);
        return dateStr;
    }
};

/**
 * Get client name safely
 */
const getClientName = (appointment) => {
    return appointment?.clientName || "Valued Client";
};

/* ================= EMAIL TEMPLATES ================= */

/**
 * Confirmation email - sent immediately after booking
 */
const confirmationEmailTemplate = (appointment) => {
    const recipientEmail = getRecipientEmail(appointment);
    
    // ✅ FIXED: Better error handling
    if (!recipientEmail) {
        console.error('ERROR: Cannot send confirmation email - no recipient email found!');
        console.error('   Appointment data:', {
            _id: appointment?._id,
            clientName: appointment?.clientName,
            clientEmail: appointment?.clientEmail,
            email: appointment?.email,
            availableFields: Object.keys(appointment || {})
        });
        throw new Error("Recipient email is missing in appointment record");
    }

    const meetingUrl = getMeetingJoinUrl(appointment);
    const clientName = getClientName(appointment);
    const appointmentDate = formatAppointmentDate(appointment.appointmentDate);

    return {
        from: `"CaseMate Legal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Appointment Confirmed - ${appointment.caseTitle || "Consultation"}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #27ae60; color: white; padding: 20px; border-radius: 5px; }
                    .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .details { background: white; padding: 15px; border-left: 4px solid #27ae60; }
                    .details p { margin: 10px 0; }
                    .button { display: inline-block; background: #27ae60; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .meeting-link { background: #ecf0f1; padding: 10px; border-radius: 3px; word-break: break-all; font-size: 12px; }
                    .footer { text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Appointment Confirmed</h2>
                    </div>

                    <div class="content">
                        <p>Dear <strong>${clientName}</strong>,</p>
                        <p>Your appointment has been successfully scheduled with CaseMate Legal.</p>

                        <div class="details">
                            <h3>Appointment Details:</h3>
                            <p><strong>Date:</strong> ${appointmentDate}</p>
                            <p><strong>Time:</strong> ${appointment.appointmentTime || 'N/A'}</p>
                            <p><strong>Type:</strong> ${appointment.appointmentType || 'Consultation'}</p>
                            ${appointment.caseTitle ? `<p><strong>⚖️ Case:</strong> ${appointment.caseTitle}</p>` : ''}
                            ${appointment.duration ? `<p><strong>⏱️ Duration:</strong> ${appointment.duration} minutes</p>` : ''}
                        </div>

                        ${meetingUrl && meetingUrl !== '#' ? `
                            <h3>Online Meeting</h3>
                            <p>This is an online appointment. Join using the link below:</p>
                            <a href="${meetingUrl}" class="button">Join Meeting Now</a>
                            <p>Or copy this link:</p>
                            <div class="meeting-link">${meetingUrl}</div>
                        ` : `
                            <p>Meeting details will be provided shortly.</p>
                        `}

                        <h3>What to Expect</h3>
                        <ul>
                            <li>Reminder email 24 hours before the appointment</li>
                            <li>Reminder notification 15 minutes before</li>
                            <li>Meeting link will be active at appointment time</li>
                        </ul>

                        <h3>Need to Reschedule?</h3>
                        <p>Contact us at least 24 hours before your appointment if you need to reschedule.</p>
                    </div>

                    <div class="footer">
                        <p>CaseMate Legal Management System</p>
                        <p>${new Date().getFullYear()} All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
};

/**
 * Day-before reminder email
 */
const dayBeforeEmailTemplate = (appointment) => {
    const recipientEmail = getRecipientEmail(appointment);
    
    if (!recipientEmail) {
        throw new Error("Recipient email is missing");
    }

    const meetingUrl = getMeetingJoinUrl(appointment);
    const clientName = getClientName(appointment);
    const appointmentDate = formatAppointmentDate(appointment.appointmentDate);

    return {
        from: `"CaseMate Legal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Reminder: Your appointment is tomorrow at ${appointment.appointmentTime}`,
        html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3498db;">Appointment Reminder</h2>
                    
                    <p>Hi ${clientName},</p>
                    <p>This is a reminder that your appointment is scheduled for tomorrow.</p>

                    <div style="background: #f0f7ff; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
                        <p><strong>Date:</strong> ${appointmentDate}</p>
                        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
                        <p><strong>Type:</strong> ${appointment.appointmentType || 'Consultation'}</p>
                    </div>

                    ${meetingUrl && meetingUrl !== '#' ? `
                        <p><a href="${meetingUrl}" style="display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Meeting</a></p>
                    ` : ''}

                    <p>You will receive another reminder 15 minutes before the appointment starts.</p>

                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
                    <p style="font-size: 12px; color: #7f8c8d;">CaseMate Legal</p>
                </div>
            </body>
            </html>
        `
    };
};

/**
 * 15-minute reminder email
 */
const fifteenMinEmailTemplate = (appointment) => {
    const recipientEmail = getRecipientEmail(appointment);
    
    if (!recipientEmail) {
        throw new Error("Recipient email is missing");
    }

    const meetingUrl = getMeetingJoinUrl(appointment);
    const clientName = getClientName(appointment);

    return {
        from: `"CaseMate Legal" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: "URGENT: Your appointment starts in 15 minutes!",
        html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: #fff3cd; padding: 20px; border-radius: 5px; text-align: center; border-left: 4px solid #ff9800;">
                        <h2 style="color: #ff9800; margin: 0;">⏰ APPOINTMENT STARTING SOON</h2>
                        <p style="font-size: 18px; margin: 20px 0;"><strong>Your appointment begins in 15 MINUTES!</strong></p>

                        ${meetingUrl && meetingUrl !== '#' ? `
                            <a href="${meetingUrl}" style="display: inline-block; background: #27ae60; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                JOIN MEETING NOW
                            </a>
                            <p style="margin: 15px 0; font-size: 12px;">Or copy this link:<br>
                            <code style="background: #f0f0f0; padding: 5px; border-radius: 3px; word-break: break-all;">
                                ${meetingUrl}
                            </code></p>
                        ` : ''}

                        <p style="color: #555; font-size: 14px; margin-top: 20px;">
                            Please ensure you have a stable internet connection and are in a quiet environment.
                        </p>
                    </div>

                    <hr style="border: none; border-top: 1px solid #ecf0f1; margin: 20px 0;">
                    <p style="font-size: 12px; color: #7f8c8d; text-align: center;">CaseMate Legal</p>
                </div>
            </body>
            </html>
        `
    };
};

/* ================= EMAIL SENDERS ================= */

/**
 * Send confirmation email
 */
export const sendConfirmationEmail = async (appointment) => {
    try {
        console.log('Preparing confirmation email...');
        console.log('   Appointment ID:', appointment?._id);
        console.log('   Client Email:', appointment?.clientEmail);
        console.log('   Client Name:', appointment?.clientName);

        const mailOptions = confirmationEmailTemplate(appointment);

        console.log("Sending confirmation email to:", mailOptions.to);
        const info = await transporter.sendMail(mailOptions);

        // Update database
        await Appointment.findByIdAndUpdate(appointment._id, {
            "notifications.confirmationEmail.sent": true,
            "notifications.confirmationEmail.sentAt": new Date()
        });

        console.log("Confirmation email sent successfully");
        console.log("   Response:", info.response);
        return true;

    } catch (error) {
        console.error("Confirmation email failed:", error.message);
        console.error("   Error details:", error);

        try {
            await Appointment.findByIdAndUpdate(appointment._id, {
                "notifications.confirmationEmail.sent": false,
                "notifications.confirmationEmail.failureReason": error.message
            });
        } catch (updateError) {
            console.error("   Failed to update appointment record:", updateError.message);
        }

        return false;
    }
};

/**
 * Send day-before reminder email
 */
export const sendDayBeforeReminder = async (appointment) => {
    try {
        console.log("Sending day-before reminder to:", appointment?.clientEmail);
        
        const mailOptions = dayBeforeEmailTemplate(appointment);
        await transporter.sendMail(mailOptions);

        await Appointment.findByIdAndUpdate(appointment._id, {
            "notifications.dayBeforeEmail.sent": true,
            "notifications.dayBeforeEmail.sentAt": new Date()
        });

        console.log("Day-before reminder sent");
        return true;

    } catch (error) {
        console.error("Day-before reminder failed:", error.message);
        return false;
    }
};

/**
 * Send 15-minute reminder email
 */
export const sendFifteenMinReminder = async (appointment) => {
    try {
        console.log("Sending 15-minute reminder to:", appointment?.clientEmail);
        
        const mailOptions = fifteenMinEmailTemplate(appointment);
        await transporter.sendMail(mailOptions);

        await Appointment.findByIdAndUpdate(appointment._id, {
            "notifications.fifteenMinBeforeEmail.sent": true,
            "notifications.fifteenMinBeforeEmail.sentAt": new Date()
        });

        console.log("15-minute reminder sent");
        return true;

    } catch (error) {
        console.error("15-minute reminder failed:", error.message);
        return false;
    }
};

/* ================= SCHEDULER ================= */

/**
 * Schedule appointment reminder notifications
 */
export const scheduleAppointmentNotifications = async (appointment) => {
    try {
        const cron = await import("node-cron");

        // Parse appointment date and time
        const appointmentDateTime = new Date(
            `${appointment.appointmentDate}T${appointment.appointmentTime}:00Z`
        );

        const dayBefore = new Date(appointmentDateTime.getTime() - 86400000); // 24 hours before
        const fifteenMinBefore = new Date(appointmentDateTime.getTime() - 900000); // 15 minutes before

        console.log("Scheduling notifications:");
        console.log("   Appointment:", appointmentDateTime.toISOString());
        console.log("   Day before reminder:", dayBefore.toISOString());
        console.log("   15 min before reminder:", fifteenMinBefore.toISOString());

        // Schedule day-before reminder
        cron.default.schedule(
            `${dayBefore.getMinutes()} ${dayBefore.getHours()} ${dayBefore.getDate()} ${dayBefore.getMonth() + 1} *`,
            async () => {
                console.log("Running day-before reminder job for appointment:", appointment._id);
                try {
                    const apt = await Appointment.findById(appointment._id);
                    if (apt && apt.status === "Scheduled") {
                        await sendDayBeforeReminder(apt);
                    }
                } catch (error) {
                    console.error("Error in day-before cron job:", error.message);
                }
            }
        );

        // Schedule 15-minute reminder
        cron.default.schedule(
            `${fifteenMinBefore.getMinutes()} ${fifteenMinBefore.getHours()} ${fifteenMinBefore.getDate()} ${fifteenMinBefore.getMonth() + 1} *`,
            async () => {
                console.log("Running 15-min reminder job for appointment:", appointment._id);
                try {
                    const apt = await Appointment.findById(appointment._id);
                    if (apt && apt.status === "Scheduled") {
                        await sendFifteenMinReminder(apt);
                    }
                } catch (error) {
                    console.error("Error in 15-min cron job:", error.message);
                }
            }
        );

        console.log("Notifications scheduled successfully");
        return true;

    } catch (error) {
        console.error("Error scheduling notifications:", error.message);
        return false;
    }
};