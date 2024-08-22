// models/ActionUserProfile.js
const mongoose = require('mongoose');

const ActionUserProfileSchema = new mongoose.Schema({
  by_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUserInfo', required: true },
  to_uid: { type: mongoose.Schema.Types.ObjectId, ref: 'ReferralUserInfo', required: true },
  is_interested: Boolean,
  is_rejected: Boolean,
  end_date: Date,
}, { timestamps: true });

module.exports = mongoose.model('ActionUserProfile', ActionUserProfileSchema);
