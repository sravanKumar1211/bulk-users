import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^[0-9]+$/, 'Phone number can only contain numeric digits'],
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: [0, 'Wallet balance cannot be negative'],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid KYC status',
      },
      default: 'Pending',
    },
    deviceInfo: {
      ipAddress: {
        type: String,
      },
      deviceType: {
        type: String,
        enum: {
          values: ['Mobile', 'Desktop'],
          message: '{VALUE} is not a supported device type',
        },
      },
      os: {
        type: String,
        enum: {
          values: ['Android', 'iOS', 'Windows', 'macOS'],
          message: '{VALUE} is not a supported OS',
        },
      },
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt
  }
);

// Optimized Compound Index
// Purpose: Highly speeds up querying/filtering users by their blocked and KYC status.
userSchema.index({ isBlocked: 1, kycStatus: 1 });

const User = mongoose.model('User', userSchema);

export default User;
