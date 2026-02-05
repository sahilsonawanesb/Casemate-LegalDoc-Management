import CaseRepository from "./case.repository.js";
import ApplicationError from "../../error-handler/ApplicationError.js";
import mongoose from "mongoose";

const caseRepository = new CaseRepository();



// createCase controller function
export const createCase = async(req, res, next) => {
    try{
        const {
      title,
      clientId,
      caseType,
      priority,
      status,
      courtName,
      courtDate,
      courtDescription,
      opposingParty,
      opposingCounsel,
      description,
      notes,
      filingDate,
      billingRate,
      estimatedValue,
      tags
    } = req.body;


    const attorneyId = req.user.id;

    if(!title || !clientId || !caseType){
        return next(new ApplicationError('Case Title, client and case type is required'), 400);
    }

    if(!mongoose.Types.ObjectId.isValid(clientId)){
        return next(new ApplicationError('Invalid client Id', 400));
    }
     
    const client = await caseRepository.client(clientId,attorneyId);
    console.log(client);
   
    if(!client){
        return next(new ApplicationError('Client not found or does not belong to you', 404));
    }

    // now create new client..
    const newCase = {
        title : title.trim(),
        clientId,
        attorneyId,
        caseType,
        priority : priority || 'Medium',
        status : status || 'Active',
        courtName,
        courtDate,
        courtDescription,
        opposingParty,
        opposingCounsel : opposingCounsel || {},
        description,
        notes,
        filingDate : filingDate || new Date(),
        billingRate,
        estimatedValue,
        tags : tags || []
    }

    const savedCase = await caseRepository.createCase(newCase);

    res.status(201).json({
        success : true,
        message : 'Case created successfully',
        case : savedCase
    })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to create new case', 500));
    }
}

// getAll clients controller function
export const getAllCases = async(req, res, next) => {

    try{

        const attorneyId = req.user.id;
        const {status, priority, search} = req.query;
        
        
        // Build filter.
        const filter = {attorneyId};
        if(status) filter.status = status;
        if(priority) filter.priority = priority;
        if(search) {
            filter.$or = [
                { caseTitle: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];

        }
        const cases = await caseRepository.cases(filter);

        res.status(200).json({
            success : true,
            count : cases.length,
            cases
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch the cases', 500));
    }
}


// getCases by id
export const getCasesById = async(req, res, next) => {

    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        console.log(id);
        const caseData = await caseRepository.getCaseById(id, attorneyId);

        

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        res.status(200).json({
            success : true,
            case : caseData
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch case', 500));
    }
}

// update Case datils
export const updateCaseData = async(req, res, next) => {

    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const updateData = req.body;

        const caseData = await caseRepository.getCaseById(id, attorneyId);

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        const allowedFields = [
      'title', 'caseType', 'priority', 'status', 
      'courtName', 'courtDate', 'courtDescription',
      'opposingParty', 'opposingCounsel', 'description', 'notes',
      'filingDate', 'closingDate', 'nextHearingDate',
      'billingRate', 'estimatedValue', 'tags'
    ];

        allowedFields.forEach(field => {
            if(updateData[field] !== undefined){
                caseData[field] = updateData[field];
            }
        });

        await caseData.save();
        await caseData.populate('clientId', 'name email phone');

        res.status(200).json({
            success:true,
            message : 'Case Updates Successfully',
            case : caseData
        
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to update the case information', 500));
    }
}

// delete Case
export const deleteCase = async(req, res, next) => {

    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const caseData = await caseRepository.deleteCase(id, attorneyId);

        if(!caseData){
            return next(new ApplicationError('Cases not found', 404));
        }

        res.status(200).json({
            success : true,
            message : 'Case delete successfully'
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to delete case', 500));
    }
}

// getCases by Id
export const getCasesByClient = async(req, res, next) => {

    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const client = await caseRepository.client(id, attorneyId);

        if(!client){
            return next(new ApplicationError('Client not found', 404));
        }

        // console.log(client);

        // then find case by client and attorney.
        const cases = await caseRepository.clientCases(id,attorneyId);
        
        console.log(cases);
        if(!cases){
            return next(new ApplicationError('Cases not found for this client',404));
        }

        res.status(200).json({
            success:true,
            totalCases : cases.length,
            cases
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch cases', 500));
    }
}

// Add activity/note to cases..
export const addActivityNotes = async(req, res, next) => {

    try{

     const {id} = req.params;
     const attorneyId = req.user.id;
     const {type, description} = req.body;
     
    //  console.log(description);
     if(!type || !description){
        return next(new ApplicationError('Activity/Notes type and description is required'), 500);
     }

     const cases = await caseRepository.getCases(id, attorneyId);
     console.log(cases);
     if(!cases){
        return next(new ApplicationError('Case not found', 500));
     }

    
      cases.activities = cases.activities || [];
     cases.activities.push({
        type,
        description,
        date: new Date(),
        createdBy : attorneyId
    });

    await cases.save();

    res.status(200).json({
        success:true,
        message : 'Activity added successfully',
        case : cases
    })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to add ner activity/notes to case'), 500);
    }
}

// Search cases..
export const search = async(req, res, next) => {

    try{

        const {q} = req.query;
        const attorneyId = req.user.id;

        if(!q){
            return next(new ApplicationError('Search query is required', 500));
        }

        const cases = await caseRepository.search(q,attorneyId);

        res.status(200).json({
            success : true,
            count : cases.length,
            cases
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to search cases', 500));
    }
}

// DashBoard stats..
export const getDashBoardStats = async(req, res, next) => {

    try{

        const attorneyId = req.user.id;

        // get cases stats by status..
        const caseStats = await caseRepository.caseStats(attorneyId);
        const priorityStats = await caseRepository.priorityStats(attorneyId);
        const caseTypeStats = await caseRepository.caseTypeStats(attorneyId);
        const totalCases = await caseRepository.totalCases(attorneyId);


        const statusBreakdown = {
        total: totalCases,
        active: 0,
        pending: 0,
        onHold: 0,
        closed: 0,
        won: 0,
        lost: 0
    };

    caseStats.forEach(stat => {
        const status = stat._id.toLowerCase().replace(' ','');
        if(status === 'active') statusBreakdown.active = stat.count;
        else if(status === 'pending') statusBreakdown.pending = stat.count;
        else if(status === 'onHold') statusBreakdown.onHold = stat.count;
        else if(status === 'closed') statusBreakdown.status = stat.count;
        else if(status === 'won') statusBreakdown.won = stat.count;
        else if(status === 'lost') statusBreakdown.lost = stat.lost;
    });

    const priorityBreakdown = { urgent: 0, high: 0, medium: 0, low: 0 };

    priorityStats.forEach(stat => {
      const priority = stat._id.toLowerCase();
     priorityBreakdown[priority] = stat.count;
    });

    res.status(200).json({
  success: true,
  stats: {
    cases: statusBreakdown,
    priority: priorityBreakdown,
    caseTypes: caseTypeStats,
    // clients: { total: totalClients, active: activeClients.length },
    // upcomingCourtDates
  }
});

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get stats', 500));
    }
}
 