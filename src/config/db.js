// connecting to the node js application using the mongoose.
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

// mongodb connection string or url
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/casemate";


// function to connect to the mongodb database.

export const connectDB = async () => {
    // using try and catch block to handle the error.
    try{
       const conn = await mongoose.connect(MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology : true,
        
        })
        console.log(`Case mate database connected : ${conn.connection.host}`);
    }catch(error){
        console.log("Error while connecting to the case mate database", error.message);
        process.exit(1);
    }
}