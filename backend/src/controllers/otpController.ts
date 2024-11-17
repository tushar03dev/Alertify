import transporter from '../config/nodemailerConfig';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate and send OTP
export const sendOTP = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a JWT containing the OTP and set its expiry
    const token = jwt.sign({ otp }, process.env.JWT_SECRET as string, { expiresIn: '5m' });

    // Send OTP via email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Alertify verification OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return token; // Optionally return the token if needed for later verification
};

// Verify OTP
export const verifyOTP = async (token: string, otp: string) => {
    try {
        if (!token || !otp) {
            return { success: false, message: 'Token and OTP are required' };
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('Decoded OTP:', decoded.otp); // Debugging log

        if (decoded.otp === otp) {
            return { success: true, message: 'OTP verified successfully' };
        } else {
            return { success: false, message: 'Invalid OTP' };
        }
    } catch (error: unknown) {
        console.error('Error in verifyOTP:', error);
        return { success: false, message: 'Invalid or expired token' };
    }
};