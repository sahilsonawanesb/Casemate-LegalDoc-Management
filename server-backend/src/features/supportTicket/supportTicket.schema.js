import mongoose from "mongoose";

const supportTicketSchema = mongoose.Schema({
    // Ticket Information.
    ticketNumber : {
        type : String,
        unique : true,
        required : true
    },

    subject : {
        type : String,
        required : [true, 'Subject is required'],
        trim : true
    },

    description : {
        type : String,
        required : [true, 'Description is required'],
        trim : true
    },

    // Releationships
    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client',
        required : true
    },

    caseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Case',
        required : true
    },

    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Team',
        required : true
    },

    status : {
        type : String,
        enum : ['Open', 'In Progress', 'Waiting on Client','Resolved','Closed'],
        default : 'Open'
    },

    priority : {
        type : String,
        enum : ['Low', 'Medium', 'High', 'Urgent'],
        default : 'Medium'
    },

    category : {
        type : String,
        enum : ['General Inquiry', 'Case Update', 'Document Request', 'Billing Question','Appointement Request', 'Urgent Matter', 'Other'],
        default : 'General Inquiry'
    },

    // Messages Reply.
    messages: [{
    sender: {
      type: String,
      enum: ['Client', 'Attorney', 'Assistant'],
      required: true
    },
    senderName: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.senderModel'
    },
    senderModel: {
      type: String,
      enum: ['Client', 'User', 'TeamMember']
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],

//   TimeStamps:-
resolvedAt : {
    type : Date,
},

resolvedBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
},

closedAt : {
    type : Date
},

tags : [{
    type : String,
    trim : true
}],

// Internal Notes..
internalNotes : {
    type : String,
    trim : true,

}
},{
    timestamps : true,
});

// Auto-generate ticket support.
supportTicketSchema.pre('save', async function(next) {
    if(!this.ticketNumber && this.isNew){
        const count = await mongoose.model('SupportTicket').countDocuments();
        this.ticketNumber = `#${String(count+1).padStart(4, '0')}`;
    }
    next();
});

// Indexes
supportTicketSchema.index({clientId : 1, status : 1});
supportTicketSchema.index({assignedTo : 1, status : 1});
supportTicketSchema.index({attorneyId : 1});
supportTicketSchema.index({ticketNumber : 1});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

export default SupportTicket;
