// // FILE: services/googleMeetService.js
// // FINAL CORRECTED - ESM Module with Proper Async Initialization

// import { google } from 'googleapis';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
// import crypto from 'crypto';
// import { fileURLToPath } from 'url';

// dotenv.config();

// // Get current directory for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// class GoogleMeetService {
//   constructor() {
//     this.auth = null;
//     this.calendar = null;
//     this.initialized = false;
//   }

//   /**
//    * Initialize Google API Authentication
//    * This is async and MUST be called before using the service
//    */
//   async initialize() {
//     try {
//       console.log('\n' + '='.repeat(60));
//       console.log('🔄 Initializing Google Meet Service...');
//       console.log('='.repeat(60));

//       let credentials = null;
      
//       // Try multiple paths for credentials
//       const possiblePaths = [
//         process.env.GOOGLE_CREDENTIALS_PATH,
//         './google-service-account.json',
//         path.join(process.cwd(), 'google-service-account.json'),
//         path.join(__dirname, '../../google-service-account.json')
//       ].filter(Boolean);

//       console.log('📋 Looking for credentials in:');
//       possiblePaths.forEach(p => console.log('   -', p));

//       // 1️⃣ Try loading from file
//       for (const credPath of possiblePaths) {
//         if (fs.existsSync(credPath)) {
//           try {
//             console.log(`\n✅ Found credentials file: ${credPath}`);
//             const fileContent = fs.readFileSync(credPath, 'utf8');
//             credentials = JSON.parse(fileContent);
//             console.log('✅ Credentials file parsed successfully');
//             console.log('   Service Account Email:', credentials.client_email);
//             console.log('   Project ID:', credentials.project_id);
//             break;
//           } catch (parseError) {
//             console.error('❌ Error parsing credentials file:', parseError.message);
//           }
//         }
//       }

//       // 2️⃣ If file not found, try environment variables
//       if (!credentials) {
//         console.log('\n📄 Trying environment variables...');
        
//         if (process.env.GOOGLE_PROJECT_ID && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
//           console.log('✅ Found credentials in environment variables');
//           credentials = {
//             type: 'service_account',
//             project_id: process.env.GOOGLE_PROJECT_ID,
//             private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//             client_email: process.env.GOOGLE_CLIENT_EMAIL
//           };
//         }
//       }

//       // 3️⃣ If still no credentials, throw error
//       if (!credentials) {
//         throw new Error(
//           'Google credentials not found! Please:\n' +
//           '1. Place google-service-account.json in project root, OR\n' +
//           '2. Set GOOGLE_CREDENTIALS_PATH in .env, OR\n' +
//           '3. Set GOOGLE_PROJECT_ID, GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL in .env'
//         );
//       }

//       console.log('\n🔐 Creating JWT authentication client...');

//       // Create JWT auth client
//       this.auth = new google.auth.JWT({
//         email: credentials.client_email,
//         key: credentials.private_key,
//         scopes: [
//           'https://www.googleapis.com/auth/calendar',
//           'https://www.googleapis.com/auth/calendar.events',
//         //   'https://www.googleapis.com/auth/meetings.space.created'
//         ]
//       });

//       console.log('✅ JWT client created');

//       // Initialize Calendar API
//       console.log('\n📅 Initializing Google Calendar API...');
//       this.calendar = google.calendar({
//         version: 'v3',
//         auth: this.auth
//       });

//       console.log('✅ Calendar API initialized');

//       // Test authentication
//       console.log('\n🧪 Testing Google Calendar API connection...');
//       try {
//         const calendarList = await this.calendar.calendarList.list({
//           maxResults: 1
//         });
        
//         console.log('✅ Google Calendar API connection successful');
//         console.log('   Found', calendarList.data.items?.length || 0, 'calendar(s)');
//       } catch (authError) {
//         console.warn('⚠️ Calendar API test failed:', authError.message);
//         console.warn('   This might indicate missing permissions');
//         console.warn('   But service will still attempt to create meetings');
//       }

//       this.initialized = true;
      
//       console.log('\n' + '='.repeat(60));
//       console.log('✅ Google Meet Service initialized successfully!');
//       console.log('='.repeat(60) + '\n');

//       return true;

//     } catch (error) {
//       console.error('\n' + '='.repeat(60));
//       console.error('❌ Google Meet Service initialization FAILED');
//       console.error('='.repeat(60));
//       console.error('Error:', error.message);
//       console.error('Stack:', error.stack);
//       console.error('='.repeat(60) + '\n');
      
//       this.initialized = false;
//       // Don't throw - let app continue without Google Meet
//       return false;
//     }
//   }

//   /**
//    * Create Google Meet Event in Calendar
//    */
//   async createMeetingEvent(appointmentData) {
//     if (!this.initialized) {
//       throw new Error('Google Meet Service not initialized');
//     }

