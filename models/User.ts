// models/User.ts
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  membership: { type: String, default: 'basic' },

  // Personal details
  fullName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },

  // Wine preferences (only relevant if membership='premium')
  winePreferences: {
    drynessLevel: { type: String }, // e.g. "dry", "semi-sweet", "sweet"
    favoriteTypes: [{ type: String }], // e.g. ["red", "white", "sparkling"]
    dislikedFlavors: [{ type: String }], // e.g. ["oaky", "smoky"]
    budgetRange: { type: String }, // e.g. "$10-15", "$20-30"
    knowledgeLevel: { type: String }, // e.g. "beginner", "intermediate", "advanced"
    locationZip: { type: String },
  },

  // Usage tracking for basic (free) plan: limit to 5 queries per day
  usage: {
    count: { type: Number, default: 0 },
    lastUsed: { type: String, default: '' }, // store a date string like '2025-03-16'
  },
});

const User = models.User || model('User', UserSchema);
export default User;
