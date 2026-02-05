import mongoose from "mongoose";
import documentSchema from "./document.schema.js";
import {caseModel} from '../case/case.repository.js';
import { clientModel } from "../client/client.model.js";
import ApplicationError from "../../error-handler/ApplicationError.js";

export const documentModel = mongoose.model('document', documentSchema);

// class document repository..
export default class DocumentRepository{

    // verify case belongs to attorney..
    async caseAttorney(id,attorneyId){
        // console.log(id);
        // console.log(attorneyId);
        try{

            const cases = await caseModel.findOne({_id:id, attorneyId});

            return cases;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // caseDocument considered as follows..
    async createDocument(details){
        try{
            const newDocument = new documentModel(details);
            await newDocument.save();

            await newDocument.populate('caseId','title caseNumber');
            await newDocument.populate('clientId','name email');

            return newDocument;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getDocuments filter..
    async getDocuments(filter){
        try{

            const documents = await documentModel.find(filter)
                    .populate('caseId', 'title caseNumber')
                    .populate('clientId', 'name email')
                    .populate('uploadeBy', 'name email')
                    .sort({createdAt : -1})
                    .select('-__v');

            return documents;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getDocument ById
    async getDocument(id, attorneyId){
        try{

            const document = await documentModel.findOne({_id:id, attorneyId})
                .populate('caseId', 'title caseNumber')
                .populate('clientId', 'name email phone')
                .populate('uploadeBy', 'name email')
                .populate('versions.uploadedBy', 'name email');

            return document;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async getDoc(id, attorneyId){
        
        try{
            const document = await documentModel.findOne({_id : id, attorneyId});
            
            return document;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async deleteDoc(id, attorneyId){
        try{

            const deleteDocument = await documentModel.findOneAndDelete({_id:id, attorneyId});

            return deleteDocument;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }

    }

    async getDocumentByCase(id, attorneyId){
        try{

            const document = await documentModel.find({caseId : id, attorneyId})
                .populate('uploadeBy', 'name email')
                .sort({createdAt:-1})
                .select('-__v')

            return document;

        }catch(error){
            console.log(error);
            return next(new ApplicationError('Something went wrong at database level', 500));
        }
    }

    async search(q,attorneyId){
        try{

    const documents = await Document.find({
      attorneyId,
      $or: [
        { documentName: { $regex: q, $options: 'i' } },
        { fileName: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .populate('caseId', 'caseTitle')
    .populate('clientId', 'name')
    .select('-__v');

    return documents;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

}