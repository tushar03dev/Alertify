// import https from 'https';
// import validator from 'validator';
// import { URL } from 'url';
// import { Website, IWebsite } from '../models/websiteModel'; // Import the Website model if needed
// import { checkSingleWebsiteStatus } from './statusCheck'; // Import the status check function if in a separate file
//
// const batchSize = 5; // Define the number of websites to check in one batch
//
// // Function to check the SSL certificate of a website
// export const checkSSLCertificate = async (websiteUrl: string, websiteId: string) => {
//     // Check if the URL starts with http:// or https://
//     if (!/^https?:\/\//i.test(websiteUrl)) {
//         websiteUrl = `https://${websiteUrl}`; // Prepend https:// if no protocol is present
//     }
//
//     // Validate the URL
//     if (!validator.isURL(websiteUrl)) {
//         console.error(`Invalid URL provided for SSL check: ${websiteUrl}`);
//         return;
//     }
//
//     return new Promise<void>((resolve, reject) => {
//         const url = new URL(websiteUrl);
//         const options = {
//             hostname: url.hostname,
//             port: url.protocol === 'https:' ? 443 : 80,
//             method: 'GET',
//             rejectUnauthorized: false, // Allow self-signed certificates for testing
//         };
//
//         const req = https.request(options, (res) => {
//             if (res.socket) {
//                 const certificate = (res.socket as any).getPeerCertificate(); // Type assertion
//                 if (certificate && Object.keys(certificate).length > 0) {
//                     console.log(`SSL certificate for ${websiteUrl} is valid`);
//                     resolve();
//                 } else {
//                     console.error(`No SSL certificate found for ${websiteUrl}`);
//                     reject('No SSL certificate found');
//                 }
//             } else {
//                 console.error(`No socket information available for ${websiteUrl}`);
//                 reject('No socket information available');
//             }
//         });
//
//         req.on('error', (error) => {
//             console.error(`SSL check failed for ${websiteUrl}: ${error.message}`);
//             reject(`SSL check failed: ${error.message}`);
//         });
//
//         req.end();
//     });
// };
//
// // Function to perform checks in batches
// export const batchCheck = async () => {
//     // Fetch all websites and explicitly type the result
//     const websites: IWebsite[] = await Website.find();
//
//     if (websites.length === 0) {
//         console.log("No websites to check.");
//         return;
//     }
//
//     // Split websites into groups of 5
//     const groups = [];
//     for (let i = 0; i < websites.length; i += batchSize) {
//         groups.push(websites.slice(i, i + batchSize));
//     }
//
//     // Process each group sequentially
//     for (const group of groups) {
//         console.log(`Checking group of ${group.length} websites...`);
//
//         // Check all websites in the group for status in parallel
//         const statusChecks = group.map((website) => {
//             const { url, _id } = website; // Destructure to get url and _id
//             return checkSingleWebsiteStatus(url, _id.toString()); // Convert ObjectId to string
//         });
//
//         await Promise.all(statusChecks); // Wait for all status checks in the group to complete
//
//         // Check SSL certificates for all websites in the group in parallel
//         const sslChecks = group.map((website) => {
//             const { url, _id } = website; // Destructure to get url and _id
//             return checkSSLCertificate(url, _id.toString()); // Convert ObjectId to string
//         });
//
//         await Promise.all(sslChecks); // Wait for all SSL checks in the group to complete
//     }
// };
