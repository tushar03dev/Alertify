import { Website, IWebsite } from '../models/websiteModel';
import validator from 'validator';
import puppeteer from 'puppeteer';

let currentIndex = 0; // Keeps track of the current batch of websites being checked
const batchSize = 5; // Define the number of websites to check in one round

// Function to check the status of a single website
const checkSingleWebsiteStatus = async (websiteUrl: string, websiteId: string) => {

    // Check if the URL starts with http:// or https://
    if (!/^https?:\/\//i.test(websiteUrl)) {
        websiteUrl = `https://${websiteUrl}`; // Prepend http:// if no protocol is present
    }

    // Validate the URL
    if (!validator.isURL(websiteUrl)) {
        console.error(`Invalid URL provided: ${websiteUrl}`);
        return;
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

// Set a custom user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36');

    try {
        const response = await page.goto(websiteUrl, { waitUntil: 'networkidle2' });
        if (response) {
            const status = response.ok() ? 'up' : 'down';

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

            await Website.findByIdAndUpdate(websiteId, updateData, { new: true });
            console.log(`Website ${websiteUrl} is ${status}`);
        } else {
            console.error(`Failed to ping ${websiteUrl}: No response received.`);
            // Handle the case where response is null
            // Optionally update status as 'down'
        }
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Unknown error';
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

        await Website.findByIdAndUpdate(websiteId, updateData, { new: true });
        console.error(`Failed to ping ${websiteUrl}: ${errorMessage}`);
    }
};

// Function to perform round-robin checks
const roundRobinCheck = async () => {
    // Fetch all websites and explicitly type the result
    const websites: IWebsite[] = await Website.find();

    if (websites.length === 0) {
        console.log("No websites to check.");
        return;
    }

    const totalWebsites = websites.length;
    const batch = websites.slice(currentIndex, currentIndex + batchSize);

    // If there are not enough websites in the current index, loop back to the beginning
    if (batch.length < batchSize && currentIndex + batchSize > totalWebsites) {
        batch.push(...websites.slice(0, (currentIndex + batchSize) % totalWebsites));
    }

    // Map over the batch to check statuses
    const statusChecks = batch.map((website) => {
        const { url, _id } = website; // Destructure to get url and _id
        return checkSingleWebsiteStatus(url, _id.toString()); // Convert ObjectId to string
    });

    await Promise.all(statusChecks); // Wait for all status checks to complete
    currentIndex = (currentIndex + batchSize) % totalWebsites; // Update the current index
};


// Export the round-robin check function
export { roundRobinCheck };
