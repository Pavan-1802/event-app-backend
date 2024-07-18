import mongoose from "mongoose";

// Define the Comment schema as a subdocument
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Define the Event schema
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (value) {
        const user = await mongoose.model('User').findById(value);
        return user && user.role === 'Organizer';
      },
      message: 'Organizer must be a user with the role of Organizer',
    },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Conference', 'Workshop', 'Meetup', 'Webinar', 'Other'], // Example event types
  },
  comments: [commentSchema],
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Event model from the schema
const Event = mongoose.model('Event', eventSchema);

export default Event;
