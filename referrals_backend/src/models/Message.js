const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    mid: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    message: { type: String, required: true },
    messageByMe: { type: Boolean, required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
    delete: { type: Boolean, required: true },
    edited: { type: Boolean, required: true },
    chat_id: { type: String, required: true },
    attachmentUrl: { type: String },
    messages: [{ type: String }],
}, { versionKey: '_v' });

module.exports = mongoose.model('Message', messageSchema);
