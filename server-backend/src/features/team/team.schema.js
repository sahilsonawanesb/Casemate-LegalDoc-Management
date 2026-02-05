import mongoose from "mongoose";


const teamMemberSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true, 'Name is required'],
        trim : true
    },

    email : {
        type :String,
        required : [true, 'Email is required'],
        unique : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    phone : {
        type : String,
        trim :true,
    },

    // releationships status..
    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        index : true
    },

     // Role in the team
  role: {
    type: String,
    enum: [
      'Legal Assistant', 'Paralegal', 'Junior Associate', 'Senior Associate', 'Law Clerk', 'Office Manager'
    ],
    required: true
  },

  employmentType : {
    type : String,
    enum : ['Full-time', 'Part-time', 'Contract', 'Intern'],
    default : 'Full-time'
  },

  department : {
    type : String,
    trim : true
  },

  joinDate : {
    type : Date,
    default : Date.now()
  },

   // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active'
  },

   // Access & Permissions
  permissions: {
    canViewAllCases: {
      type: Boolean,
      default: false
    },
    canEditCases: {
      type: Boolean,
      default: false
    },
    canViewAllClients: {
      type: Boolean,
      default: false
    },
    canEditClients: {
      type: Boolean,
      default: false
    },
    canViewDocuments: {
      type: Boolean,
      default: true
    },
    canUploadDocuments: {
      type: Boolean,
      default: true
    },
    canEditDocuments : {
      type : Boolean,
      default : false
    },
    canDeleteDocuments : {
      type : Boolean,
      default : false
    },
    canManageTasks: {
      type: Boolean,
      default: true
    },
    canViewFinancials: {
      type: Boolean,
      default: false
    }
  },

//   Assisgned Cases:-
assignedCases : [{
    caseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Case'
    },

    assignedDate : {
        type : Date,
        default : Date.now(),
    },

    role : {
        type : String,
        trim : true
    },
}],

specializations : [{
    type : String,
    trim : true
}],

// Contact Information
address : {
    street : String,
     // Contact Information
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
},

emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },

  // Work Information
  bio: {
    type: String,
    trim: true
  },

  notes: {
    type: String,
    trim: true
  },

  // Avatar/Profile
  avatar: {
    type: String
  },

  // Performance Tracking
  tasksCompleted: {
    type: Number,
    default: 0
  },

  casesHandled: {
    type: Number,
    default: 0
  },

  // Availability
  workSchedule: {
    monday: { available: Boolean, hours: String },
    tuesday: { available: Boolean, hours: String },
    wednesday: { available: Boolean, hours: String },
    thursday: { available: Boolean, hours: String },
    friday: { available: Boolean, hours: String },
    saturday: { available: Boolean, hours: String },
    sunday: { available: Boolean, hours: String }
  },

}, {
  timestamps: true
});

// Indexing for faster quries..
teamMemberSchema.index({attorneyId : 1, status : -1});
teamMemberSchema.index({email : 1});
teamMemberSchema.index({ role : 1 });

export default teamMemberSchema;

