import  { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/userModel';
import dotenv from 'dotenv';
import {Website} from "../models/websiteModel";
import mongoose from "mongoose";


dotenv.config();

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields (name, email, password) are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        const doc = await user.save();
        console.log("Document saved:", doc);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '2h' });
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User does not exist.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

export const websiteRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract website details from the request body
        const { websiteName, url} = req.body;

        // Check if all required fields are provided
        if (!url || !websiteName) {
            res.status(400).json({ message: 'Please provide all required fields: url and name' });
            return;
        }

        const existingWebsite = await Website.findOne({url});
        if (existingWebsite) {
            res.status(400).send('Website already exists.');
            return;
        }

        // Ensure req.user exists (i.e., authentication was successful)
        if (!req.user) {
             res.status(401).json({ message: 'Unauthorized: No user found.' });
             return;
        }

        // Create a new Website document
        const newWebsite = new Website({
            websiteName,
            url,
            user: req.user._id  // Attach the authenticated user's ObjectId
        });

        // Save the website to the database
        const savedWebsite = await newWebsite.save();

        // Add the website's ObjectId to the user's websites array and save the updated user
        req.user.websites.push(savedWebsite._id as mongoose.Types.ObjectId);
        await req.user.save();

        // Return success response
        res.status(201).json({
            message: 'Website registered successfully.',
            website: savedWebsite
        });
    } catch (error) {
        next(error);  // Pass any errors to the global error handler
    }
};
