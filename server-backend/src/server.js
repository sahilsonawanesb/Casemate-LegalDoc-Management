import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import jwtToken from './middleware/jwt.middleware.js';
import userRouter from './routes/user.routes.js';
import cors from 'cors';
import clientRouter from './routes/client.routes.js';
import caseRouter from './routes/case.routes.js';
import documentRouter from './routes/document.routes.js';
import taskRouter from './routes/task.routes.js';
import teamRouter from './routes/team.routes.js';
import assistantRouter from './routes/assistant.routes.js';
import ticketRouter from './routes/supportTicket.routes.js';
import appointmentRouter from './routes/appointment.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';



dotenv.config();

// creating the express server as follows.
const app = express();


const PORT = process.env.PORT || 3000;

// cors:-
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
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

// client - API
app.use('/api/client', jwtToken, clientRouter);

// case - API
app.use('/api/cases', jwtToken, caseRouter);

// documents - API
app.use('/api/documents',jwtToken,documentRouter);

// tasks - API
app.use('/api/tasks', jwtToken, taskRouter);

// team - API
app.use('/api/team', jwtToken, teamRouter);

// assistantDashboard - API
app.use('/api/assistant', jwtToken, assistantRouter);

// supportTicket - API.
app.use('/api/tickets', jwtToken, ticketRouter);

// appointment- API.
app.use('/api/appointments', jwtToken, appointmentRouter);

// dashboard - API.
app.use('/api/dashboard', jwtToken, dashboardRouter);

app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})

// 

export default app;

