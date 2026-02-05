import mongoose from "mongoose";

// Task Schema ...

const taskSchema = new mongoose.Schema({

    title : {
        type : String,
        required : [true, 'Title is required'],
        trim : true,
    },
    description : {
        type : String,
        trim : true
    },

    // relationShips..
    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    caseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Case',
        default : null,
    },

    clientId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Client',
        default : null
    },

    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        default : null
    },

    // Task Classification
    taskType : {
        type : String,
        enum: [
      'Court Appearance',
      'Filing Deadline',
      'Client Meeting',
      'Document Review',
      'Research',
      'Follow-up',
      'Phone Call',
      'Email',
      'Discovery',
      'Deposition',
      'Settlement Meeting',
      'Other'
    ],
    default : 'Other'
    },

    priority : {
        type : String,
        enum : ['Low', 'Medium','High','Urgent'],
        default : 'Medium'
    },

    status : {
        type : String,
        enum : ['Pending', 'In progress', 'Completed','Cancelled', 'Over due'],
        default : 'Pending'
    },

    dueDate : {
        type : Date,
        required : [true, 'Due Date is required'],
    },

    dueTime : {
        type : String,
    },

    completedDate : {
        type : Date,
    },

    // remainder
    reminderEnabled : {
        type : Boolean,
        default : false
    },

    reminderDate : {
        type : Date,
    },

    reminderSent : {
        type : Boolean,
        default : false
    },

    // Additional Notes..
    location : {
        type : String,
        trim : true
    },

    notes : {
        type : String,
        trim : true
    },

    // Attachments//Links..
    attachments : [{
        fileName : String,
        fileUrl : String,
        uploadedAt : {
            type : Date,
            default : Date.now,
        }
    }],

    // Subtasks:
    subTasks : [{
        title : {
            type : String,
            required : true,
        },

        completed : {
            type : Boolean,
            default : false
        },

        completedAt : Date,
    }],

    // Tags for organization..
    tags : [{
        type : String,
        trim : true,
    }],

    // Recurring Tasks.
    isRecurring : {
        type : Boolean,
        default : false
    },

    recurrentPattern : {
        type : String,
        enum : ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    }
},
    {
        timestamps : true
    }
);

// Indexing for better performance..
taskSchema.index({attorneyId:1, status : 1});
taskSchema.index({dueDate : 1, status : 1});
taskSchema.index({caseId : 1});
taskSchema.index({assignedTo : 1});

// function for marking task as completed.
taskSchema.methods.markAsCompleted = function(){
    this.status = 'Completed';
    this.completedDate = new Date();
    return this.save()
}

export default taskSchema;