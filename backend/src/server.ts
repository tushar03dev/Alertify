import express from 'express';
import { Response } from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import connectDB from './config/db';
import multer from 'multer';
import './types'
import cron from 'node-cron'
import {batchCheck} from "./controllers/pingController";
import websiteRoutes from "./routes/websiteRoutes";

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
// Middleware to handle form-data
const upload = multer(); // You can configure multer to store files if needed

// Middleware to parse form-data
app.use(upload.none()); // This is used when you're not uploading any files, just data


//Schedule the cron job to run every 3 minutes

// cron.schedule('*/3 * * * *', () => {
//     console.log('Checking website status...');
//     batchCheck()
//         .then(() => {
//             console.log('Batch check completed successfully.');
//         })
//         .catch((error) => {
//             console.error('Error during batch check:', error);
//         });
// });

// Use the auth routes
app.use('/api/auth', authRoutes); // Mounts the auth routes

// use the website routes
app.use('/api',websiteRoutes); // Mounts the website routes

// Error-handling middleware
app.use((err: any, res: Response) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5200;

// Connect to MongoDB, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


