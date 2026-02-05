// consider the following example as follows..
import express from "express";
import {upload} from "../middleware/upload.middleware.js";
import { deleteDocument, downloadDocuments, getAllDocuments, getDocumentByCase, getDocumentById, updateDocument, uploadDocument } from "../features/documents/document.controller.js";

const documentRouter = express.Router();


// getAll Documents..
documentRouter.get('/', (req, res, next) => {
    getAllDocuments(req,res,next);
});

// getDocuments By id..
documentRouter.get('/:id', (req, res, next) => {
    getDocumentById(req, res, next);
});

// download documents...
documentRouter.get('/:id/download', (req, res, next) => {
    downloadDocuments(req, res, next);
});

// getDocumentByCase..
documentRouter.get('/case/:id', (req, res, next) => {
    getDocumentByCase(req, res, next);
})

// upload documents.
documentRouter.post('/upload', upload.single('file'), (req, res, next) => {
    console.log("Body =>", req.body);
    console.log("File =>", req.file);
    uploadDocument(req, res, next);
});


// updateDocument Meta information
documentRouter.put('/:id', (req, res, next) => {
    updateDocument(req, res, next);
});

// deleteDocument by id...
documentRouter.delete('/:id', (req, res, next) => {
    deleteDocument(req, res, next);
});



export default documentRouter;


