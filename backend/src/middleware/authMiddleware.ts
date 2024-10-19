import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/userModel';

dotenv.config();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const token = req.headers['authorization'];

    // Check if token is missing
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // Type guard to check if decoded is an object (JwtPayload) and has a userId property
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
            const { userId } = decoded as JwtPayload & { userId: string };

            // Find the user by ID attached to the token
            const user = await User.findById(userId);

            // If no user found, reject with an error
            if (!user) {
                res.status(401).json({ message: 'Invalid token: User not found.' });
                return;
            }

            // Attach the found user to the request object for further use
            (req as any).user = user;
            next();  // Pass control to the next middleware or route handler
        } else {
            res.status(403).json({ message: 'Invalid token payload.' });
        }
    } catch (err) {

        const error = err as Error;

        // Type assertion to treat 'err' as an instance of Error
        // Handle errors during token verification (like expiration, tampering, etc.)

        if (error.name === 'TokenExpiredError') {
            res.status(403).json({ message: 'Token expired.' });
        }

        console.error('Token verification error:', error);  // Log the error for debugging

         res.status(403).json({ message: 'Invalid token.' });
    }
};
