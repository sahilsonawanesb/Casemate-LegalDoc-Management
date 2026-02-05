        import mongoose from "mongoose";

        const appointmentSchema = new mongoose.Schema({
            // attorney Info..
            attorneyId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
                required : true,
                index : true
            },

            // client info
            clientName : {
                type : String,
                required : [true, 'client name is required'],
                trim : true,
            },

            clientEmail : {
              type : String,
              required : [true, 'client email is required'],
              trim : true,
              lowercase : true,
            },

            clientPhone : {
                type : String,
                trim : true
            },
            clientFirebaseToken : {
                type : String,
            },

            // Case Info
            caseId : {
                type : String,
                trim : true,
            },

            caseTitle:{
                type : String,
                trim : true
            },

            // Appointment Details .
            appointmentDate : {
                type : String,
                required : [true, 'Appointment data is required'],
                match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
            },

            appointmentTime : {
                type : String,
                required : [true, 'Appointment time is required'],
                // Format: HH:MM
                match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
            },

            appointmentType : {
                type : String,
                enum : {
                values: ['Consultation', 'Strategy Meeting', 'Court Preparation', 'Client Review', 'Follow-up'],
                message : 'Please select a valid appointment type'
                },
                default : 'Consultation'
            },

            duration : {
                type : Number,
                default : 60,
                min : [15, 'Minimum duration is 15 minutes'],
                max : [480, 'Maximum duration is 80 hours']
            },

            priority : {
                type : String,
                enum : {
                    values : ['Scheduled', 'Completed', 'Cancelled', 'No-show', 'Rescheduled'],
                    message : 'Invalid appointment status'
                },
                default : 'Scheduled',
                index:true
            },

            notes : {
                type : String,
                trim:true
            },


            // Online metting integration..
            meetingDetails : {
                meetingType: {
                    type: String,
                    enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'Jitsi'],
                    default: 'Google Meet'
                },

                meetingLink : {
                    type : String,
                    sparse : true
                },

                meetingId : {
                    type : String
                },

                meetingPassword : {
                    type : String
                },

                meetingStartUrl : {
                    type : String
                },

                meetingJoinUrl : {
                    type : String,
                }
            },

            // Notification tracking.
            notifications : {
                confirmationEmail : {
                    sent : {
                        type : Boolean,
                        default : false
                    },
                    sentAt : Date,
                    openedAt : Date,
                    failureReason : String
                },

                dayBeforeEmail : {
                    sent : {
                        type : Boolean,
                        default : false
                    },
                    sentAt : Date,
                    failureReason : String
                },

                fifteenMinBeforeEmail: {
                    sent: { type: Boolean, default: false },
                    sentAt: Date,
                    failureReason: String
                },
                fifteenMinBeforePush: {
                    sent: { type: Boolean, default: false },
                    sentAt: Date,
                    failureReason: String
                },
                completionReminder: {
                    sent: { type: Boolean, default: false },
                    sentAt: Date,
                    failureReason: String
                }
            },

            // Scheduled jobs for corn.
            scheduledJobs: {
                dayBeforeJobId: String,
                fifteenMinBeforeJobId: String,
                completionJobId: String
            },

            // Meeting recording notes..
            recodingLink : {
                type : String,
                trim : true
            },
            meetingNotes : {
                type : String,
                trim : true
            },

            // Timestamps 
            createdAt : {
                type : Date,
                default : Date.now,
                index : true
            },
            updatedAt: {
                type: Date,
                default: Date.now
            },
            completedAt: Date,
            
            // Additional metadata
            isOnlineMeeting: {
                type: Boolean,
                default: true
            },
            remindersSent: {
                type: Boolean,
                default: false
            }
        }, {
            timestamps : true,
            collection : 'appointments'
        });

        // indexing for better performance.
        appointmentSchema.index({attorneyId:1, appointmentDate : 1});
        appointmentSchema.index({attorneyId:1, status : 1});
        appointmentSchema.index({clientEmail : 1});
        appointmentSchema.index({appointmentDate:1, appointmentTime : 1});

        appointmentSchema.virtual('appointmentDateTime').get(function() {
            return `${this.appointmentDate}T${this.appointmentTime}`;
        });

        // Pre-save middleware to update updatedAt
        appointmentSchema.pre('save', function(next) {
            this.updatedAt = new Date();
            next();
        });

        export default appointmentSchema;