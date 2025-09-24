import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import jwtToken from './middleware/jwt.middleware.js';
import userRouter from './routes/user.routes.js';
import cors from 'cors';



dotenv.config();

// creating the express server as follows.
const app = express();


const PORT = process.env.PORT || 3000;

// cors:-
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));


// middleware for parsing the json data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// deafult api endpoint.
app.get('/', (req, res) => {
    res.send('Welcome to the backend server of Casemate legal document management system');
});


// auth -API
app.use('/api/auth', authRouter);

// user -API
app.use('/api/user', jwtToken, userRouter);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})

// 

export default app;

