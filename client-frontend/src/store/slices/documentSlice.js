import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteDocuments, getAllDocuments, getDocumentsByCase, getDocumentsById, searchDocuments, updateDocuments, uploadDocuments } from "../../services/attorneyServices/documentServices";


// create initial state..
const initialState = {
    documents : [],
    selectedDocument : null,
    loading : false,
    error : null,
    uploadProgress : 0,
    filters : {
        category : 'all',
        status : 'all',
        caseId : 'all'
    },
    searchQuery : '',
    searchResults : [],
    totalCount : 0
}

// create async thunk so that we can connect we backend services..

// fetch all documents..
export const fetchAllDocuments = createAsyncThunk(
    'documents/fetchAll',
    async(_, {rejectWithValue}) => {
        try{
            const data = await getAllDocuments();
            if(!data.success) return rejectWithValue(data.message);
            return data.documents;
        }catch(error){
            return rejectWithValue(
                error.response?.data.message || 'Unable to get all documents'
            )
        }
    }
);

// fetch documents by Id..
export const fetchDocumentById = createAsyncThunk(
    'documents/fetchById',
    async(documentId, {rejectWithValue}) => {
        try{
            const data = await getDocumentsById(documentId);
            return data.document;
        }catch(error){
            return rejectWithValue(
                error.response?.data.message || 'Unable to get all documents'
            )
        }
    }
);


// upload Documents.
export const uploadDocument = createAsyncThunk(
    'documents/upload',
    async(formData, {rejectWithValue}) => {
        try{
            const data = await uploadDocuments(formData);
            return data.documents;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to upload documents'
            )
        }
    }
);


// update documents.
export const updateDocument = createAsyncThunk(
    'documents/update',
    async({id, data}, {rejectWithValue}) => {
        try{
            const response = await updateDocuments(id,data);
            return response.documents;
        }catch(error){
            rejectWithValue(
                error.response?.data?.message || 'Unable to update documents'
            )
        }
    }
);

// delete documents.
export const deleteDocument = createAsyncThunk(
    'documents/delete',
    async(id, {rejectWithValue}) => {
        try{
            await deleteDocuments(id);
            return id;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to delete documents'
            )
        }
    }
);

// delete bulk documents.
export const deleteBulkDocuments = createAsyncThunk(
    'documents/deleteBulk',
    async(ids, {rejectWithValue}) => {
        try{
            await Promise.all(ids.map(id => deleteDocuments(id)));
            return ids;
        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Unable to delete all documents'
            )
        }
    }
);

// fetchDocumentsByCase.
export const fetchDocumentsByCase = createAsyncThunk(
    'documents/fetchByCase',
    async(caseId, {rejectWithValue}) => {
        try{
            const data = await getDocumentsByCase(caseId);
            return data.documents;
        }catch(error){
            return rejectWithValue(
                error?.response?.data?.message || 'Unable to fetch documents by case'
            )
        }
    }
);


// searchDocumentsByCase..
export const searchDocument = createAsyncThunk(
    'documents/search',
    async(query, {rejectWithValue}) => {
        try{
            const data = await searchDocuments(query);
            return data;

        }catch(error){
            return rejectWithValue(
                error.response?.data?.message || 'Failed to search documents'
            )
        }
    }
);


// slice..
const documentSlice = createSlice({
    'name' : 'documents',
    initialState,
    reducers : {
        setFilters : (state, action) => {
            state.filters = {...state.filters, ...action.payload};
        },
        setSearchQuery : (state, action) => {
            state.searchQuery = action.payload
        },
        clearSelectedDocument : (state) => {
            state.selectedDocument = null;
        },
        clearError : (state) => {
            state.error = null;
        },
        setUploadProgress : (state, action) => {
            state.uploadProgress = action.payload;
        },
    },

    extraReducers : (builder) => {
        builder 
        // Fetch all documents..
        .addCase(fetchAllDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllDocuments.fulfilled, (state, action) => {
            state.loading = false;
            state.documents = action.payload || [];
            state.totalCount = action.payload?.length || 0;
        })
        .addCase(fetchAllDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(fetchDocumentById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchDocumentById.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedDocument = action.payload;
        })
        .addCase(fetchDocumentById.rejected, (state) => {
            state.loading = false;
            state.error = null;
        })

        // upload documents.
        .addCase(uploadDocument.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(uploadDocument.fulfilled, (state, action) => {
            state.loading = false;
            state.documents.push(action.payload);
            state.totalCount += 1;
            state.uploadProgress = 0;
        })

        .addCase(uploadDocument.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.uploadProgress = 0;
        })

        // update document
        .addCase(updateDocument.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(updateDocument.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.documents.findIndex(
                doc => doc._id === action.payload.document._id
            );

            if(!index){
                state.documents[index] = action.payload.document;
            }

            if(state.selectedDocuments?._id === action.payload.document._id){
                state.selectedDocument = action.payload.document;
            }
        })

        .addCase(updateDocument.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // deleteDocuments..
        .addCase(deleteDocument.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(deleteDocument.fulfilled, (state, action) => {
            state.loading = false;
            state.documents = state.documents.filter(doc => doc._id !== action.payload);
            state.totalCount -= 1;
            if(state.selectedDocuments?._id === action.payload){
                state.selectedDocument = null;
            }
        })

        .addCase(deleteDocument.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Delete bulk inserts...
        .addCase(deleteBulkDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(deleteBulkDocuments.fulfilled, (state, action) => {
            state.loading = false;
            state.documents = state.documents.filter(
                doc => !action.payload.includes(doc._id)
            );
            state.totalCount -= action.payload.length;
        })

       .addCase(deleteBulkDocuments.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})
    
        // Fetch documents by case
      .addCase(fetchDocumentsByCase.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents || [];
        state.totalCount = action.payload.count || 0;
      })
      
      // Search documents
      .addCase(searchDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.documents || [];
      })
      .addCase(searchDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    }
});

export const {
    setFilters,
    setSearchQuery,
    setSelectedDocument,
    clearSelectedDocument,
    clearError,
    setUploadProgress
} = documentSlice.actions;

export default documentSlice.reducer;

// export all selectors..
export const selectAllDocuments = (state) => state.documents.documents;
export const selectSelectedDocument = (state) => state.documents.selectedDocument;
export const selectDocumentsLoading = (state) =>  state.documents.loading;
export const selectDocumentsError = (state) => state.documents.error;
export const selectFilters = (state) => state.documents.filters;
export const selectSearchQuery = (state) => state.documents.searchQuery;
export const selectSearchResults = (state) => state.documents.searchResults;
export const selectTotalCount = (state) => state.documents.totalCount;
export const selectUploadProgress = (state) => state.documents.uploadProgress;


