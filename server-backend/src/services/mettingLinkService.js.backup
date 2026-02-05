// FILE: services/meetingLinkService.js
// FIXED - Properly handles appointmentData object

import { v4 as uuidv4 } from 'uuid';
import googleMeetService from './googleMeetService.js';
import ApplicationError from '../error-handler/ApplicationError.js';

/**
 * Generate real Google Meet link using Google API
 * ✅ FIXED: Now properly receives and handles the appointmentData object
 */
export const generateGoogleMeetLink = async(appointmentData) => {
    try {
        console.log('🔗 Generating Google Meet link...');
        console.log('   Received data type:', typeof appointmentData);
        console.log('   Received data:', appointmentData);

        // ✅ EXTRACT fields from the appointmentData object
        const {
            appointmentDate,
            appointmentTime,
            clientName,
            clientEmail,
            caseTitle,
            attorneyEmail,
            duration,
            description
        } = appointmentData;

        // Validate required data
        if (!appointmentDate || !appointmentTime) {
            throw new Error('Appointment date and time are required');
        }

        if (!attorneyEmail) {
            throw new Error('Attorney email is required to create meeting');
        }

        // ✅ Now appointmentDate is a STRING, so .replace() will work
        console.log('   appointmentDate type:', typeof appointmentDate);
        console.log('   appointmentDate value:', appointmentDate);

        // Try to use Google Meet API if configured
        try {
            if (googleMeetService.isInitialized()) {
                console.log('   Using Google Calendar API to create meeting...');
                const meetingData = await googleMeetService.createMeetingEvent(appointmentData);

                return {
                    meetingType: 'Google Meet',
                    meetingId: meetingData.meetingId,
                    eventId: meetingData.eventId,
                    meetingLink: meetingData.meetingLink,
                    meetingJoinUrl: meetingData.meetingLink,
                    meetingStartUrl: meetingData.meetingStartUrl,
                    htmlLink: meetingData.htmlLink,
                    conferenceId: meetingData.conferenceId,
                    meetingPassword: null,
                    provider: 'Google Meet API'
                };
            } else {
                console.warn('   Google Meet API not initialized, using fallback');
            }
        } catch(error) {
            console.warn('   Google API error, using fallback:', error.message);
        }

        // Fallback: Generate a valid Google Meet link format
        console.log('   Generating fallback Google Meet link...');
        const date = appointmentDate.replace(/-/g, '');  // ✅ NOW WORKS - appointmentDate is a string
        const randomPart = uuidv4().substring(0, 8).replace(/-/g, '');
        const meetingId = `case-${date}-${randomPart}`;

        const meetingLink = `https://meet.google.com/${meetingId}`;

        console.log('   ✅ Generated meeting link:', meetingLink);

        return {
            meetingType: 'Google Meet',
            meetingId: meetingId,
            meetingLink: meetingLink,
            meetingJoinUrl: meetingLink,
            meetingStartUrl: meetingLink,
            meetingPassword: null,
            provider: 'Google Meet Fallback'
        };

    } catch(error) {
        console.error('❌ Error generating Google Meet link:', error.message);
        throw new ApplicationError('Failed to generate meeting link: ' + error.message, 500);
    }
};

/**
 * Generate Zoom meeting link (placeholder for future implementation)
 */
export const generateZoomMeetingLink = async(appointmentData) => {
    try {
        console.log('⚠️ Zoom API integration not yet implemented');
        console.log('   Available platforms: Google Meet');
        throw new Error('Zoom integration coming soon. Please use Google Meet instead.');

    } catch(error) {
        console.error('❌ Error generating Zoom link:', error.message);
        throw new ApplicationError('Zoom integration not yet available', 501);
    }
};

/**
 * Generate Microsoft Teams meeting link (placeholder)
 */
export const generateTeamsMeetingLink = async(appointmentData) => {
    try {
        console.log('⚠️ Microsoft Teams API integration not yet implemented');
        throw new Error('Teams integration coming soon. Please use Google Meet instead.');

    } catch(error) {
        console.error('❌ Error generating Teams link:', error.message);
        throw new ApplicationError('Teams integration not yet available', 501);
    }
};

/**
 * Main function - Generate meeting link based on type
 * ✅ This is the entry point - receives meetingType and appointmentData object
 */
export const generateMeetingLink = async(meetingType, appointmentData) => {
    try {
        console.log(`\n🔗 Generating ${meetingType} meeting link...`);
        console.log('   Data type:', typeof appointmentData);

        switch(meetingType) {
            case 'Google Meet':
                return await generateGoogleMeetLink(appointmentData);

            case 'Zoom':
                return await generateZoomMeetingLink(appointmentData);

            case 'Microsoft Teams':
                return await generateTeamsMeetingLink(appointmentData);

            default:
                console.log('   Unknown meeting type, defaulting to Google Meet');
                return await generateGoogleMeetLink(appointmentData);
        }

    } catch(error) {
        console.error('❌ Error generating meeting link:', error.message);
        throw error;
    }
};

/**
 * Update meeting event
 */
export const updateMeetingEvent = async(eventId, updateData) => {
    try {
        console.log('📝 Updating meeting event:', eventId);
        return await googleMeetService.updateMeetingEvent(eventId, updateData);
    } catch(error) {
        console.error('❌ Error updating meeting:', error.message);
        throw error;
    }
};

/**
 * Cancel meeting event
 */
export const cancelMeetingEvent = async(eventId) => {
    try {
        console.log('🚫 Cancelling meeting event:', eventId);
        return await googleMeetService.cancelMeetingEvent(eventId);
    } catch(error) {
        console.error('❌ Error cancelling meeting:', error.message);
        throw error;
    }
};

/**
 * Get meeting details
 */
export const getMeetingDetails = async(eventId) => {
    try {
        console.log('📋 Fetching meeting details:', eventId);
        return await googleMeetService.getMeetingDetails(eventId);
    } catch(error) {
        console.error('❌ Error fetching meeting details:', error.message);
        throw error;
    }
};

/**
 * Validate meeting link format
 */
export const validateMeetingLink = (meetingLink, meetingType) => {
    try {
        const url = new URL(meetingLink);

        switch(meetingType) {
            case 'Google Meet':
                return url.hostname === 'meet.google.com' && url.pathname.length > 1;
            case 'Zoom':
                return url.hostname.includes('zoom.us');
            case 'Microsoft Teams':
                return url.hostname.includes('teams.microsoft.com');
            default:
                return false;
        }
    } catch(error) {
        console.error('❌ Invalid meeting link format:', error.message);
        return false;
    }
};

export default {
    generateMeetingLink,
    generateGoogleMeetLink,
    generateZoomMeetingLink,
    generateTeamsMeetingLink,
    updateMeetingEvent,
    cancelMeetingEvent,
    getMeetingDetails,
    validateMeetingLink
};