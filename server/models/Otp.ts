import mongoose, { Document, Schema } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  name?: string;
  hashedPassword?: string;
  createdAt: Date;
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
    hashedPassword: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically deleted after 10 minutes
    },
  },
  {
    timestamps: false,
  }
);

export const Otp = mongoose.model<IOtp>('Otp', OtpSchema);
