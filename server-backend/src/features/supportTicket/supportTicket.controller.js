// Support ticket controller for assistant..
import ApplicationError from "../../error-handler/ApplicationError.js";
import teamModel from "../team/team.model.js";
import Case from "../case/case.model.js";
import {clientModel} from "../client/client.model.js";
import SupportTicket from "./supportTicket.schema.js";



// get all support tickets..
export const getMyTickets = async(req, res, next) => {
    try{

        const userId = req.user.id;
        const {status, priority, category} = req.query;
        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            status : 'Active'
        });
        if(!teamMember){
            return next(new ApplicationError('Teammember not found', 404));
        }

        // build filter tickets assigned to this filter..
        const filter = {
            assignedTo : teamMember._id
        }

        if(status) filter.status = status;
        if(priority) filter.priority = priority;
        if(category) filter.category = category;

        const tickets = await SupportTicket.find(filter)
            .populate('clientId', 'name email phone')
            .populate('caseId', 'title caseNumber')
            .populate('attorneyId', 'name email')
            .sort({createdAt : -1})
            .select('-__v');
        
        res.status(200).json({
            success : true,
            count : tickets.length,
            tickets
        });


    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get all tickets', 500))
    }
}

// get tickets by Id.
export const getTicketById = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;
        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            status : 'Active',
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const ticket = await SupportTicket.findOne({_id : id,
            assignedTo:teamMember._id
        })
        .populate('clientId', 'name email phone')
        .populate('caseId', 'title, caseNumber')
        .populate('attorneyId', 'name email')
        .populate('messages.senderId');

        if(!ticket){
            return next(new ApplicationError('Ticket not found or not assigned to you', 404));
        }

        res.status(200).json({
            success : true,
            ticket
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to get specific ticket', 500));
    }
}

// create support ticket on behalf of client.
export const createTicket = async(req, res, next) => {
    try{

       
        const {clientId, caseId, subject, description, priority, category} = req.body;
         const userId = req.user.id;
         console.log(userId);
        
        if(!clientId, !subject, !priority){
            return next(new ApplicationError('Client, Subject and priority is required', 400));
        }

        const teamMember = await teamModel.findOne({
            _id : userId,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team Member not found', 404));
        }

        // verify client exists and it's available
        const assignedCasesIds = teamMember.assignedCases.map(ac => ac.caseId);
        const cases = await Case.find({
            _id : {$in : assignedCasesIds},
            clientId
        });

        if(cases.length === 0){
            return next(new ApplicationError('You dont have access to this client', 403));
        }

        const client = await clientModel.findById(clientId);
        
        if(!client){
            return next(new ApplicationError('Client not found', 404));
        }

        const clientTicket = await SupportTicket.create({
            clientId,
            caseId : caseId || null,
            attorneyId : client.attorneyId,
            assignedTo : teamMember._id,
            subject : subject.trim(),
            description : description.trim(),
            priority : priority || 'Medium',
            category : category || 'General Inquiry',
            status : 'Open',
            messages : [{
                sender : 'Client',
                senderName : client.name,
                senderId : clientId,
                senderModel : 'Client',
                message : description.trim(),
                timeStamp : new Date(),
                isRead : false
                
            }]
        });

        await clientTicket.populate('clientId', 'name email phone');
        await clientTicket.populate('caseId', 'title caseNumber');

        res.status(200).json({
            success : true,
            message : 'Support ticket created successfully',
            clientTicket
        });

    
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to create a new ticket', 500));
    }
}

// addRelpy to ticket.
export const addReply = async(req, res, next) => {
    try{

        const {id} = req.params;
        const {message} = req.body;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            status : 'Active',
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const ticket = await SupportTicket.findOne({
            _id : id,
            assignedTo:teamMember._id
        });

        if(!ticket){
            return next(new ApplicationError('Ticket not found or not assigned to you', 404));
        }

        ticket.message.push({
            sender: 'Assistant',
            senderName: teamMember.name,
            senderId: teamMember._id,
            senderModel: 'TeamMember',
            message: message.trim(),
            timestamp: new Date(),
            isRead: false
        });

        if(ticket.open === 'Open'){
            ticket.status = "In Progress";
        }

        await ticket.save();
        await ticket.populate('clientId', 'name email phone');

        res.status(200).json({
            success : true,
            message : 'Reply added successfully',
            ticket
        });
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to make reply to the tickets', 500));
    }
}

// Mark ticket as resolved.
export const markResolved = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;

        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const ticket = await SupportTicket.findOne({
            _id : id,
            assignedTo : teamMember._id
        });

        if(!ticket){
            return next(new ApplicationError('Ticket not found or not assigned to you', 404));
        }

        ticket.status = "Resolved";
        ticket.resolvedAt = new Date();
        ticket.resolvedBy = req.user.id;

        await ticket.save();

        res.status(200).json({
            success:true,
            message : 'Ticket marked successfully'
        });
    
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to resolved ticket', 500));
    }
}