//     try {
//       const {
//         clientName,
//         clientEmail,
//         caseTitle,
//         appointmentDate,
//         appointmentTime,
//         duration = 60,
//         attorneyEmail,
//         description = ''
//       } = appointmentData;

//       // Validate all required fields
//       if (!clientName || !clientEmail || !appointmentDate || !appointmentTime || !attorneyEmail) {
//         throw new Error(
//           'Missing required fields: ' +
//           [
//             !clientName && 'clientName',
//             !clientEmail && 'clientEmail',
//             !appointmentDate && 'appointmentDate',
//             !appointmentTime && 'appointmentTime',
//             !attorneyEmail && 'attorneyEmail'
//           ]
//           .filter(Boolean)
//           .join(', ')
//         );
//       }

//       console.log('\n📅 Creating Google Meet event...');
//       console.log('   Client:', clientName, `<${clientEmail}>`);
//       console.log('   Case:', caseTitle);
//       console.log('   Attorney:', attorneyEmail);
//       console.log('   Date/Time:', appointmentDate, appointmentTime);
//       console.log('   Duration:', duration, 'minutes');

//       // Parse date and time
//     //   const startDateTime = new Date(`${appointmentDate}T${appointmentTime}:00Z`);
//     const startDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);

//       const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

//       if (Number.isNaN(startDateTime.getTime())) {
//         throw new Error(`Invalid date/time format. Expected YYYY-MM-DD HH:MM. Got ${appointmentDate} ${appointmentTime}`);
//       }

//       console.log('   Start:', startDateTime.toISOString());
//       console.log('   End:', endDateTime.toISOString());

//       // Create event with Google Meet conference
//       const event = {
//         summary: `Legal Consultation: ${caseTitle || clientName}`,
//         description: `
// Client: ${clientName}
// Email: ${clientEmail}
// Attorney: ${attorneyEmail}
// ${description ? `Notes: ${description}` : ''}
//         `.trim(),
//         start: {
//           dateTime: startDateTime.toISOString(),
//           timeZone: 'Asia/Kolkata'

//         },
//         end: {
//           dateTime: endDateTime.toISOString(),
//           timeZone: 'Asia/Kolkata'

//         },
//         // attendees: [
//         //   {
//         //     email: attorneyEmail,
//         //     displayName: 'Attorney',
//         //     organizer: true,
//         //     responseStatus: 'accepted'
//         //   },
//         //   {
//         //     email: clientEmail,
//         //     displayName: clientName,
//         //     responseStatus: 'needsAction'
//         //   }
//         // ],
//         conferenceData: {
//           createRequest: {
//             requestId: crypto.randomUUID(),
//             conferenceSolutionKey: {
//               type: 'hangoutsMeet'
//             }
//           }
//         },
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'email', minutes: 1440 },  // 1 day before
//             { method: 'email', minutes: 15 }      // 15 min before
//           ]
//         },
//         guestsCanModify: false,
//         guestsCanInviteOthers: false,
//         guestsCanSeeOtherGuests: true,
//         transparency: 'opaque'
//       };

//       console.log('\n📤 Inserting event into Google Calendar...');

//       // Insert event - this creates the Google Meet automatically
//       const { data } = await this.calendar.events.insert({
//         calendarId: 'primary',
//         resource: event,
//         conferenceDataVersion: 1,
//         sendUpdates: 'all'
//       });

//       console.log('✅ Event created in Google Calendar');
//       console.log('   Event ID:', data.id);
//       console.log('   HTML Link:', data.htmlLink);

//       // Extract Google Meet link from conference data
//       if (!data.conferenceData) {
//         throw new Error('No conference data returned from Google Calendar');
//       }

//       const meetLink = data.conferenceData.entryPoints?.find(
//         ep => ep.entryPointType === 'video'
//       )?.uri;

//       if (!meetLink) {
//         console.error('❌ Conference data:', JSON.stringify(data.conferenceData, null, 2));
//         throw new Error('Google Meet link not found in conference data');
//       }

//       console.log('✅ Google Meet link created:', meetLink);

//       return {
//         meetingType: 'Google Meet',
//         eventId: data.id,
//         meetingLink: meetLink,
//         meetingJoinUrl: meetLink,
//         calendarLink: data.htmlLink,
//         conferenceId: data.conferenceData.conferenceId,
//         createdAt: new Date(),
//         provider: 'Google Meet API'
//       };

//     } catch (error) {
//       console.error('❌ Error creating Google Meet event:', error.message);
//       console.error('   Stack:', error.stack);
//       throw error;
//     }
//   }

//   /**
//    * Update meeting
//    */
//   async updateMeetingEvent(eventId, updateData) {
//     if (!this.initialized) {
//       throw new Error('Google Meet Service not initialized');
//     }

//     try {
//       console.log('📝 Updating meeting:', eventId);
//       const { data } = await this.calendar.events.update({
//         calendarId: 'primary',
//         eventId,
//         resource: updateData,
//         sendUpdates: 'all'
//       });

