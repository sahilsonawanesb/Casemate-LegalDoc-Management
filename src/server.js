import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

// creating the express server as follows.
const app = express();

const PORT = process.env.PORT || 3000;


// deafult api endpoint.
app.get('/', (req, res) => {
    res.send('Welcome to the backend server of Casemate legal document management system');
});


app.listen(PORT, (req, res) => {
    console.log(`Server is running on port ${PORT}`)
    connectDB();
})

export default app;

