import mongoose, { Schema, Document } from 'mongoose';

export interface IBin extends Document {
    websiteUrl: string;
    websiteId: mongoose.Types.ObjectId;  // Reference to the website
}

const BinSchema: Schema = new Schema({
    websiteUrl: { type: String, required: true },
    websiteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Website', required: true }
});

// Create a model for the Bin collection
export const Bin = mongoose.model<IBin>('Bin', BinSchema);


