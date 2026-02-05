
import {api} from "../api.js";


// client service so it can talked with backend as follows..
export const getAllClients = async(filters) => {
    try{
        const params = new URLSearchParams(filters);

        const response = await api.get(`/client/getAllClients?${params}`);

        return {
            success : true,
            clients : response.data.clients || []
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to Get All Clients'
        }
    }
} 

// get client by Id.
export const getClientById = async(clientId) => {
    try{

    const response = await api.get(`/client/${clientId}`);

    return {
        success : true,
        clients : response.data.clients
    }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get Specific client'
        }
    }
}

// create new client..
export const createClient = async(clientData) => {
    try{

        const response = await api.post(`/client/createClient`, clientData);

        return {
            success : true,
            client : response.data.client,
            message : response.data.message
        };

    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Failed to create new client'
        }
    }
}

// update client data.
export const updateClient = async(clientId, clientData) => {
    try{

        const response = await api.put(`/client/${clientId}`, clientData);

        // return response.data;
        return {        
            success: true,
      client: response.data.client,
      message: response.data.message
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Failed to update data'
        }
    }
}


// delete client.
export const deleteClient = async(clientId) => {
    try{

        const response = await api.delete(`/client/${clientId}`);

        return {
            success: true,
            message: response.data.message
        }

    }catch(error){
        return{
            success : false,
            message : error.response?.data.message || 'Failed to delete client',
        }
    }
}


// search client..
export const searchClient = async(searchTerm) => {
    try{
        const response = await api.get(`/client/search?q=${searchTerm}`);
        return {
            success: true,
      clients: response.data.clients || []
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Failed Search Client'
        }
    }
}

// Log client contact.
export const logContact = async(clientId, type, notes) => {
    try{

        const response = await api.post(`/client/${clientId}/contact`, {
            type,
            notes
        });

        return {
            success : true,
            response
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data.message || 'Failed to client contact'
        }
    }
}