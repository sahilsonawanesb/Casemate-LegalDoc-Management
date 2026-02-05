// upload / create document.
import ApplicationError from "../../error-handler/ApplicationError.js";
import  DocumentRepository  from "./document.repository.js";
import fs from 'fs';

const documentRepository = new DocumentRepository();


// getAll documents..
export const getAllDocuments = async(req, res, next) => {

    try{

        const attorneyId = req.user.id;
        const {category, status} = req.query;

        const filter = {attorneyId};
        if(category) filter.category = category;
        if(status) filter.status = status;


        const documents = await documentRepository.getDocuments(filter);

        res.status(200).json({
            success : true,
            count : documents.length,
            documents
        });

    }catch(error){
        console.log(error);

        return next(new ApplicationError('Unable to get all documents', 500));
    }

}

// getDocuments by Id..
export const getDocumentById = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;


        const document = await documentRepository.getDocument(id, attorneyId);

        if(!document){
            return next(new ApplicationError('Document Not found', 404));
        }

        res.status(200).json({
            success : true,
            document : document
        })


    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch documents by id', 500));
    }
}

// updateDocuments.
export const updateDocument = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const {documentName, category, status, description, tags, isConfidential, documentDate, notes} = req.body;

        
        const document = await documentRepository.getDoc(id,attorneyId);

        if(!document){
            return next(new ApplicationError('Document not found', 404));
        }

        if (documentName) document.documentName = documentName.trim();
        if (category) document.category = category;
        if (status) document.status = status;
        if (description !== undefined) document.description = description;
        if (tags) document.tags = tags.split(',').map(tag => tag.trim());
        if (isConfidential !== undefined) document.isConfidential = isConfidential;
        if (documentDate) document.documentDate = documentDate;
        if (notes !== undefined) document.notes = notes;

        await document.save();
        await document.populate('caseId', 'title caseNumber');
        await document.populate('clientId', 'name email');

        res.status(200).json({
            success : true,
            message : 'Document updated successfully',
            document
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unbale to update documents informations', 500));
    }
}

// upload documents 
export const uploadDocument = async(req, res,next) => {
    try{

        const {
            documentName,
            caseId,
            category,
            status,
            description,
            tags,
            isConfidential,
            documentDate,
            notes
        } = req.body;

        const attorneyId = req.user.id;
        const file = req.file;

       
        // validation.
        if(!description || !caseId || !category){
            return next(new ApplicationError('Description, case and category is required', 400));
        }

        if(!file){
            return next(new ApplicationError('Please Upload file', 400));
        }

        // verifying case belongs to attorney.
        const caseData = await documentRepository.caseAttorney(caseId,attorneyId);

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        const clientId = caseData.clientId;

        const newDocument = {
            documentName: documentName.trim(),
            fileName: file.originalname,
            fileSize: file.size,
            fileType: file.mimetype,
            filePath: file.path,
            fileUrl: `/uploads/${file.filename}`, // adjust based on your setup
            caseId,
            clientId,
            attorneyId,
            category,
            status: status || 'Draft',
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            isConfidential: isConfidential === 'true',
            documentDate: documentDate || new Date(),
            notes,
            uploadeBy: attorneyId,
      versions: [{
        versionNumber: 1,
        fileName: file.originalname,
        filePath: file.path,
        uploadedBy: attorneyId,
        uploadedAt: new Date()
      }]
        }

        const savedDocument = await documentRepository.createDocument(newDocument);

        res.status(201).json({
            success : true,
            message : 'Document uploaded successfully',
            savedDocument
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to upload documents', 500));
    }
}

// delete documents.
export const deleteDocument = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const document = await documentRepository.getDoc(id, attorneyId);
        // console.log(document);
        if(!document){
            return next(new ApplicationError('Document not found', 404));
        }

        if(fs.existsSync(document.filePath)){
            fs.unlinkSync(document.filePath);
        }

        document.versions.forEach(version => {
            if(fs.existsSync(version.filePath)){
                fs.unlinkSync(version.filePath);
            }
        });

        const documentData = await documentRepository.deleteDoc(id, attorneyId);

        res.status(200).json({
            success : true,
            message : 'Document deleted successfully',
            documentData
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to delete documents', 500));
    }
}


// download document by case.
export const downloadDocuments = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id

        const document = await documentRepository.getDoc(id, attorneyId);

        if(!document){
            return next(new ApplicationError('Document not found', 404));
        }

        if(!fs.existsSync(document.filePath)){
            return next(new ApplicationError('File not found on server', 404));
        }

        res.download(document.filePath, document.fileName);

        // res.status(200).json({
        //     success : true,
        //     message : 'File Download Successfully'
        // });


    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to download the documents', 500));
    }
}


// get document by case.
export const getDocumentByCase = async(req, res, next) => {
    try{
        
        const {id} = req.params;
        const attorneyId = req.user.id;


        const caseData = await documentRepository.caseAttorney(id, attorneyId);

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        const documents = await documentRepository.getDocumentByCase(id, attorneyId);

        res.status(200).json({
            success : true,
            count : documents.length,
            documents
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch docments by case', 500));
    }
}

// search document functionality.
export const searchDocuments = async(req, res, next) => {
    try{

        const {q} = req.query;
        const attorneyId = req.user.id;

        if(!q){
            return next(new ApplicationError('Search query is required', 500));
        }

        const documents = await documentRepository.search(q,attorneyId);

        res.status(200).json({
            success:true,
            count : documents.length,
            documents
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to search for documents', 500));
    }
}