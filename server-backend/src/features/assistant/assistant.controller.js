import ApplicationError from "../../error-handler/ApplicationError.js";
import teamModel from "../team/team.model.js";
import Case from "../case/case.model.js";
import Task from "../task/task.model.js";
import { documentModel } from "../documents/document.repository.js";
import { clientModel } from "../client/client.repository.js";
import fs from "fs";


// Get's assistant's task's.
export const getAssignedCases = async(req, res, next) => {
    try{

        const id = req.user.id;

        const {status, priority} = req.query;

        const teamMember = await teamModel.findOne({_id : id, status:'Active'});

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const assignedCasesId = await teamModel.assignedCases.map(ac => ac.caseId);

        // Build filter
        const filter = {_id: {$in: assignedCasesId}};
        if(status) filter.status = status;
        if(priority) filter.priority = priority;

        const cases = await Case.find(filter)
            .populate('clientId', 'name email phone')
            .populate('attorneyId', 'name email')
            .populate({createdAt : -1})
            .select('-__v');

        res.status(200).json({
            success : true,
            count : cases.length,
            cases
        })




    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get assigned cases'));
    }
}

// Get cases by Id.
export const getCasesById = async(req, res, next) => {
    try{

       const {id} = req.params;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({_id, userId, status:'Active'});

        if(!teamMember){
            return next(new ApplicationError('Unable to find team member', 404));
        }

        // check if cases is assigned to this team member.
        const assignedCasesIds = teamMember.map(ac => ac.caseId.toString());

         if (!assignedCasesIds.includes(id)) {
         return next(new ApplicationError('You do not have access to this case', 403));
         }

         const caseData = await  Case.findById(id)
            .populate('clientId', 'name email phone address')
            .populate('attorneyId', 'name email')
            .populate('activites.createdBy', 'name email')

        if(!caseData){
            return next(new ApplicationError('Cases not found', 404));
        }

        return res.status(200).json({
            success : true,
            case : caseData
        });



    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get specific cases', 500));
    }
}

// get my assigned Tasks cases by Id.
export const getMyAssignedTasks = async(req, res, next) => {
try{

    const userId = req.user.id;
    const {status, priority, startDate, endDate} = req.query;

    const teamMemeber = await teamModel.findOne({_id : userId, status : 'Active'});

    if(!teamMemeber){
        return next(new ApplicationError('TeamMember not found', 404));
    }

    const filter = {
        assignedTo : teamMemeber._id
    }

    if(status) filter.status = status;
    if(priority) filter.priority = priority;

    if(startDate || endDate){
        filter.dueDate = {};
        if(startDate) filter.dueDate.$gte = new Date(startDate);
        if(endDate) filter.startDate.$lte = new Date(endDate);
    }

    const tasks = await Task.find(filter)
        .populate('caseId', 'title caseNumber')
        .populate('clientId', 'name email')
        .populate('createdBy', 'name email')
        .sort({dueDate : 1, priority : -1})
        .select('-__V');

    res.status(200).json({
        success : true,
        count : tasks.length,
        tasks
    })


}catch(error){
    console.log(error);
    return next(new ApplicationError('Unable to fetch assigned tasks', 500));
}
}

// Get Today's Tasks.
export const getTodaysTasks = async(req, res, next) => {
    try{

        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999);

        const tasks = await Task.find({
            assignedTo : teamMember._id,
            dueDate : {
                $gte : startOfDay,
                $lte : endOfDay
            },
            status : {
                $ne : 'Completed'
            }
        })
        .populate('caseId', 'title')
        .populate('clientId', 'name')
        .sort({dueTime : 1, priority : -1});

        res.status(200).json({
            success : true,
            count : tasks.length,
            tasks
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get Todays Tasks', 500));
    }
}

// mark Tasks as completed.
export const completeTask  = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }


        const tasks = await Task.findOne({
            _id : id,
            assignedTo : teamMember._id,
        });

        if(!tasks){
            return next(new ApplicationError('Tasks not found or Tasks is not assigned to you', 404));
        }

        // Mark Tasks as completed.
        await tasks.markTasksAsCompleted();

        teamMember.tasksCompleted += 1;
        await teamMember.save();

        res.status(200).json({
            success : true,
            message : 'Tasks mark as completed',
            tasks
        });


    }catch(error){
        console.log(error);
        return next('Unable to mark tasks as completed', 500);
    }
}

