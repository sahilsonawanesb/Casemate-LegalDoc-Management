// In this we are creating the client model, related stuff as follows.
import mongoose from "mongoose";
import clientSchema from "./client.schema.js";
import ApplicationError from "../../error-handler/ApplicationError.js";


// Creating the client model as follows..
export const clientModel = mongoose.model('client', clientSchema);

// clientRepository as follows..

export default class ClientRepository{


    // createClient..
    async createClient(clientDetails){
        try{

            const newClient = new clientModel(clientDetails);
            await newClient.save();
            return newClient;            

        }catch(error){
            console.log(error);
            throw new ApplicationError("Unable to create new client as follows", 500);
        }
    }

    // checking if the client already exists or mnot
    async existingClient(email, attorneyId){
        try{

           const client =  await clientModel.findOne({
                email : email.toLowerCase(),
                attorneyId
            });

            return client;

        }catch(error){
            console.log(error);
            throw new ApplicationError("Something went wrong", 500);
        }
    }

    // get all clients as follows..
    async getAllClient(attorneyId){
        
        try{

            const allClients = await clientModel.find({attorneyId})
                .sort({ createdAt : -1})
                .select('-__v');
            console.log(allClients);
            return allClients;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getClient by id..
    async getClient(id, attorneyId){

        try{

            // query.
            const client = await clientModel.findOne({_id : id, attorneyId});

            return client;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

     async getClientH(id, attorneyId){

        try{

            // query.
            const client = await clientModel.findOne({_id : id, attorneyId}).select('contactHistory');

            return client;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }


    // delete by id..
    async deleteClient(id, attorneyId){
        try{

            const client = await clientModel.findOneAndDelete({_id:id, attorneyId});

            return client;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at the database level', 500);
        }
    }

    // searchQuery..
    async searchClient(q, attorneyId){

        try{

            const clients = await clientModel.find({
                attorneyId,
                $or : [
                    {name  :{$regex:q, $options:'i'}},
                    {email :{$regex:q, $options:'i'}},
                    {phone :{$regex:q, $options:'i'}}
                ]
            }).select('__v');

            return clients;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 400);
        }
    }
}