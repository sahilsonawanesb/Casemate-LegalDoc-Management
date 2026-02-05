// creating the client schema using the mongoose as follows.
import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    // basic information as follows.
    name : {
        type : String,
        required : [true, 'Name is required'],
        trim : true,
        maxlength : [50, 'Name must be less than 50 characters']
    },

    email : {
        type : String,
        required : [true, 'Email is required'],
        trim : true,
        unique:true,
        lowercase : true,
        match : [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },

    phone : {
        type : String,
        required : [true, 'Phone number is required'],
        trim : true
    },
    caseType : {
        type : String,
        enum: {
      values: ['Criminal', 'Civil', 'Family', 'Corporate', 'Immigration', 'Bankruptcy', 'Other'],
      message: '{VALUE} is not a valid case type'
    },
    default: 'Other',
  required : true,
    // validate : {
    //     validator : arr => arr.length > 0,
    //     message : "At least one case type is required"
    // }     
    },
    address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },

//   rel
    attorneyId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    status:{
        type : String,
        enum : ['Active', 'Inactive','On Hold', 'Closed'],
        default : 'Active'
    },
    notes : {
        type : String,
        trim : true
    },
    lastContact : {
        type : Date,
        default : Date.now
    },
    contactHistory : [{
        type : {
           type: String,
           enum : ['Call', 'Email','Meeting','Note','Document'],
        },
        date : {
            type : Date,
            default : Date.now,
        },
        notes: String,
    }]


}, {timestamps : true});


// indexing for faster queries as follows.
clientSchema.index({attorneyId:1, email:1});
clientSchema.index({name : 'text', email : 'text'});  // for text search..



export default clientSchema;