// update Tasks
export const updateTasks = async(req, res, next) => {
    try{

        const {id} = req.params;
        const {status, notes} = req.body;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found'));
        }

        const task = await Task.findOne({
            _id : id,
            assignedTo : teamMember._id
        });

        if(!task){
            return next(new ApplicationError('Tasks not found or not assigned to you', 404));
        }

        if(status) task.status = status;
        if(notes) task.notes = notes;

        await task.save();

        res.status(200).json({
            success : true,
            message : 'Tasks updated successfully',
            tasks
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to update Tasks Feilds', 500));
    }
}

// get dcouements for assigned cases.
export const getMyDocuments = async(req, res, next) => {
    try{

        const userId = req.user.id;
        const {category, status} = req.body;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        // get assigned cases ID.
        const assignedCasesIds = teamMember.assignedCases.map(ac => ac.caseId);

        // build filter.
        const filter = {
            caseId : {
                $in : assignedCasesIds
            }
        };

        if(category) filter.category = category;
        if(status) filter.status = status;

        const documents = await documentModel.find(filter)
            .populate('caseId', 'title caseNumber')
            .populate('clientId', 'name email')
            .populate('uploadedBy', 'name email')
            .sort({createdAt : -1})
            .select('-__v');
        
        res.status(200).json({
            success : true,
            count : documents.length,
            documents
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get documents', 500));
    }
}

// upload documents if permission.
export const uploadDocuments = async(req, res, next) => {
    try{

        const {documentName,caseId,category,status,description, tags,notes} = req.body;

        const file = req.file;

        const userId = req.user.id;

        if(!documentName || !caseId || !category){
            return next(new ApplicationError('Document name, case and category are required', 400));
        }

        if(!file){
            return next(new ApplicationError('Please upload a file'));
        }

        const teamMember = await teamModel.findOne({_id : userId, status : 'Active'});

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        if(!teamMember.permission.canUploadDocuments){
            return next(new ApplicationError('You do not have permission to upload the documents', 403));
        }

         const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId.toString());
    
        if (!assignedCaseIds.includes(caseId)) {
            return next(new ApplicationError('You can only upload documents for your assigned cases', 403));
         }

         if(!caseData){
            return next(new ApplicationError('Cases not found', 404));
         }

            // Create document
    const document = await Document.create({
      documentName: documentName.trim(),
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      filePath: file.path,
      fileUrl: `/uploads/${file.filename}`,
      caseId,
      clientId: caseData.clientId,
      attorneyId: caseData.attorneyId,
      category,
      status: status || 'Draft',
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      notes,
      uploadedBy: teamMember._id,
      versions: [{
        versionNumber: 1,
        fileName: file.originalname,
        filePath: file.path,
        uploadedBy: teamMember._id,
        uploadedAt: new Date()
      }]
    });


    await document.populate('caseId', 'title caseNumber');
    await document.populate('clientId', 'name email');

    res.status(200).json({
        success : true,
        message : 'Document uploaded',
        document
    });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to download documents', 500));
    }
} 

// get clients from assigned cases.
export const getMyClients = async(req, res, next) => {
    try{

        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        // get assigned casesId's
        const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId);

        // get client Id's
        const cases = await Case.find({
            _id : {$in : assignedCaseIds}
        }).select('clientId');

        const clientIds = [...new Set(cases.map(c => c.clientId.toString()))];

        const clients = await clientModel.find({
            _id : {$in : clientIds},
        }).select('-__v');

        res.status(200).json({
            success : true,
            count : clients.length,
            clients
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get clients', 500));
    }
}

// Get assistant dashboard statistics
export const getMyDashboardStats = async (req, res, next) => {
    const userId = req.user.id;
  try {
    const teamMember = await teamModel.findOne({ 
      _id : userId,
      status: 'Active'
    });

    if (!teamMember) {
      return next(new ApplicationError('Team member profile not found', 404));
    }

    // Assigned cases count
    const assignedCasesCount = teamMember.assignedCases.length;

    // Assigned tasks
    const totalTasks = await Task.countDocuments({ 
      assignedTo: teamMember._id 
    });

    const completedTasks = await Task.countDocuments({ 
      assignedTo: teamMember._id,
      status: 'Completed'
    });

    const pendingTasks = await Task.countDocuments({ 
      assignedTo: teamMember._id,
      status: 'Pending'
    });

    const overdueTasks = await Task.countDocuments({
      assignedTo: teamMember._id,
      dueDate: { $lt: new Date() },
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    // Today's tasks
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTasks = await Task.countDocuments({
      assignedTo: teamMember._id,
      dueDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'Completed' }
    });

    res.status(200).json({
      success: true,
      stats: {
        assignedCases: assignedCasesCount,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          overdue: overdueTasks,
          today: todayTasks
        },
        performance: {
          tasksCompleted: teamMember.tasksCompleted,
          casesHandled: teamMember.casesHandled
        }
      }
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to fetch dashboard statistics', 500));
  }
};

// Get my profile (team member details)
export const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const teamMember = await teamModel.findOne({ 
        _id : userId
    })
    .populate('assignedCases.caseId', 'caseTitle caseNumber status')
    .populate('attorneyId', 'name email phone');

    if (!teamMember) {
      return next(new ApplicationError('Team member profile not found', 404));
    }

    res.status(200).json({
      success: true,
      profile: teamMember
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to fetch profile', 500));
  }
};

// get documents by specific client.
export const getDocumentByClient = async(req, res, next) => {
    try{

        const {clientId} = req.params;
        const {status, category} = req.query;
        const id = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : id,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId);
        const cases = await Case.find({ 
            _id: { $in: assignedCaseIds },
            clientId 
            });
        
        if(cases.length === 0){
            return next(new ApplicationError('You dont have access to this clients documents', 403));
        }

        // get cases for specifc clients..
        const clientCaseIds = cases.map(c => c._id);


        const filter = {
            caseId : {
                $in : clientCaseIds,
                clientId
            }
        };

        if(category) filter.category = category;
        if(status) filter.status = status;

        const documents = await Document.find(filter)
            .populate('caseId', 'title caseNumber')
            .populate('uploadedBy', 'name email role')
            .sort({createdAt : -1})
            .select('-__v')
        
        res.status(200).json({
            success : true,
            count : documents.length,
            documents
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get Documents by clients', 500));
    }
}

// download documents..
export const downloadDocuments = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team Member not found', 404));
        }

        const document = await documentModel.findById(id);

        if(!document){
            return next(new ApplicationError('Document not found', 404));
        }

        // Check if document belongs to an assignedCases..
        const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId.toString());

        if(!assignedCaseIds.includes(document.caseId.toString())){
            return next(new ApplicationError('You dont have access to this document', 403));
        }

        // check if file exists or not.
        if(!fs.existsSync(filePath)){
            return next(new ApplicationError('File not found', 404));
        }
        res.download(document.filePath, document.fileName);
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to download documents', 500));
    }
}

// delete document..
export const deleteDocuments = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team memeber not found', 404));
        }

        // check if teamMember has permission to delete the document
        if(!teamMember.permissions.canEditDocuments && !teamMember.permissions.canUploadDocuments){
            return next(new ApplicationError('You do not have permission to delete document'), 403);
        }

        const document = await documentModel.findById(id);

        if(!document){
            return next(new ApplicationError('Document not found', 404));
        }

        // check document belongs to assigned cases..
    const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId.toString());
    
    if (!assignedCaseIds.includes(document.caseId.toString())) {
      return next(new ApplicationError('You can only delete documents from your assigned cases', 403));
    }

    // Only allow deletion of documents uploaded by this assistant
    if (document.uploadeBy.toString() !== teamMember._id.toString()) {
      return next(new ApplicationError('You can only delete documents you uploaded', 403));
    }

    // delete file from storage.
    if(fs.existsSync(document.filePath)){
        fs.unlinkSync(document.filePath);
    }

    await document.findByIdAndDelete(id);

    res.status(200).json({
        success : true,
        message : 'Document deleted successfully',
    });

    }catch(error){
        console.log(error);
        return next('Unable to delete document', 500);
    }
}

