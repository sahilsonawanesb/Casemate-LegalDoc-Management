// controller function for clinet..

import ApplicationError from "../../error-handler/ApplicationError.js";
import ClientRepository from "./client.repository.js";

const clientRepository = new ClientRepository();


// controller function to create newClient..
export const createClient = async (req, res, next) => {
  try {
    const { name, email, phone, caseType, address, notes } = req.body;

    const attorneyId = req.user.id;

    // Validation
    if (!name || !email || !phone) {
      return next(new ApplicationError("Name, email and phone is required", 400));
    }

    // Check if client already exists
    const existingClient = await clientRepository.existingClient(email, attorneyId);

    if (existingClient) {
      return next(new ApplicationError("Client with this email id already exists", 409));
    }

    // Create new client object
    const newClient = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      caseType: caseType || 'Other',
      address: address || {},
      notes: notes || '',
      attorneyId
    };

    const savedClient = await clientRepository.createClient(newClient);

    // FIX: Use consistent response key name
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client: savedClient  // Changed from 'savedClient' to 'client'
    });

  } catch (error) {
    console.error('Error creating client:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return next(new ApplicationError('Client with this email id already exists', 409));
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      return next(new ApplicationError(messages, 400));
    }

    return next(new ApplicationError('Unable to create client', 500));
  }
};
// Controller function to getAll clients as follows..
export const getAllClients = async(req, res, next) => {
    try{

        const attorneyId = req.user.id;
        console.log(attorneyId);
        const clients = await clientRepository.getAllClient(attorneyId);
    

        res.status(200).json({
            success : true,
            count : clients.length,
            clients
        })

    }catch(error){
        console.log(error);
        return next(ApplicationError('Unable to fetch client', 500));
    }
}

// Controller function to getSpecific client as follows..
export const getClientById = async(req,res,next) => {
    try{

        const attorneyId = req.user.id;
        const clientId = req.params.id;
       
        const client = await clientRepository.getClient(clientId, attorneyId);
        // console.log(client);
        if(!client){
            return next(new ApplicationError('Unable to fetch User', 404));
        }

        res.status(200).json({
            success : true,
            client
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch client', 500));
    }
}

// controller function to update the specific client as follows..
export const updateClient = async(req, res, next) => {

    try{

        const id = req.params.id;
        const attorneyId = req.user.id;

        // request the information from the user that we want to update.
        const {name, email, phone, caseType, address, notes, status} = req.body;

        // Find the client to which we want to update the information..
        const client = await clientRepository.getClient(id, attorneyId);

        if(!client){
            throw next(new ApplicationError('Client not found', 404));
        }

        client.lastContact = new Date();

        // updateInfo.
        if (name) client.name = name.trim();
        if (email) client.email = email.toLowerCase().trim();
        if (phone) client.phone = String(phone).trim();
        if (caseType) client.caseType = caseType;
        if (address) client.address = { ...client.address, ...address };
        if (notes !== undefined) client.notes = notes;
        if (status) client.status = status;

        await client.save();

        res.status(200).json({
            success:true,
            message : 'Client updated successfully',
            client

        })

    }catch(error){
        console.log(error);
        if(error.code == 11000){
            return next(new ApplicationError('Email already in use', 409));
        }
        return next(new ApplicationError('Unable to update the client information', 500));
    }
}

// contoller function to delete the particular client as follows..
export const deleteClient = async(req, res, next) => {
    try{  

        const id = req.params.id;
        const attorneyId = req.user.id;

        const client = await clientRepository.deleteClient(id, attorneyId);

        if(!client){
            return next(new ApplicationError('Client not found', 404));
        }

        res.status(200).json({
            success:true,
            message : 'Client deleted Successfully',
        });
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to delete client', 500));
    }
}

// controller function to search functionality as follows..
export const searchClients = async(req, res, next) => {
    try{

        const attorneyId = req.user.id;
        const {q} = req.query;

        if(!q){
            return next(new ApplicationError('Search query is required', 400));
        }

        const clients = await clientRepository.searchClient(q,attorneyId);

        res.status(200).json({
            success:true,
            count : clients.length,
            clients
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to search clients', 500));
    }
}

// controller function to log contact/activity as follows..
export const logClientContact = async(req, res, next) => {

    try{
    const {id} = req.params;
    const attorneyId = req.user.id;
    const {type,notes} = req.body;

    if(!type){
        return next(new ApplicationError('Contact Type is required', 400));
    }

    const client = await clientRepository.getClient(id,attorneyId);

    client.lastContact = new Date();

    client.contactHistory.push({
        type,
        date : new Date(),
        notes : notes || ''
    });

    await client.save();

    res.status(200).json({
        success : true,
        message : 'Contact logged successfully',
        client
    });
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to log Contact', 500));
    } 
}

// Get Client contact history//

export const getClientHistory = async(req, res, next) => {

   try{

    const {id} = req.params;
    const attorneyId = req.user.id;

    const client = await clientRepository.getClientH(id,attorneyId);

    if(!client){
        return next(new ApplicationError('Client not found', 404));
    }

    res.status(200).json({
        success : true,
        contactHistory : client.contactHistory.sort((a,b) => b.date - a.date)
    });

   }catch(error){
    console.log(error);
    return next(new ApplicationError('Cannot fetch client history', 500));
   }
}


