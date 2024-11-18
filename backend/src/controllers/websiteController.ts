import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/userModel';
import { Website } from '../models/websiteModel';

// Fetch user's websites
export const getUserWebsites = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const websites = await Website.find({ user: user._id });
        res.status(200).json({ websites });
    } catch (error) {
        console.error('Error fetching websites:', error);
        next(error);
    }
};

// Register a new website
export const websiteRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const { websiteName, url } = req.body;

        if (!websiteName || !url) {
            res.status(400).json({ message: 'Please provide website name and URL.' });
            return;
        }

        const existingWebsite = await Website.findOne({ url, user: user._id });

        if (existingWebsite) {
            res.status(400).json({ message: 'Website already registered for this user.' });
            return;
        }

        const newWebsite = new Website({ websiteName, url, user: user._id });
        const savedWebsite = await newWebsite.save();

        user.websites.push(savedWebsite._id);
        await user.save();

        res.status(201).json({ message: 'Website registered successfully.', website: savedWebsite });
    } catch (error) {
        console.error('Error registering website:', error);
        next(error);
    }
};

// Delete a website
export const deleteWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const { websiteName } = req.body;

        if (!websiteName) {
            res.status(400).json({ message: 'Please provide the website name to delete.' });
            return;
        }

        const website = await Website.findOneAndDelete({ websiteName, user: user._id });

        if (!website) {
            res.status(404).json({ message: 'Website not found or does not belong to this user.' });
            return;
        }

        user.websites = user.websites.filter((id: mongoose.Types.ObjectId) => !id.equals(website._id));
        await user.save();

        res.status(200).json({ message: 'Website deleted successfully.' });
    } catch (error) {
        console.error('Error deleting website:', error);
        next(error);
    }
};

// Update a website
export const updateWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        const { websiteName, newUrl, newWebsiteName } = req.body;

        if (!websiteName || (!newUrl && !newWebsiteName)) {
            res.status(400).json({ message: 'Please provide the current website name and at least one field to update.' });
            return;
        }

        const website = await Website.findOne({ websiteName, user: user._id });

        if (!website) {
            res.status(404).json({ message: 'Website not found or does not belong to this user.' });
            return;
        }

        if (newUrl) website.url = newUrl;
        if (newWebsiteName) website.websiteName = newWebsiteName;

        const updatedWebsite = await website.save();

        res.status(200).json({ message: 'Website updated successfully.', website: updatedWebsite });
    } catch (error) {
        console.error('Error updating website:', error);
        next(error);
    }
};

// Delete all trends for all websites
export const deleteAllTrends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await Website.updateMany({}, { $set: { trends: [] } });

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'All trends deleted successfully.' });
        } else {
            res.status(404).json({ message: 'No trends found to delete.' });
        }
    } catch (error) {
        console.error('Error deleting trends:', error);
        next(error);
    }
};

// Log website info
export const logWebsiteInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { identifier } = req.body;

        if (!identifier) {
            res.status(400).json({ message: 'Please provide a website name or URL to search.' });
            return;
        }

        const website = await Website.findOne({
            $or: [{ websiteName: identifier }, { url: identifier }],
        });

        if (!website) {
            res.status(404).json({ message: `Website with identifier '${identifier}' not found.` });
            return;
        }

        res.status(200).json({
            message: 'Website information retrieved successfully.',
            website: {
                websiteName: website.websiteName,
                url: website.url,
                currentStatus: website.currentStatus,
                trends: website.trends,
                sslStatus: website.sslStatus,
            },
        });
    } catch (error) {
        console.error('Error retrieving website info:', error);
        next(error);
    }
};
