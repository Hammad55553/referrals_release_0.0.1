const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true },
    profilePhoto: { type: String },
    updated_at: { type: Date, required: true },
    address: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    workplace: { type: String, required: true },
    education: { type: String, required: true },
    is_deleted: { type: Boolean, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('User', userSchema);
