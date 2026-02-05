// case reposiotory..
import Case from './case.model.js';
import ApplicationError from "../../error-handler/ApplicationError.js";
import { clientModel } from "../client/client.repository.js";


export const caseModel = Case;


export default class CaseRepository{

    // getParticular client..
    async client(id, attorneyId){
        try{
        
        const client = await clientModel.findOne({_id : id, attorneyId});
        console.log(client);
        return client;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }


    // create new case.
    async createCase(caseDetails){
        try{
            const newClient = new caseModel(caseDetails);
            newClient.save();

            newClient.populate('clientId', 'name email phone');
            return newClient;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getALlCases
    async cases(filter){
        try{

            const cases = await caseModel.find(filter)
             .populate('clientId', 'name email phone avatar')
             .sort({ createdAt: -1 })
             .select('-__v');

             console.log(cases);

        return cases;
            
        }catch(error){
            console.log(error);
            throw new ApplicationError('Unable to fetch all cases', 500);
        }
    }

    // getCaseByID.
    async getCaseById(id, attorneyId){
        try{

            const caseData = await caseModel.findOne({_id : id, attorneyId})
                .populate('clientId', 'name email phone address avatar')
                

            return caseData;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Unable to fetch the specifc case', 500);
        }
    }

    // deleteCase.
    async deleteCase(id, attorneyId){
        try{

            const caseData = await caseModel.findOneAndDelete({_id : id, attorneyId});

            return caseData;

        }catch(error){
            console.log(error);
            return next(new ApplicationError('Something went wrong at database level', 500));
        }
    }

    // clientCases
    async clientCases(id, attorneyId){
        try{

            const cases = await caseModel.find({clientId:id, attorneyId})
                .sort({createdAt:-1})
                .select('-__V');

            return cases;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async getCases(id, attorneyId){
        try{

            const cases = await caseModel.findOne({_id:id, attorneyId})
                .sort({createdAt:-1})
                .select('-__V');

            return cases;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // searchQuery
    async search(q,attorneyId){
        try{
            const attorneyObjectId = new mongoose.Types.ObjectId(attorneyId);
            const cases = await caseModel.find({
                attorneyId:attorneyObjectId,
                $or:[
                    {title : {$regex:q, $options : 'i'}},
                    {caseNumber : {$regex:q, $options : 'i'}},
                    {description : {$regex:q, $options: 'i'}},
                    {opposingParty : {$regex:q, $options : 'i'}}
                ]
            })
            .populate('clientId', 'name email')
            .select('-_V');

            return cases;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at databsae level', 500);
        }

    }

    // Stats....
    async caseStats(attorneyId){
        try{

            const caseStat = await clientModel.aggregate([

                {
                    $match : {
                        attorneyId : new mongoose.Types.ObjectId(attorneyId)
                    }
                },

                {
                    $group : {
                        _id : '$status',
                        count : {$sum : 1}
                    }
                }

            ]);

            return caseStat;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level');
        }
    }

    async priorityStats(attorneyId){
        try{

            const priorityStats = await clientModel.aggregate([
                {
                    $match:{
                        attorneyId : new mongoose.Types.ObjectId(attorneyId)
                    }
                },

                {
                    $group : {
                        _id : '$priority',
                        count : {
                            $sum : 1
                        }
                    }
                }
            ]);

            return priorityStats;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async caseTypeStats(attorneyId){
        try{
            
            const caseTypeStats = await clientModel.aggregate([
                {
                    $match : {
                        attorneyId : new mongoose.Types.ObjectId(attorneyId)
                    }
                },
                {
                    $group : {
                        _id : '$caseType',
                        count : {
                            $sum : 1
                        }
                    }
                }
            ]);

            return caseTypeStats;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async totalCases(attorneyId){
        try{

            const totalCases = await clientModel.countDocuments({attorneyId});

            return totalCases;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level');
        }
    }

}