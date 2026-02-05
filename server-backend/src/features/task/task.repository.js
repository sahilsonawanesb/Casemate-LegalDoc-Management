// consider the following code as follows..
import mongoose from "mongoose";
import taskSchema from "./task.schema.js";
import ApplicationError from '../../error-handler/ApplicationError.js';
import Case from "../case/case.model.js";

const taskModel = mongoose.model('tasks', taskSchema);


export default class TaskRepository{


    // get specfic task..
    async getCase(caseId, attorneyId){

        try{

            const foundCase = await Case.findOne({_id : caseId, attorneyId});
            return foundCase;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Somthing went wrong at database level', 500);
        }
    }

    // create tasks..
    async createTask(taskDetails){
        try{

            const newTask = new taskModel(taskDetails);
            await newTask.save();
            await newTask.populate('caseId', 'title caseNumber');
            await newTask.populate('clientId', 'name email');

            return newTask;

        }catch(error){
            console.log(error);
            return next(new ApplicationError('Something went wrong database level', 500));
        }
    }

    // getAllTasks..
    async getAllTasks(filter){
        try{

            const tasks = await taskModel.find(filter)
                .populate('caseId', 'title caseNumber')
                .populate('clientId', 'name email')
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email')
                .sort({dueDate : 1, priority : -1})
                .select('-__V');


            return tasks;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getSingle Tasks.
    async getTask(id, attorneyId){
        try{

            const task = await taskModel.findOne({_id : id, attorneyId})
                .populate('caseId', 'title caseNumber')
                .populate('clientId', 'client email phone')
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email')
            
            return task;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getTaskByCase 
    async getTaskByCase(caseId, attorneyId){
        try{

            const task = await taskModel.find({caseId, attorneyId})
                .populate('assignedTo', 'name email')
                .populate({dueDate: 1})
                .select('-__v');

            return task;

        }catch(error){
            console.log(error);
           throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    // getTodayTasks.
    async getTodaysTask(attorneyId, startOfDay, endOfDay){

       
        try{

            const task = await taskModel.find({
  attorneyId,
  reminderDate: {
    $gte: startOfDay,
    $lte: endOfDay
  },
  reminderEnabled: true,
  reminderSent: false
})
            .populate('caseId', 'title')
            .populate('clientId', 'name')
            .sort({dueDate : 1, priority : -1});

            return task;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Somthing went wrong at database level', 500);
        }
    }

    async getUpcomingTask(attorneyId, today, nextWeek){
        try{
            const task = await taskModel.find({
                attorneyId,
                reminderEnabled : true,
                reminderDate : {
                    $gte : today,
                    $lte : nextWeek
                },
                status : {
                    $nin : ['Completed', 'Cancelled']
                }
            })
            .populate('caseId', 'title')
            .populate('clientId', 'name')
            .sort({reminderDate : 1, priority : -1});

            return task;
        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }

    async getOverDueTask(attorneyId, today){
        try{

            const tasks = await taskModel.find({
                attorneyId,
                dueDate : {
                    $lt : today
                },
                status : {
                    $nin : ['Completed','Cancelled']
                }
            })
            .populate('caseId', 'title')
            .populate('clientId', 'name')
            .sort({dueDate : 1})

        return tasks;

        }catch(error){
            console.log(error);
            return next(new ApplicationError('Something went wrong at database level', 500));
        }
    }

    // delete Tasks.
    async deleteTask(id, attorneyId){
        try{

            const task = await taskModel.findOneAndDelete({_id : id, attorneyId});
            return task;

        }catch(error){
            console.log(error);
            throw new ApplicationError('Something went wrong at database level', 500);
        }
    }


    // Stats..



    
}
