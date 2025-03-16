// models/User.ts
import { Schema, model, models } from 'mongoose';

const ConversationMessageSchema = new Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  membership: { type: String, default: 'basic' },

  // Personal details...
  // e.g. fullName, address, zip, etc.

  // Wine preferences
  winePreferences: {
    drynessLevel: { type: String },
    favoriteTypes: [{ type: String }],
    dislikedFlavors: [{ type: String }],
    budgetRange: { type: String },
    knowledgeLevel: { type: String },
    locationZip: { type: String },
  },

  // Usage for basic plan
  usage: {
    count: { type: Number, default: 0 },
    lastUsed: { type: String, default: '' },
  },

  // Store conversation as an array of subdocuments
  conversationHistory: [ConversationMessageSchema],
});

const User = models.User || model('User', UserSchema);
export default User;
