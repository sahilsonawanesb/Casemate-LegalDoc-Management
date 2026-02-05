import mongoose from "mongoose";
// import clientSchema from "../client/client.schema.js";

const caseSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },

    caseNumber : {
        type : String,
        unique : true,
        sparse : true,    /// allow multiple null values
        trim : true
    },

    // relationships,
    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'client',
        required : [true, 'Client is required'],
    },

    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'Attorney is required'],
    },

    caseType: {
    type: String,
    required: [true, 'Case type is required'],
    enum: [
      'Divorce',
      'Personal Injury',
      'Criminal Defense',
      'Corporate Law',
      'Real Estate',
      'Immigration',
      'Employment',
      'Intellectual Property',
      'Tax Law',
      'Other'
    ]
  },

  priority : {
    type : String,
    enum : ['Urgent','Low', 'Medium','High'],
    default : 'Medium'
  },

  status : {
    type : String,
    enum : ['Active', 'Pending', 'On Hold', 'Closed','Won', 'Lost'],
    default : 'Active'
  },

// Court Information

  courtName : {
    type : String,
    trim : true
  },

  courtDate : {
    type : Date,
  },

  courtDescription : {
    type : String,
    trim : true
  },

  opposingParty:{
    type : String,
    trim : true,
  },

  opposingCounsel:{
    
    name : {
        type : String,
        trim : true,
    },

    email : {
        type : String,
        trim : true,
        lowercase : true
    },

    phone : {
        type : String,
        trim: true,
    }
  },

    // case details ..
    description : {
        type : String,
        trim : true
    },

    notes : {
        type : String,
        trim : true,
    },

    billingRate: {
    type: Number,
    default: 0
  },

  estimatedValue: {
    type: Number,
    default: 0
  },
   filingDate: {
    type: Date
  },

  closingDate: {
    type: Date
  },

  nextHearingDate: {
    type: Date
  },

  // Case Timeline/Activity Log
  activities: [{
    type: {
      type: String,
      enum: ['Note', 'Court Appearance', 'Client Meeting', 'Document Filed', 'Email', 'Call', 'Other']
    },
    description: {
      type : String,
    },
    date: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // Tags for better organization
  tags: [{
    type: String,
    trim: true
  }]

}, {
  timestamps: true  // createdAt, updatedAt
});


// Indexing for faster query..
caseSchema.index({attorneyId : 1, status : 1});
caseSchema.index({clientId : 1});
caseSchema.index({caseNumber : 1});
caseSchema.index({caseTitle:'text', description : 'text'});

export default caseSchema;