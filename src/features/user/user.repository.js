import mongoose from "mongoose";
import userSchema from "./user.schema.js";
import ApplicationError from "../../error-handler/ApplicationError.js";


// creating the user model.
const userModel = mongoose.model("User", userSchema);


export default class UserRepository{

    // sign up user.
    async createUser(userDetails){
        try{
            const newUser = new userModel(userDetails);
            await newUser.save();
            return newUser;

        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to create user in the database", 500);
        }
    }


    // sign in user by email and password.
    async findByEmail(email){
        try{
            return await userModel.findOne({email}).select("+password");
        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to sign in user", 500);
        }
    }


    // find by user id.
    async getById(userId){
        try{

            return await userModel.findById(userId).select("-passeord");

        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to fetch user by id", 500);
        }
    }

    async getByIdPass(userId){
        try{

            return await userModel.findById(userId).select("+password");

        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to fetch user by id", 500);
        }
    }

    // update by user id.
    async updateById(userId, updateData){
        try{

            return await userModel.findByIdAndUpdate(userId, {$set : updateData}, {new : true});
        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to update the userDetails", 500);
        }
    }

    async logout(userId){
        try{
            return await userModel.findByIdAndUpdate(userId, {token : null}, {new : true});
        }catch(error){
            console.log(error);
            throw new ApplicationError('Unable to logout user', 500);
        }
    }
}