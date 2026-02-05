import jwt from 'jsonwebtoken';
import ApplicationError from '../error-handler/ApplicationError.js';

// middleware function for verifying the token.
const jwtToken = (req, res, next) => {
    try {
        // Read a token.
        const authHeader = req.headers['authorization'];
        
        console.log('Auth Header:', authHeader);
        
        // Check if authorization header exists
        if (!authHeader) {
            return next(new ApplicationError("No Authorization header provided", 401));
        }
        
        let token;
        
        // Handle both "Bearer token" and just "token" formats
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else {
            token = authHeader.trim();
        }
        
        
        if (!token) {
            return next(new ApplicationError("Invalid Token Format", 401));
        }
        
        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        req.id = payload.id;
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
        };
        
        console.log('Token payload:', payload);
        next();
        
    } catch (error) {
        console.log('JWT Error:', error.message);
        return next(new ApplicationError('Unauthorized', 401));
    }
}

export default jwtToken;