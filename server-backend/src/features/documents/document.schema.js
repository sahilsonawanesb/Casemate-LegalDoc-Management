import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

    documentName : {
        type : String,
        required : [true, 'Document Name is reuired'],
        trim : true
    },

    fileName : {
        type : String,
        required : true,
    },

    fileSize:{
        type : Number,
        required : true,
    },

    fileType : {
        type : String,
        required : true,
    },

    filePath : {
        type : String,
        required : true,
    },

    fileUrl : {
        type : String,
        required : true,
    },

    caseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Case',
        required : [true, 'Case reference is required']
    },

    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client',
        required : [true, 'CLient reference is required']
    },
    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : [true, 'User reference is required']
    },
     category: {
    type: String,
    required: true,
    enum: [
      'Pleadings',
      'Evidence',
      'Contracts',
      'Discovery',
      'Court Orders',
      'Correspondence',
      'Medical Records',
      'Financial Documents',
      'Legal Briefs',
      'Affidavits',
      'Other'
    ]
  },

  status : {
    type : String,
    enum : ['Draft', 'Final', 'Pending','Under Review', 'Archived'],
    default : 'Draft'
  },

  version : {
    type : Number,
    default : 1
  },

//   documents details,
  description : {
    type : String,
    trim : true,
  },

  tags : [{
    type : String,
    trim : true,
  }],

  isConfidential : {
    type : Boolean,
    trim : true
  },

  documentDate : {
    type : Date,
  },

  expiryDate : {
    type : Date,
  },

  uploadeBy : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true,
  },

    versions: [{
    versionNumber: Number,
    fileName: String,
    filePath: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],

  metaData : {
    pages : Number,
    author : String,
    createdDate : Date,
    modifiedDate : Date,
  },

//   notes and commonts
notes : {
    type : String,
    trim : true,
}
},{
    timestamps : true
});


// indexing..
documentSchema.index({caseId:1, category:1});
documentSchema.index({clientId:1});
documentSchema.index({attorneyId:1, status:1});
documentSchema.index({documentName:'text', description:'text'});

export default documentSchema;