// search documents..
export const search = async(req, res, next) => {
    try{

        const {q} = req.query;
        const userId = req.user.id;

        if(!q){
            return next(new ApplicationError('Search query is required', 400));
        }

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        // get assigned cases Id's
        const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId);

        const documents = await documentModel.find({
            caseId : {
                $in : assignedCaseIds
            },
            $or : [
                {documentName : {$regex:q, $options : 'i'}},
                {fileName : {$regex:q, $options : 'i'}},
                {description : {$regex:q, $options:'i'}},
                {tags : {$in : [new RegExp(q, 'i')]}}
            ]
        })
        .populate('caseId', 'title')
        .populate('clientId', 'name')
        .populate('uploadedBy', 'name email role')
        .select('-__v');
        
    res.status(200).json({
        success : true,
        count : documents.length,
        documents
    });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to find documents', 500));
    }
}

// getDocumentStats..
export const getDocumentStats = async(req, res, next) => {
    try{

        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const assignedCaseIds = teamMember.assignedCases.map(ac => ac.caseId);

        // count totalDocuments in assignedCases..
        const totalDocuments = await documentModel.countDocuments({
            caseId : assignedCaseIds
        });

        // Documents uploaded by this assistant.
        const uploadedMyMe = await documentModel.countDocuments({
            uploadeBy : teamMember._id
        });

        // Recent Documents..
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentDocuments = await documentModel.countDocuments({
            caseId : {
                $in : assignedCaseIds
            },
            createdAt : {
                $gte : sevenDaysAgo
            }
        });

        // document by category..
        const categoryStats = await documentModel.aggregate([
            {
                $match : {
                    caseId : {
                        $in : assignedCaseIds
                    }
                },

                $group : {
                    _id : '$catgeory',
                    count : { $sum : 1}
                }
            }
        ]);

        res.status(200).json({
            success : true,
            stats : {
                totalDocuments,
                uploadedMyMe,
                recentDocuments,
                categoryStats
            }
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get documents stats', 500));
    }
}