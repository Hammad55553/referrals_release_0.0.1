const mongoose = require('mongoose');
const { Schema } = mongoose;

const quickMessageSchema = new Schema({
    message: { type: String, required: true },
    category: { type: String, required: true },
    uid: { type: String, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('QuickMessage', quickMessageSchema);
