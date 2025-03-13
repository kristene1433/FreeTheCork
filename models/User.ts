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
    // Example structure
    drynessLevel: { type: String }, // e.g. "dry", "semi-sweet", "sweet"
    favoriteTypes: [{ type: String }], // e.g. ["red", "white", "sparkling"]
    dislikedFlavors: [{ type: String }], // e.g. ["oaky", "smoky"]
    budgetRange: { type: String }, // e.g. "$10-15", "$20-30"
    knowledgeLevel: { type: String }, // "beginner", "intermediate", "advanced"
    locationZip: { type: String },
  },
});

const User = models.User || model('User', UserSchema);
export default User;
