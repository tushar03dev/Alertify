import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    password: string;
    email: string;
    websites: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    websites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Website' }]
});

export const User = mongoose.model<IUser>('User', UserSchema);
