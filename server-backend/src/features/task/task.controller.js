// Controller function for createing new tasks as follows..
import mongoose from "mongoose";
import ApplicationError from "../../error-handler/ApplicationError.js";
import TaskRepository from "./task.repository.js";
import Task from './task.model.js';


const taskRepository = new TaskRepository();

// create task..
export const createTask = async(req, res, next)=>{

    try{

        const {
      title,
      description,
      caseId,
      taskType,
      priority,
      dueDate,
      dueTime,
      reminderEnabled,
      reminderDate,
      location,
      notes,
      tags,
      subtasks,
      assignedTo
    } = req.body;

    const attorneyId = req.user.id;

    if(!title || !dueDate){
        return next(new ApplicationError('Title and Due Date is required', 500));
    }

    let clientId = null;
    console.log(caseId);

    if(caseId && !mongoose.Types.ObjectId.isValid(caseId)){
        return next(new ApplicationError('Invalid caseId format', 400));
    }

    if(caseId){

        const caseData = await taskRepository.getCase(caseId, attorneyId);

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        clientId = caseData.clientId;
    }


    const newTask = {
        title : title.trim(),
        description,
        attorneyId,
        caseId : caseId || null,
        clientId,
        assignedTo : assignedTo || null,
        taskType : taskType || 'Other',
        priority : priority || 'Medium',
        status : 'Pending',
        dueDate: new Date(dueDate),
      dueTime,
      reminderEnabled: reminderEnabled || false,
      reminderDate: reminderDate ? new Date(reminderDate) : null,
      location,
      notes,
      tags: tags || [],
      subtasks: subtasks || [],
      createdBy: attorneyId
    }

    // create task..
    const task = await taskRepository.createTask(newTask);

    res.status(200).json({
        success : true,
        message : 'Task created successfully',
        task
    })


    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to create new task', 500));
    }
}

