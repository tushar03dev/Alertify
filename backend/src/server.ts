import express from 'express';
import { Response } from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import connectDB from './config/db';
import multer from 'multer';
import './types'
import cron from 'node-cron'
import {batchCheck} from "./controllers/batchController";
import websiteRoutes from "./routes/websiteRoutes";
import otpRoutes from "./routes/otpRoutes";
import cors from 'cors';
import userRoutes from "./routes/userRoutes";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors());

// Middleware to handle form-data
const upload = multer();

// Middleware to parse form-data
app.use(upload.none());


//Schedule the cron job to run every 3 minutes
cron.schedule('*/3 * * * *', () => {
    console.log('Checking website status...');
    batchCheck()
        .then(() => {
            console.log('Batch check completed successfully.');
        })
        .catch((error) => {
            console.error('Error during batch check:', error);
        });
});

// Connect To MongoDB
connectDB();

// Use the auth routes
app.use('/api/auth', authRoutes); // Mounts the auth routes

// Use the auth routes
app.use('/otp',otpRoutes); // Mounts the auth routes

// use the website routes
app.use('/api',websiteRoutes); // Mounts the website routes

// use the user routes
app.use('/api/user',userRoutes); // Mounts the user routes

//Error-handling middleware
app.use((err: any, res: Response) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


