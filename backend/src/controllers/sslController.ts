import https from 'https';
import { URL } from 'url';
import validator from 'validator';
import { Website } from '../models/websiteModel';

export const checkSSLCertificate = async (websiteUrl: string, websiteId: string) => {
    if (!/^https?:\/\//i.test(websiteUrl)) {
        websiteUrl = `https://${websiteUrl}`; // Prepend https:// if no protocol is present
    }

    if (!validator.isURL(websiteUrl)) {
        console.error(`Invalid URL provided for SSL check: ${websiteUrl}`);
        return;
    }

    return new Promise<void>((resolve, reject) => {
        const url = new URL(websiteUrl);
        const options = {
            hostname: url.hostname,
            port: 443,
            method: 'GET',
            rejectUnauthorized: false,
        };

        const req = https.request(options, async (res) => {
            const certificate = (res.socket as any).getPeerCertificate();
            let sslStatus: string;

            if (certificate && Object.keys(certificate).length > 0) {
                sslStatus = 'valid';
                console.log(`SSL certificate for ${websiteUrl} is valid`);
            } else {
                sslStatus = 'not found';
                console.error(`No SSL certificate found for ${websiteUrl}`);
            }

            // Update SSL status in the database
            await Website.findByIdAndUpdate(websiteId, {
                sslStatus: {
                    status: sslStatus,
                    checkedAt: new Date(),
                },
            });

            resolve();
        });

        req.on('error', async (error) => {
            console.error(`SSL check failed for ${websiteUrl}: ${error.message}`);
            await Website.findByIdAndUpdate(websiteId, {
                sslStatus: {
                    status: 'invalid',
                    checkedAt: new Date(),
                },
            });
            reject(`SSL check failed: ${error.message}`);
        });

        req.end();
    });
};