//       console.log('✅ Meeting updated');
//       return data;

//     } catch (error) {
//       console.error('❌ Error updating meeting:', error.message);
//       throw error;
//     }
//   }

//   /**
//    * Cancel meeting
//    */
//   async cancelMeetingEvent(eventId) {
//     if (!this.initialized) {
//       throw new Error('Google Meet Service not initialized');
//     }

//     try {
//       console.log('🚫 Cancelling meeting:', eventId);
//       await this.calendar.events.delete({
//         calendarId: 'primary',
//         eventId,
//         sendUpdates: 'all'
//       });

//       console.log('✅ Meeting cancelled');
//       return true;

//     } catch (error) {
//       console.error('❌ Error cancelling meeting:', error.message);
//       throw error;
//     }
//   }

//   /**
//    * Get meeting details
//    */
//   async getMeetingDetails(eventId) {
//     if (!this.initialized) {
//       throw new Error('Google Meet Service not initialized');
//     }

//     try {
//       const { data } = await this.calendar.events.get({
//         calendarId: 'primary',
//         eventId
//       });

//       return data;

//     } catch (error) {
//       console.error('❌ Error getting meeting details:', error.message);
//       throw error;
//     }
//   }

//   /**
//    * Check if service is initialized
//    */
//   isInitialized() {
//     return this.initialized;
//   }
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ CREATE INSTANCE AND AUTO-INITIALIZE
// // ═══════════════════════════════════════════════════════════════════════════

// const googleMeetService = new GoogleMeetService();

// // ✅ AUTO-INITIALIZE WHEN MODULE IS IMPORTED
// // This is the critical part!
// console.log('\n🚀 Importing googleMeetService.js - initializing now...');
// googleMeetService.initialize().catch(error => {
//   console.error('⚠️ Google Meet Service initialization error:', error.message);
//   console.error('   Appointments will work but without Google Meet links');
// });

// export default googleMeetService;


// FILE: services/googleMeetService.js
// GOOGLE MEET via OAUTH 2.0 (ESM + PRODUCTION READY)

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

dotenv.config();

// ─────────────────────────────────────────────
// ESM directory helpers
// ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Token storage (persistent login)
const TOKEN_PATH = path.join(process.cwd(), 'tokens/google-oauth-token.json');

// ─────────────────────────────────────────────
// Google Meet Service
// ─────────────────────────────────────────────
class GoogleMeetService {
  constructor() {
    this.oauth2Client = null;
    this.calendar = null;
    this.initialized = false;
  }

  // ─────────────────────────────────────────────
  // STEP 1: Initialize OAuth Client
  // ─────────────────────────────────────────────
  async initialize() {
    try {
      console.log('🔄 Initializing Google OAuth...');

      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      // Load saved token if exists
      if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        this.oauth2Client.setCredentials(token);
        console.log('✅ OAuth token loaded');
      } else {
        console.warn('⚠️ No OAuth token found');
        console.warn('➡️ Call getAuthUrl() and complete login once');
        return false;
      }

      // Init Calendar API
      this.calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client
      });

      // Test API
      await this.calendar.calendarList.list({ maxResults: 1 });
      this.initialized = true;

      console.log('✅ Google Calendar OAuth ready');
      return true;

    } catch (err) {
      console.error('❌ OAuth init failed:', err.message);
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // STEP 2: Generate Google Login URL (ONE TIME)
  // ─────────────────────────────────────────────
  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ]
    });
  }

  // ─────────────────────────────────────────────
  // STEP 3: Exchange code → token
  // ─────────────────────────────────────────────
  async saveTokenFromCode(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log('✅ OAuth token saved');
    return true;
  }

  // ─────────────────────────────────────────────
  // CREATE GOOGLE MEET EVENT
  // ─────────────────────────────────────────────
  async createMeetingEvent(data) {
    if (!this.initialized) {
      throw new Error('Google OAuth not initialized');
    }

    const {
      clientName,
      clientEmail,
      attorneyEmail,
      appointmentDate,
      appointmentTime,
      duration = 60,
      caseTitle = ''
    } = data;

    const start = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const end = new Date(start.getTime() + duration * 60000);

    const event = {
      summary: `Legal Consultation: ${caseTitle || clientName}`,
      start: {
        dateTime: start.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      attendees: [
        { email: attorneyEmail },
        { email: clientEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    };

    const res = await this.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    const meetLink = res.data.conferenceData.entryPoints.find(
      e => e.entryPointType === 'video'
    ).uri;

    return {
      eventId: res.data.id,
      meetingLink: meetLink,
      calendarLink: res.data.htmlLink
    };
  }
}

// ─────────────────────────────────────────────
// SINGLETON INSTANCE
// ─────────────────────────────────────────────
const googleMeetService = new GoogleMeetService();
googleMeetService.initialize();

export default googleMeetService;
