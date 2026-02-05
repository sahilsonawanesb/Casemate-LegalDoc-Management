import {api} from "../api.js";


// document services so that it can communicate with backend services..

// get all documents with optional filters..
export const getAllDocuments = async(filters = {}) => {
    try{

        const params = new URLSearchParams();
        
        if(filters.category) params.append('category', filters.category);
        if(filters.status) params.append('status', filters.status);
        const response = await api.get(`/documents/?${params.toString()}`);

        return {
            success : true,
            documents : response.data.documents || []
        }
        
    }catch(error){
        return {
            success : false,
            message : error?.response?.data?.message || 'Unable to get All documents'
        }
    }
}

// get Documents by specific Id.
export const getDocumentsById = async(id) => {
    try{

      const response = await api.get(`/documents/${id}`);

      return {
        success : true,
        document : response.data.document
      }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get specfic tasks'
        }
    }
}


// upload documents..
export const uploadDocuments = async(formData) => {
    try{
        const response = await api.post(`/documents/upload`, formData, {
            headers : {
                'Content-Type' : 'multipart/form-data'
            }
        });

        return {
            success : true,
            documents : response.data.documents
        }
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to upload documents'
        }
    }
}

// update documents.
export const updateDocuments = async(id, data) => {
    try{

        const response = await api.put(`/documents/${id}`, data);

        return {
            success : true,
            documents : response.data.documents
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to update documents information'
        }
    }
}


// delete documents..
export const deleteDocuments = async(id) => {
    try{

        const response = await api.delete(`/documents/${id}`);

        return {
            success : true,
            documents : response.data.documents
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to delete documents'
        }
    }
}


// download documents..
export const downloadDocuments = async(id) => {
    try{
        const response = await api.get(`/documents/${id}/download`, {
            responseType : 'blob',
        });

        return {
            success : true,
            documents : response.data.documents
        }
    
    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to download documents'
        }
    }
}

// get documents by cases.
export const getDocumentsByCase = async(caseId) => {
    try{

        const response = api.get(`/documents/case/${caseId}`);

        return {
            success : true,
            documents : response.data.documents
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to get documents by cases'
        }
    }
}


// search documents..
export const searchDocuments = async(query) => {
    try{

        const response = await api.get(`/documents/search?=${encodeURIComponent(query)}`);

        return {
            success : true,
            documents : response.data.documents
        }

    }catch(error){
        return {
            success : false,
            message : error.response?.data?.message || 'Unable to search documents'
        }
    }
}


