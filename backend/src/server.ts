import express from 'express';
import { Response, Request, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import connectDB from './config/db';
import multer from 'multer';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads
// Middleware to handle form-data
const upload = multer(); // You can configure multer to store files if needed

// Middleware to parse form-data
app.use(upload.none()); // This is used when you're not uploading any files, just data

// MongoDB Connection


// Use the auth routes
app.use('/api/auth', authRoutes); // Mounts the auth routes

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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