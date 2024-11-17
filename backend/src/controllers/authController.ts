import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import dotenv from 'dotenv';
import { sendOTP, verifyOTP } from './otpController';

dotenv.config();

let tempUser: any; // Temporary storage for user details

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        tempUser = { name, email, password };
        console.log('Temp User:', tempUser);

        const otpToken = await sendOTP(email);
        console.log('OTP Token:', otpToken);

        res.status(200).json({ otpToken, message: 'OTP sent to your email.' });
    } catch (err) {
        console.error('Error in signUp:', err);
        next(err);
    }
};

export const completeSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const { otpToken, otp } = req.body;

    if (!otpToken || !otp) {
        return res.status(400).json({ message: 'Token and OTP are required.' });
    }

    try {
        const otpVerificationResult = await verifyOTP(otpToken, otp);
        if (!otpVerificationResult.success) {
            return res.status(400).json({ message: otpVerificationResult.message });
        }

        if (!tempUser) {
            console.warn('Temp user cleared unexpectedly.');
            return res.status(400).json({ message: 'No user details found for OTP verification.' });
        }

        const hashedPassword = await bcrypt.hash(tempUser.password, 10);
        const user = new User({ name: tempUser.name, email: tempUser.email, password: hashedPassword });
        await user.save();

        tempUser = null;

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
        res.status(201).json({ token, message: 'User signed up successfully.' });
    } catch (err) {
        console.error('Error in completeSignUp:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error in signIn:', err);
        next(err);
    }
};
