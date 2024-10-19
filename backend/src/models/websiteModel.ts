import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
    websiteName: string;
    url: string;
    user: mongoose.Types.ObjectId;
    currentStatus: {
        status: string;
        checkedAt: Date;
    };
    trends: {
        status: string;
        timestamp: Date;
    }[];
}

const WebsiteSchema: Schema = new Schema({
    websiteName: { type: String, required: true },
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentStatus: {
        status: { type: String, enum: ['up', 'down'] },
        checkedAt: { type: Date, default: Date.now }
    },
    trends: [
        {
            status: { type: String, enum: ['up', 'down'] },
            timestamp: { type: Date }
        }
    ]
});

export const Website = mongoose.model<IWebsite>('Website', WebsiteSchema);