// getAll tasks..
export const getAllTasks = async(req, res, next) => {

    try{

        // consider the following code as follows..
        const attorneyId = req.user.id;
        const {status, priority, caseId, startDate, dueDate} = req.query;

        const filter = {attorneyId};
        if(status) filter.status = status;
        if(priority) filter.priority = priority;
        if(caseId) filter.caseId = caseId;

        if(startDate || dueDate){
            filter.dueDate = {};
            if(startDate) filter.dueDate.$gte = new Date(startDate);
            if(dueDate) filter.dueDate.$lte = new Date(dueDate);
        }

        const tasks = await taskRepository.getAllTasks(filter);

        res.status(200).json({
            success : true,
            counts : tasks.length,
            tasks
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch all tasks', 500));
    }
}

// getSingle Tasks..
export const getSingleTask = async(req, res, next) => {
    try{

        const {id} = req.params;
        const attorneyId = req.user.id;

        // console.log(id);
        // console.log(attorneyId);
        const task = await taskRepository.getTask(id, attorneyId);

        if(!task){
            return next(new ApplicationError('Task not found', 404));
        }

        res.status(200).json({
            success : true,
            task
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch specific tasks', 500));
    }

}

// update Tasks..
// export const updateTasks = async(req, res, next) => {

//     try{

//         const {id} = req.params;
//         const attorneyId = req.user.id;
//         const updateData = req.body;

//         const task = await taskRepository.getTask(id, attorneyId);

//         if(!task){
//             return next('Task not found', 404);
//         }

//         const allowedFeilds = [
//             'title', 'description', 'taskType', 'priority', 'status',
//             'dueDate', 'dueTime', 'reminderEnabled', 'reminderDate',
//             'location', 'notes', 'tags', 'subtasks', 'assignedTo'
//         ];

//         allowedFeilds.forEach(field => {
//             if(updateData[field] !== undefined){
//                 task[field] = updateData[field];
//             };
//         });

//         await task.save();

//         res.status(200).json({
//             success : true,
//             message : 'Task Updates successfully',
//             task
//         });

//     }catch(error){
//         console.log(error);
//         return next(new ApplicationError('Unable to update the tasks', 500));
//     }
// }

export const updateTasks = async(req, res, next) => {
    try{
        const {id} = req.params;
        const attorneyId = req.user.id;
        const updateData = req.body;

        const task = await taskRepository.getTask(id, attorneyId);

        if(!task){
            return next(new ApplicationError('Task not found', 404));  // ✅ Fixed
        }

        const allowedFields = [  
            'title', 'description', 'taskType', 'priority', 'status',
            'dueDate', 'dueTime', 'reminderEnabled', 'reminderDate',
            'location', 'notes', 'tags', 'subtasks', 'assignedTo'
        ];

        allowedFields.forEach(field => {
            if(updateData[field] !== undefined){

                if(field === 'assignedTo' && updateData[field] === ''){
                    task[feild] = null;
                }else{
                    task[field] = updateData[field];
                }
                
            }
        });

        await task.save();

        res.status(200).json({
            success : true,
            message : 'Task updated successfully',
            task
        });

    }catch(error){
        console.error('Update task error:', error);  
        return next(new ApplicationError('Unable to update the tasks', 500));
    }
}

// delete Tasks..
export const deleteTasks = async(req, res, next) => {

    try{

        const {id} = req.params;
        const attorneyId = req.user.id;


        const task = await taskRepository.deleteTask(id, attorneyId);

        if(!task){
            return next(new ApplicationError('Tasks not found', 404));
        }

        res.status(200).json({
            success : true,
            message : 'Task deleted successfully',
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to delete the tasks', 500));
    }
}

// markAsCompleted.
export const markAsCompleted = async(req, res, next) => {

    try{

        const attorneyId = req.user.id;
        const {id} = req.params;

        const task = await taskRepository.getTask(id, attorneyId);

        if(!task){
            return next(new ApplicationError('Task not found', 404));
        }

        await task.markAsCompleted();
        await task.populate('caseId','title, caseNumber');
        await task.populate('clientId', 'name email');
        
        res.status(200).json({
            success : true,
            message : 'Task mark sucessfully',
            task
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to Mark tasts as completed'));
    }
}

// toggle subtasks completion..
// Toggle subtask completion
export const toggleSubtask = async (req, res, next) => {
  try {
    const { id, subtaskId } = req.params;
    const attorneyId = req.id;

    const task = await taskRepository.getTask(id, attorneyId);

    if (!task) {
      return next(new ApplicationError('Task not found', 404));
    }

    const subtask = task.subTasks.id(subtaskId);
    if (!subtask) {
      return next(new ApplicationError('Subtask not found', 404));
    }

    subtask.completed = !subtask.completed;
    subtask.completedAt = subtask.completed ? new Date() : null;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      task
    });
  } catch (error) {
    console.error(error);
    return next(new ApplicationError('Unable to update subtask', 500));
  }
};

// getTask By case.
export const getTaskByCase = async(req, res, next) => {
    try{

        const {caseId} = req.params;
        const attorneyId = req.user.id;

        // verify case belongs to attorney..
        const caseData = await taskRepository.getCase(caseId, attorneyId);

        if(!caseData){
            return next(new ApplicationError('Case not found', 404));
        }

        const task = await taskRepository.getTaskByCase(caseId, attorneyId);

         res.status(200).json({
                success : true,
                count : task.length,
                task
          });
    
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch tasks', 500));
    }
}

// getToday's Tasks
export const getTodaysTask = async(req, res, next) => {

    try{

        
        const attorneyId = req.user.id;
        
        // console.log(attorneyId);
        const startOfDay = new Date();

        startOfDay.setUTCHours(0,0,0,0);

        const endOfDay = new Date();
        endOfDay.setUTCHours(23,59,59,999);
        

        const tasks = await taskRepository.getTodaysTask(attorneyId, startOfDay, endOfDay);
        
        res.status(200).json({
            success : true,
            count : tasks.length,
            tasks
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get Tasks',500));
    }
}

// getUpcoming Tasks.
export const getUpcomingTasks = async(req, res, next) => {
    try{

        const attorneyId = req.user.id;

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const nextWeek = new Date(today);

        nextWeek.setUTCDate(today.getUTCDate() + 7);
        nextWeek.setUTCHours(23, 59, 59, 999);

        
        console.log(today.toISOString());
        console.log(nextWeek.toISOString());
        const tasks = await taskRepository.getUpcomingTask(attorneyId, today, nextWeek);

        res.status(200).json({
            success : true,
            count : tasks.length,
            tasks
        })

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get tasks of 7 days', 500));
    }
}

// getOverDue Tasks.
export const getOverDueTasks = async(req, res, next) => {

    try{

        const attorneyId = req.user.id;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        
        const tasks = await taskRepository.getOverDueTask(attorneyId, today);

        res.status(200).json({
            success : true,
            count : tasks.length,
            tasks
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get overdue tasks', 500));
    }
}

// tasksStats.
export const getStats = async(req, res, next) => {
    try{

        const attorneyId = req.user.id;
        const totalTasks = await Task.countDocuments(attorneyId);

        const statusStats = await Task.aggregate([
            {
                $match : {
                    attorneyId : new mongoose.Types.ObjectId(attorneyId)
                },

            },

            {
                $group : {
                    _id : '$status',
                    count : {$sum : 1}
                }
            }
        ]);

        const priorityStats = await Task.aggregate([
            {
                $match : {
                    attorneyId : new mongoose.Types.ObjectId(attorneyId)
                }
            },
            {
                $group : {
                    _id : '$priority',
                    count : {$sum : 1}
                }
            }
        ]);

        const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = await Task.countDocuments({
      attorneyId,
      dueDate: { $lt: today },
      status: { $nin: ['Completed', 'Cancelled'] }
    });

    const todayTasks = await Task.countDocuments({
      attorneyId,
      dueDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      },
      status: { $ne: 'Completed' }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        overdueTasks,
        todayTasks,
        byStatus: statusStats,
        byPriority: priorityStats
      }
    });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get stats of tasks', 400));
    }
}

// export const rateLimitterMiddleware = async(req, res, next) => {

//     // const ip = ip.address();

//     // Limit of the variables as follows...

//     const MAX_ALLOWED = 5;
//     let max_time = 10000;

//     let ip_mapping = {};

//     setInterval(() => {
//         ip_mapping = {};
//         console.log("IP is cleared");
//     }, max_time);

//     ip_mapping[ip] = ip_mapping[ip] + 1 || 1;

//     console.log(`Reciving request ${ip_mapping[ip]} from ${ip}`);
//     if(ip_mapping[ip] > MAX_ALLOWED){
//         return res.status(429).send("Too many request");
//     }

//     next();
// }