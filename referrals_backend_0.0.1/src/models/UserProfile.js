const mongoose = require('mongoose');

// Define the schema for the user profile
const userProfileSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: mongoose.Schema.Types.Decimal128, required: true },
    address: { type: String, required: true },
    profile_pic: { type: String, default: '' },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    user_type: { 
        type: String, 
        enum: ['admin', 'editor', 'viewer'], // Example enum values, adjust as needed
        required: true 
    }
});

// Middleware to automatically update the `updated_at` field before saving
userProfileSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

// Create the model
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
