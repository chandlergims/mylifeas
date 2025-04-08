import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  address: string;
  nonce: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    nonce: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Check if the model already exists to prevent overwriting during hot reloads
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
