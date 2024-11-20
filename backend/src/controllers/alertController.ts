import {Website} from "../models/websiteModel";
import transporter from "../config/nodemailerConfig";
import {User} from "../models/userModel";

export const sendAlert = async(websiteId:string) =>{
    try {
        console.log("Email is about to be send");
        // Step 1: Find the website and get the user's ObjectId
        const website = await Website.findById(websiteId);

        if (!website) {
            throw new Error('Website not found');
        }

        const userId = website.user; // This will be the ObjectId
        if (!userId) {
            console.error(`No user associated with website URL: ${website.url}`);
            throw new Error('No user associated with this website');
        }

        // Step 2: Find the user by ObjectId
        const user = await User.findById(userId, 'name email'); // Only fetch name and email

        if (!user) {
            console.error(`User not found for ID: ${userId}`);
            throw new Error('User not found');
        }

        const name = user.name;
        const email = user.email;
        const timestamp = new Date();

        const formatDateTime = (date: Date): string => {
            const options: Intl.DateTimeFormatOptions = {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };

            return date.toLocaleString('en-US', options).replace(',', ' at');
        };

        // Send Alert via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Your Website ${website.url} has gone down`,
            text: `Dear ${name}, Your website ${website.url} has gone down at ${formatDateTime(timestamp)}`,
        });

        console.log("Mail of alert is sent");

    } catch (error:unknown) {
        throw new Error('Error fetching user by website URL');
    }
}