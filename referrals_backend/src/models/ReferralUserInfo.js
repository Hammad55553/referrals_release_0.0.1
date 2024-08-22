// models/ReferralUserInfo.js
const mongoose = require('mongoose');

const ReferralUserInfoSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  headline: String,
  about: String,
  age: Number,
  years_of_exp: Number,
  phone_number: String,
  country: String,
  city: String,
  education_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EducationDetails' },
  github_url: String,
  portfolio_url: String,
  linkedin_url: String,
  resume_url: String,
  other_url: String,
  skills: [String],
  visibility: { type: String, enum: ['seeking', 'offering', 'both'], required: true },
  discardedProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUserInfo' }]
}, { timestamps: true });

module.exports = mongoose.model('ReferralUserInfo', ReferralUserInfoSchema);
