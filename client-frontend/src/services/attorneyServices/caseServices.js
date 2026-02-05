import {api} from "../api.js";


// case services so that it can communicate with backend.

// get all cases..
export const getAllCases = async() => {
    try{

        const response = await api.get('cases/getAllCases');

        return {
            success : true,
            cases : response.data.cases || []
        }
        
    }catch(error){
        return {
            success : true,
            message : error.message?.data?.message || 'Unable to get all cases'
        }
    }
}

// client specific api calling..
// get all clients.
export const getAllClients = async() => {
    try{

        const response = await api.get('/client/getAllClients');

        return {
            success : true,
            clients : response.data.cases
        }

    }catch(error){
        return{
            success:false,
            message : error.response?.data?.message || 'Unable to get all cases'
        }
    }
}

// get specific cases..
export const getCaseById = async(caseId) => {
    try{

        const response = await api.get(`/cases/${caseId}`);

        return {
            success : true,
            cases : response.data.cases
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get specfic case'
        }
    }
}

// create new cases..
export const createCases = async(caseData) => {
    try{
        const response = await api.post('/cases/create-case', caseData);

        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to create new case'
        }
    }
}

// update cases..
export const updateCases = async(caseId, caseData) => {
    try{

        console.log("UPDATE CASE DATA:-", caseData);
        console.log("CASE ID:-", caseData.caseId);

        if(!caseId){
            throw new Error('Case Id is missing');
        }

        const response = await api.put(`/cases/${caseId}`, caseData);

        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }
        
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update case details'
        }
    }
}

// delete cases..
export const deletCases = async(caseId) => {
    try{
        
        const response = await api.delete(`/cases/${caseId}`)

        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to delete case'
        }
    }
}

// get Cases by Client..
export const getCasesByClients = async(clientId) => {
    try{
        const response = await api.get(`/cases/client/${clientId}`);

        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }
    }catch(error){
        return{
            success : false,
            message : error.response?.data?.message || 'Unable to get cases by client'
        }
    }
}

// add activity to cases
export const addCaseActivitys = async(caseId, activityData) => {
    try{

        const response = await api.post(`/cases/${caseId}/activity`, activityData);

        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }
    
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to add case activity'
        }
    }
}

// search for cases..
export const searchCases = async(searchTerm) => {
    try{

        const response = await api.get(`/cases/search?q=${searchTerm}`);
        return {
            success : true,
            cases : response.data.cases,
            message : response.data.message
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message
        }
    }
}

// get Cases stats..
export const getCaseStats = async() =>{
    try{
        const response = await api.get('/cases/stats');
        return {
            success : true,
            message : response.data.message
        }
    }catch(error){
        return {
            success : false,
            message :  error.response?.data?.message || 'Unable to get s'
        }
    }
}