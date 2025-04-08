import mongoose, { Schema, Document } from 'mongoose';

export interface IComic extends Document {
  title: string;
  creator: mongoose.Types.ObjectId;
  creatorAddress: string;
  imageUrl: string;
  settings: object;
  isPublic: boolean;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ComicSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    creatorAddress: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    dislikedBy: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Comic || mongoose.model<IComic>('Comic', ComicSchema);
