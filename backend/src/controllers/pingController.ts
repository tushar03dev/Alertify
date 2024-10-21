import { Website, IWebsite } from '../models/websiteModel';
import validator from 'validator';
import puppeteer from 'puppeteer';

const batchSize = 5; // Define the number of websites to check in one batch

// Function to check the status of a single website
const checkSingleWebsiteStatus = async (websiteUrl: string, websiteId: string) => {
    // Check if the URL starts with http:// or https://
    if (!/^https?:\/\//i.test(websiteUrl)) {
        websiteUrl = `https://${websiteUrl}`; // Prepend https:// if no protocol is present
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
        const response = await page.goto(websiteUrl, {
            waitUntil: 'networkidle2',
            timeout: 10000 // Wait for up to 10 seconds
        });
        if (response) {
            const status = response.ok() ? 'up' : 'down';

            // Fetch the current website data to check the last trend
            const website = await Website.findById(websiteId);

            if (website) {
                const lastTrend = website.trends[website.trends.length - 1]; // Get the last trend

                // Update only if the status has changed from the last trend
                if (!lastTrend || lastTrend.status !== status) {
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
                    console.log(`Website ${websiteUrl} is ${status} and trend updated.`);
                } else {
                    // Just update the current status without adding a trend
                    const updateData = {
                        currentStatus: {
                            status,
                            checkedAt: new Date(),
                        },
                    };
                    await Website.findByIdAndUpdate(websiteId, updateData, { new: true });
                    console.log(`Website ${websiteUrl} is still ${status}, no trend update needed.`);
                }
            }
        } else {
            console.error(`Failed to ping ${websiteUrl}: No response received.`);
            // Optionally update status as 'down' here
        }
    } catch (error: unknown) {
        const errorMessage = (error as Error).message || 'Unknown error';

        // Fetch the current website data to check the last trend
        const website = await Website.findById(websiteId);

        if (website) {
            const lastTrend = website.trends[website.trends.length - 1]; // Get the last trend

            if (!lastTrend || lastTrend.status !== 'down') {
                // Update the status and push the trend only if status has changed
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
                console.error(`Website ${websiteUrl} is down and trend updated due to error: ${errorMessage}`);
            } else {
                // Just update the current status without adding a trend
                const updateData = {
                    currentStatus: {
                        status: 'down',
                        checkedAt: new Date(),
                    },
                };

                await Website.findByIdAndUpdate(websiteId, updateData, { new: true });
                console.error(`Website ${websiteUrl} is still down, no trend update needed due to error: ${errorMessage}`);
            }
        }
    } finally {
        await browser.close(); // Close the browser after each check
    }
};

// Function to perform checks in batches
const batchCheck = async () => {
    // Fetch all websites and explicitly type the result
    const websites: IWebsite[] = await Website.find();

    if (websites.length === 0) {
        console.log("No websites to check.");
        return;
    }

    // Split websites into groups of 5
    const groups = [];
    for (let i = 0; i < websites.length; i += batchSize) {
        groups.push(websites.slice(i, i + batchSize));
    }

    // Process each group sequentially
    for (const group of groups) {
        console.log(`Checking group of ${group.length} websites...`);

        // Check all websites in the group in parallel
        const statusChecks = group.map((website) => {
            const { url, _id } = website; // Destructure to get url and _id
            return checkSingleWebsiteStatus(url, _id.toString()); // Convert ObjectId to string
        });

        await Promise.all(statusChecks); // Wait for all status checks in the group to complete
    }
};

// Export the batch check function
export { batchCheck };
