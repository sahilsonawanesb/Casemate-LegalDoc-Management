import mongoose from "mongoose";
import teamModel from "./team.model.js";
import ApplicationError from "../../error-handler/ApplicationError.js";


export default class TeamRepository{

    async existingMember(email, attorneyId){
        try{

            const existingMem = await teamModel.findOne({
                email : email.toLowerCase(),
                attorneyId
            });

            return existingMem;

        }catch(error){
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async getAllTeamMember(filter){
        try{

            const teamMembers = await teamModel.find(filter)
                 .populate('assignedCases.caseId', 'caseTitle caseNumber status')
                 .sort({ createdAt: -1 })
                 .select('-__v');

            return teamMembers;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async teamMember(id, attorneyId){
        try{

            const teamMember = await teamModel.findOne({_id : id, attorneyId});

            return teamMember;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async deleteMember(id, attorneyId){
        try{

            const teamMember = await teamModel.findOneAndDelete({_id : id, attorneyId});

            return teamMember;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at the database level', 500);
        }
    }

    async updateTeamMember(id, attorneyId, updateData){
    try{

        const updatedMember = await teamModel.findOneAndUpdate(
            { _id: id, attorneyId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return updatedMember;

    }catch(error){
        console.log(error);
        throw new ApplicationError('Something went wrong at database level', 500);
    }
}


}