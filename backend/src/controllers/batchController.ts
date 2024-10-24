import { Website, IWebsite } from '../models/websiteModel';
import { checkSingleWebsiteStatus } from './statusController';
import { checkSSLCertificate } from './sslController';

const batchSize = 5; // Number of websites to check in one batch

// Function to perform status and SSL checks in parallel
export const batchCheck = async () => {
    const websites: IWebsite[] = await Website.find();

    if (websites.length === 0) {
        console.log("No websites to check.");
        return;
    }

    // Split websites into groups of batchSize
    const groups = [];
    for (let i = 0; i < websites.length; i += batchSize) {
        groups.push(websites.slice(i, i + batchSize));
    }

    // Process each group concurrently
    for (const group of groups) {
        console.log(`Checking group of ${group.length} websites...`);

        // Check website status and SSL in parallel for each website in the group
        const statusChecks = group.map((website) =>
            checkSingleWebsiteStatus(website.url, website._id.toString())
        );
        const sslChecks = group.map((website) =>
            checkSSLCertificate(website.url, website._id.toString())
        );

        // Wait for both checks (status and SSL) to complete for all websites in the group
        await Promise.all([...statusChecks, ...sslChecks]);
    }
};

