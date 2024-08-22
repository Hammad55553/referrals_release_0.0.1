const mongoose = require('mongoose');
const { Schema } = mongoose;

const userChatAppSchema = new Schema({
    uid: { type: String, required: true },
    createdAt: { type: Date, required: true },
    publicKey: { type: String, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('UserChatApp', userChatAppSchema);
