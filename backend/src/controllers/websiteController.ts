import  { Request, Response, NextFunction } from 'express';
import {IWebsite, Website} from "../models/websiteModel";
import mongoose from "mongoose";


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

export const deleteWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Ensure the user is authenticated
        const user = (req as any).user; // We attached the user in the middleware
        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        // Extract the website name from the request body
        const { websiteName } = req.body;

        // Ensure the website name is provided
        if (!websiteName) {
            res.status(400).json({ message: 'Please provide the website name to delete.' });
            return;
        }

        // Find the website by its name and ensure it belongs to the authenticated user
        const website = await Website.findOne({ websiteName, user: user._id });

        if (!website) {
            res.status(404).json({ message: 'Website not found or unauthorized access.' });
            return;
        }

        // Delete the website from the Website collection
        await Website.findOneAndDelete({ websiteName, user: user._id });

        // Remove the website from the user's websites array
        user.websites = user.websites.filter(
            (id: mongoose.Types.ObjectId) => id.toString() !== website._id.toString()
        );
        await user.save();

        res.status(200).json({ message: 'Website deleted successfully.' });
    } catch (error) {
        next(error);  // Pass any errors to the global error handler
    }
};

export const updateWebsite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Ensure the user is authenticated
        const user = (req as any).user; // We attached the user in the middleware
        if (!user) {
            res.status(401).json({ message: 'Unauthorized: No user found.' });
            return;
        }

        // Extract the new website details from the request body
        const { websiteName, newUrl, newWebsiteName } = req.body;

        // Ensure at least one field to update is provided
        if (!newUrl && !newWebsiteName) {
            res.status(400).json({ message: 'Please provide at least one field to update (newUrl or newWebsiteName).' });
            return;
        }

        // Find the website by its name and ensure it belongs to the authenticated user
        const website = await Website.findOne({ websiteName, user: user._id });

        if (!website) {
            res.status(404).json({ message: 'Website not found or unauthorized access.' });
            return;
        }

        // Prepare the update object
        const updateData: any = {};
        if (newUrl) {
            updateData.url = newUrl;
        }
        if (newWebsiteName) {
            updateData.websiteName = newWebsiteName;
        }

        // Update the website
        await Website.findByIdAndUpdate(website._id, updateData, { new: true });

        res.status(200).json({ message: 'Website updated successfully.', website: { ...website.toObject(), ...updateData } });
    } catch (error) {
        next(error);  // Pass any errors to the global error handler
    }
};

// Function to delete all trends of all websites
export const deleteAllTrends = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    try {
        // Update all websites to remove trends
        const result = await Website.updateMany({}, { $set: { trends: [] } });

        if (result.modifiedCount > 0) {
             res.status(200).json({ message: 'All trends deleted successfully' });
             return;
        } else {
             res.status(404).json({ message: 'No trends found to delete' });
        }
    } catch (error) {
        next(error);
    }
};

export const logWebsiteInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract the identifier (website name or URL) from the request body
        const { identifier } = req.body;

        // Ensure an identifier is provided
        if (!identifier) {
            res.status(400).json({ message: 'Please provide a website name or URL to search.' });
            return;
        }

        // Search for the website by either name or URL
        const website: IWebsite | null = await Website.findOne({
            $or: [
                { websiteName: identifier },
                { url: identifier }
            ]
        });

        if (!website) {
            res.status(404).json({ message: `Website with name or URL '${identifier}' not found.` });
            return;
        }

        // Log website information
        console.log(`Website Name: ${website.websiteName}`);
        console.log(`Website URL: ${website.url}`);
        console.log(`Current Status: ${website.currentStatus.status}`);
        console.log(`Last Checked At: ${website.currentStatus.checkedAt}`);

        // Log trends information
        if (website.trends.length > 0) {
            console.log('Trends:');
            website.trends.forEach((trend, index) => {
                console.log(`  Trend #${index + 1}:`);
                console.log(`    Status: ${trend.status}`);
                console.log(`    Timestamp: ${trend.timestamp}`);
            });
        } else {
            console.log('No trends available.');
        }

        // Return a success message with website details in the response
        res.status(200).json({
            message: 'Website information logged successfully',
            website: {
                websiteName: website.websiteName,
                url: website.url,
                currentStatus: website.currentStatus,
                trends: website.trends,
            }
        });

    } catch (error: unknown) {
        console.error(`An error occurred while retrieving the website: ${(error as Error).message}`);
        next(error);
    }
};
