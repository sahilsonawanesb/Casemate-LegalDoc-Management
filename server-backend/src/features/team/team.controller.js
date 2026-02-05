import ApplicationError from "../../error-handler/ApplicationError.js";
import TeamRepository from "./team.repository.js";
import teamModel from "./team.model.js";
import Task from "../task/task.model.js";
import mongoose from "mongoose";

const teamRepository = new TeamRepository();

// add new team member.
export const addMember = async(req, res, next) => {

    try{

        const { name,email,phone,role,employmentType,department,joinDate,permissions,specializations,
      address,
      emergencyContact,
      bio,
      notes,
      workSchedule
    } = req.body;

    const attorneyId = req.user.id;

    // validation.
    if(!name || !email || !role){
        return next(new ApplicationError('Name, email and role are required', 500));
    }

    const existingMem = await teamRepository.existingMember(email, attorneyId);

    if(existingMem){
        return next(new ApplicationError('Team Member with this email id already exists', 500));
    }

     const teamMember = await teamModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      attorneyId,
      role,
      employmentType: employmentType || 'Full-time',
      department,
      joinDate: joinDate || new Date(),
      status: 'Active',
      permissions: permissions || {},
      specializations: specializations || [],
      address: address || {},
      emergencyContact: emergencyContact || {},
      bio,
      notes,
      workSchedule: workSchedule || {}
    });

    
    res.status(201).json({
        success : true,
        message : 'Team member added successfully',
        teamMember
    })  

    }catch(error){
         console.error('ERROR in getAll:', error); // ← Log the actual error
        return next(new ApplicationError('Unable to add new members', 500));
    }

}

// get all team members..
// export const getAllTeamMembers = async(req, res, next) => {
//     try{

//         const {attorneyId} = req.user.id;

//         const {status, role} = req.query;

//         const filter = {attorneyId};

//         if(status) filter.status = status;
//         if(role) role.status = role;

//         const teamMembers = await teamRepository.getAllTeamMembers(filter);

//         res.status(200).json({
//             success : true,
//             count : teamMembers.length,
//             teamMembers
//         });



//     }catch(error){
//         console.log(error);
//         return next(new ApplicationError('Unable to get all team members', 500));
//     }
// }

export const getAllTeamMembers = async(req, res, next) => {
    try {
        const { status, role } = req.query;
        const attorneyId = req.user?.id;

        if(!attorneyId) {
            return next(new ApplicationError('User not authenticated', 401));
        }

        // ✅ Initialize as an OBJECT, not a string
        let filter = { attorneyId };

        // Only add status filter if it's not 'all'
        if(status && status !== 'all') {
            filter.status = status;
        }

        // Only add role filter if it's not 'all'
        if(role && role !== 'all') {
            filter.role = role;
        }

        const teamMembers = await teamModel.find(filter);

        res.status(200).json({
            success: true,
            data: teamMembers,
            count: teamMembers.length
        });

    } catch(error) {
        console.error('Error:', error);
        return next(new ApplicationError('Unable to get all team members', 500));
    }
}

// get single team member
export const getMember = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;
        
        const teamMember = await teamRepository.teamMember(id, attorneyId);

        if(!teamMember){
            return next(new ApplicationError('Team memeber not found', 404));
        }

        res.status(200).json({
            success : true,
            teamMember
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get single team member', 500));
    }
}

// update team member
// export const updateTeamMember = async(req, res, next) => {
//     try{

//         const {id} = req.params;
//         const attorneyId = req.user.id;

//         const updateData = req.body;

//         const teamMember = await teamRepository.teamMember(id, attorneyId);

//         if(!teamMember){
//             return next(new ApplicationError('Team member not found', 404));
//         }

//         const allowedFields = [
//       'name', 'email', 'phone', 'role', 'employmentType', 'department',
//       'status', 'permissions', 'specializations', 'address', 
//       'emergencyContact', 'bio', 'notes', 'workSchedule'
//     ];

//         allowedFields.forEach(field => {
//             if(updateData[field] != undefined){
//                 teamMember[field] = updateData[field];
//             }
//         });

//         teamMember.save();

//         res.status(200).json({
//             success : true,
//             message : 'Team memeber data updated successfully',
//             teamMember
//         });

//     }catch(error){
//         console.log(error);
//         return next(new ApplicationError('Unable to update team member data', 500));
//     }
// }

export const updateTeamMember = async (req, res, next) => {
    try{

        const { id } = req.params;
        const attorneyId = req.user.id;

        // ✅ Validate Mongo ID (VERY IMPORTANT)
        if(!mongoose.Types.ObjectId.isValid(id)){
            return next(new ApplicationError('Invalid team member id', 400));
        }

        const allowedFields = [
            'name', 'email', 'phone', 'role', 'employmentType', 'department',
            'status', 'permissions', 'specializations', 'address',
            'emergencyContact', 'bio', 'notes', 'workSchedule'
        ];

        // ✅ Filter update data (production habit)
        const updateData = {};

        allowedFields.forEach(field => {
            if(req.body[field] !== undefined){
                updateData[field] = req.body[field];
            }
        });

        const teamMember = await teamRepository.updateTeamMember(
            id,
            attorneyId,
            updateData
        );

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Team member data updated successfully',
            teamMember
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to update team member data', 500));
    }
};


