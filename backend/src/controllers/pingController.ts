import axios from 'axios';
import {Bin} from '../models/binModel'; // Adjust the import path as necessary
import {Website} from '../models/websiteModel'; // Adjust the import path as necessary
import pLimit from 'p-limit'
import mongoose from "mongoose";

const limit = pLimit(5);

// Function to check website status
const checkSingleWebsiteStatus = async (websiteUrl: string, websiteId: mongoose.Types.ObjectId) => {

    try {
        const response = await axios.get(websiteUrl, {timeout: 5000}); // Set a timeout to avoid long waits
        const status = response.status === 200 ? 'up' : 'down'; // Update status based on HTTP response

        // Update the website status in the website collection
        const updateData = {
            currentStatus: {
                status,
                checkedAt: new Date(),
            },
            $push: {
                trends: {
                    status,
                    timestamp: new Date(),
                },
            },
        };

        await Website.findByIdAndUpdate(websiteId, updateData, {new: true});
        console.log(`Website ${websiteUrl} is ${status}`);

    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Unknown error';
        // If there's an error, mark the website as down
        const updateData = {
            currentStatus: {
                status: 'down',
                checkedAt: new Date(),
            },
            $push: {
                trends: {
                    status: 'down',
                    timestamp: new Date(),
                },
            },
        };

        await Website.findByIdAndUpdate(websiteId, updateData, {new: true});
        console.error(`Failed to ping ${websiteUrl}: ${errorMessage}`);
    }
};

// Round-robin checking with concurrency control
let currentIndex = 0;

const roundRobinCheck = async () => {
    const bins = await Bin.find();

    if (bins.length === 0) {
        console.log("No websites to check.");
        return;
    }

    const tasks = [];

    for (let i = 0; i < bins.length; i++) {
        const bin = bins[(currentIndex + i) % bins.length]; // Round-robin through bins
        const { websiteUrl, websiteId } = bin;

        // Use p-limit to ensure only 5 checks happen concurrently
        const task = limit(() => checkSingleWebsiteStatus(websiteUrl, websiteId));
        tasks.push(task);
    }

    // Wait for all tasks to complete
    await Promise.all(tasks);

    // Move to the next index in round-robin manner
    currentIndex = (currentIndex + bins.length) % bins.length;
};


export {roundRobinCheck };
