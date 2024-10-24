import puppeteer from 'puppeteer';
import validator from 'validator';
import { Website } from '../models/websiteModel';

// Function to check the status of a single website
export const checkSingleWebsiteStatus = async (websiteUrl: string, websiteId: string) => {
    if (!/^https?:\/\//i.test(websiteUrl)) {
        websiteUrl = `https://${websiteUrl}`; // Prepend https:// if no protocol is present
    }

    if (!validator.isURL(websiteUrl)) {
        console.error(`Invalid URL provided: ${websiteUrl}`);
        return;
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0');

    try {
        const response = await page.goto(websiteUrl, {
            waitUntil: 'networkidle2',
            timeout: 10000,
        });

        if (response) {
            const status = response.ok() ? 'up' : 'down';
            const website = await Website.findById(websiteId);

            if (website) {
                const lastTrend = website.trends[website.trends.length - 1];

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
                    await Website.findByIdAndUpdate(websiteId, {
                        currentStatus: {
                            status,
                            checkedAt: new Date(),
                        },
                    });
                    console.log(`Website ${websiteUrl} is still ${status}, no trend update needed.`);
                }
            }
        } else {
            console.error(`Failed to ping ${websiteUrl}: No response received.`);
        }
    } catch (error) {
        console.error(`Error checking status for ${websiteUrl}:`, error);
        const website = await Website.findById(websiteId);
        if (website) {
            const lastTrend = website.trends[website.trends.length - 1];
            if (!lastTrend || lastTrend.status !== 'down') {
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
                console.error(`Website ${websiteUrl} is down and trend updated.`);
            } else {
                await Website.findByIdAndUpdate(websiteId, {
                    currentStatus: {
                        status: 'down',
                        checkedAt: new Date(),
                    },
                });
                console.error(`Website ${websiteUrl} is still down.`);
            }
        }
    } finally {
        await browser.close();
    }
};
