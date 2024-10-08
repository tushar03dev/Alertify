import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
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
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    currentStatus: {
        status: { type: String, enum: ['up', 'down'], required: true },
        checkedAt: { type: Date, default: Date.now }
    },
    trends: [
        {
            status: { type: String, enum: ['up', 'down'], required: true },
            timestamp: { type: Date, required: true }
        }
    ]
});

export const Website = mongoose.model<IWebsite>('Website', WebsiteSchema);
