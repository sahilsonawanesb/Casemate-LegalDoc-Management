import ApplicationError from "../error-handler/ApplicationError.js";


// function to check if user has role or not..
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if(!userRole){
            return next(new ApplicationError('User not found', 401));
        }

        if(!allowedRoles.includes(userRole)){
            return next(new ApplicationError('Access denied. Insufficient permissions', 403));
        }

        next();
    }
}

// check if the user is attorney or not.
export const isAttorney = (req, res, next) => {
    try{
        const userRole = req.user.role;
        if(userRole !== 'attorney'){
            return next(new ApplicationError('Only attorney can access this resources', 403));
        }
        next();
    }catch(error){
        console.log(error);
        return next(new ApplicationError('Something went wrong', 500));
    }
}

// check if the user is assistant or not..
export const isAssistant = (req, res, next) => {
    try{

        const userRole = req.user.role;
        if(userRole !== 'assistant'){
            return next(new ApplicationError('Only assistant can access this resources', 403));
        }


    }catch(error){
        console.log(error);
        return next(new ApplicationError('Something went wrong middleware level', 500));
    }
}

// check if the user is assistance or attorney.
export const isTeamMember = (req, res, next) => {
    try{

        const userRole = req.user.role;
        if(!['attorney', 'assistant'].includes(userRole)){
            return next(new ApplicationError('Access denied', 403));
        }

    }catch(error){
        console.log(error);
        return next(new ApplicationError('Something went wrong at database level', 500));
    }
}