// delete team memeber..
export const deleteMember = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        const teamMember = await teamRepository.deleteMember(id, attorneyId);

        if(teamMember){
            return next(new ApplicationError('Unable to delete the team member', 500));
        }

        await teamModel.updateMany(
            {assignedTo:id},
            {$set : {assignedTo : null }}
        )

        res.status(200).json({
            success : true,
            message : 'Team member updated successfully'
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to delete the data', 500));
    }
}

// assign case to member.
export const assignCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { caseId, role } = req.body;
    const attorneyId = req.user.id;

    if (!caseId) {
      return next(new ApplicationError('Case ID is required', 400));
    }

    // Verify team member belongs to attorney
    const teamMember = await teamModel.findOne({ _id: id, attorneyId });
    if (!teamMember) {
      return next(new ApplicationError('Team member not found', 404));
    }

    // Verify case belongs to attorney
    const caseData = await Case.findOne({ _id: caseId, attorneyId });
    if (!caseData) {
      return next(new ApplicationError('Case not found', 404));
    }

    // Check if case already assigned
    const alreadyAssigned = teamMember.assignedCases.some(
      ac => ac.caseId.toString() === caseId
    );

    if (alreadyAssigned) {
      return next(new ApplicationError('Case already assigned to this team member', 400));
    }

    // Assign case
    teamMember.assignedCases.push({
      caseId,
      assignedDate: new Date(),
      role: role || ''
    });

    teamMember.casesHandled += 1;
    await teamMember.save();

    await teamMember.populate('assignedCases.caseId', 'caseTitle caseNumber');

    res.status(200).json({
      success: true,
      message: 'Case assigned successfully',
      teamMember
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to assign case', 500));
  }
};

// Unassign case from team member
export const unassignCase = async (req, res, next) => {
  try {
    const { id, caseId } = req.params;
    const attorneyId = req.user.id;

    const teamMember = await teamModel.findOne({ _id: id, attorneyId });

    if (!teamMember) {
      return next(new ApplicationError('Team member not found', 404));
    }

    // Remove case from assigned cases
    teamMember.assignedCases = teamMember.assignedCases.filter(
      ac => ac.caseId.toString() !== caseId
    );

    await teamMember.save();

    res.status(200).json({
      success: true,
      message: 'Case unassigned successfully',
      teamMember
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to unassign case', 500));
  }
};

// Get team member workload
export const getTeamMemberWorkload = async (req, res, next) => {
  try {

    const {id} = req.params;
    const attorneyId = req.user.id;

    const teamMember = await teamModel.findOne({_id : id, attorneyId});
    
    if(!teamMember){
      return next(new ApplicationError('Team memeber not found', 404));
    }

    const assignedCasesCount = teamMember.assignedCases.length;

    const assignedTasks = await Task.find({
      assignedTo : id,
      status : {
        $nin : ['Completed', 'Cancelled']
      }
    })


    // get assigned tasks.
    const tasksByStatus = await Task.aggregate([
      {
        $match : {
          assignedTo : new mongoose.Types.ObjectId(id),
        }
      },
      {
        $group : {
          _id : 'Status',
          count : {$sum : 1}
        }
      }
    ])

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      assignedTo: id,
      dueDate: { $lt: new Date() },
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    res.status(200).json({
      success: true,
      workload: {
        teamMember: {
          name: teamMember.name,
          role: teamMember.role,
          status: teamMember.status
        },
        assignedCases: assignedCasesCount,
        assignedTasks: assignedTasks.length,
        overdueTasks,
        tasksByStatus,
        tasksCompleted: teamMember.tasksCompleted
      }
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to fetch workload', 500));
  }
};

// Get team statistics
export const getTeamStats = async (req, res, next) => {
  try {
    const attorneyId = req.user.id;

    const totalMembers = await TeamMember.countDocuments({ attorneyId });

    const activeMembers = await TeamMember.countDocuments({ 
      attorneyId, 
      status: 'Active' 
    });

    const roleStats = await TeamMember.aggregate([
      { $match: { attorneyId: new mongoose.Types.ObjectId(attorneyId) } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const employmentTypeStats = await TeamMember.aggregate([
      { $match: { attorneyId: new mongoose.Types.ObjectId(attorneyId) } },
      {
        $group: {
          _id: '$employmentType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        byRole: roleStats,
        byEmploymentType: employmentTypeStats
      }
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to fetch team statistics', 500));
  }
};

// Search team members
export const searchTeamMembers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const attorneyId = req.id;

    if (!q) {
      return next(new ApplicationError('Search query is required', 400));
    }

    const teamMembers = await TeamMember.find({
      attorneyId,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { role: { $regex: q, $options: 'i' } }
      ]
    }).select('-__v');

    res.status(200).json({
      success: true,
      count: teamMembers.length,
      teamMembers
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to search team members', 500));
  }
};
