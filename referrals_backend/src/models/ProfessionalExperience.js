// models/ProfessionalExperience.js
const mongoose = require('mongoose');

const ProfessionalExperienceSchema = new mongoose.Schema({
  company_name: { type: String, required: true },
  title: { type: String, required: true },
  location: String,
  start_date: Date,
  end_date: Date,
  is_currently_working: Boolean,
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUserInfo', required: true },
}, { timestamps: true });

module.exports = mongoose.model('ProfessionalExperience', ProfessionalExperienceSchema);
