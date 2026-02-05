// creating the user schema.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true,
        maxlength : [50, "Name must be less than 50 characters"]
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        lowercase : true,
        match: [
         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
    ]
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        minlength : [6, "Password must be at least 6 characters"],
        select : false
    },
    role : {
        type : String,
        enum : {
             values : ['client', 'attorney', 'assistant'],
             message : 'Role is either: client, attorney, assistant'
        },
        default : 'attorney'
    },
    isActive : {
        type : Boolean,
        default : true
    },
    profileImage : {
        type : String,
        default : null,
    },
    phone : {
        type : String,
        trim : true,
    },
    address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
    preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    timezone: { type: String, default: 'America/New_York' },
    language: { type: String, default: 'en' }
  },
  lastLogin : {
    type : Date,
    default : null
  },
  createdAt : {
    type : Date,
    default : Date.now
  },

}, {timestamps : true})


export default userSchema;