import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Define the User schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  isStudent: {
    type: String,
    enum: ['Student', 'Working Professional'],
    default: 'Student',
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['Normal User', 'Organizer'],
    default: 'Normal User',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

export default User;