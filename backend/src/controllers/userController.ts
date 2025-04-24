import { Request, Response, NextFunction } from 'express';
import {User} from '../models/userModel'; // Adjust the import to match your file structure

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = (req as any).user; // User information added by authentication middleware

        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const userProfile = await User.findById(user._id).select('name'); // Fetch only specific fields
        if (!userProfile) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        console.log(userProfile);

        res.status(200).json({ user: userProfile });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        next(error); // Pass the error to the error handling middleware
    }
};