// Update ticket status..
export const updateTicketStatus = async(req, res, next) => {
    try{

        const {id} = req.params;
        const userId = req.user.id;
        const {status, priority, category, internalNotes} = req.body;

        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            email : req.email
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const ticket = await SupportTicket.findOne({
            _id : id,
            assignedTo : teamMember._id
        });

        if(!ticket){
            return next(new ApplicationError('Ticket not found or not assigned to you', 404));
        }

        if(status) ticket.status = status;
        if(priority) ticket.priority = priority;
        if(category) ticket.category = category;
        if(internalNotes !== undefined) ticket.internalNotes = internalNotes;

        await ticket.save();

        res.status(200).json({
            success : true,
            message : 'Ticket status updated'
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to update the status of ticket', 500));
    }
}

// getTickets statstics..
export const getTicketsStats = async(req, res, next) => {
    try{

        const userId = req.user.id;
        
        const teamMember = await teamModel.findOne({
            _id : userId,
            email : req.email,
            status : 'Active',
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const totalTickets = await SupportTicket.countDocuments({
            assignedTo : teamMember._id
        });

        const openTickets = await SupportTicket.countDocuments({
            assignedTo : teamMember._id,
            status : {
                $in : ['Open', 'In progress']
            }
        });

        const urgentTickets = await SupportTicket.countDocuments({
            assignedTo : teamMember._id,
            priority : 'Urgent',
            status : {
                $ne : 'Resolved'
            }
        });

        const statusStats = await SupportTicket.aggregate([
            {
                $match : {
                    assignedTo : new mongoose.Types.ObjectId(teamMember._id)
                },
            },
            {
                $group : {
                    _id : 'Status',
                    count : {
                        $sum : 1
                    }
                }
            }
        ]);

        const priorityStats = await SupportTicket.aggregate([

            {
                $match : {assignedTo : new mongoose.Types.ObjectId(teamMember._id)
                },
            },
            {
                $group : {
                    _id : '$priority',
                    count : {$sum : 1}
                }
            }
        ]);

        res.status(200).json({
            totalTickets,
            openTickets,
            urgentTickets,
            byStats : statusStats,
            byPriority : priorityStats
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to fetch tickets stats', 500));
    }
}

// Search Tickets.
export const searchTickets = async(req, res, next) => {
    try{

        const {q} = req.query;
        const userId = req.user.id;

        if(!q){
            return next(new ApplicationError('Search query is required', 400));
        }

        const teamMember = await teamModel.findOne({
            _id : userId,
            // email : req.email,
            status : 'Active'
        });

        if(!teamMember){
            return next(new ApplicationError('Team member not found', 404));
        }

        const tickets = await SupportTicket.find({
            assignedTo : teamMember._id,
            $or : [
                {subject : {$regex : q, $options : 'i'}},
                {description : {$regex : q, $options : 'i'}},
                {ticketNumber : {$regex : q, $options : 'i'}}
            ]
        })
        .populate('clientId', 'name email')
        .populate('caseId', 'name')
        .select('-__v');

        res.status(200).json({
            success : true,
            count : tickets.length,
            tickets
        });

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Unable to search tickets', 500));
    }
}