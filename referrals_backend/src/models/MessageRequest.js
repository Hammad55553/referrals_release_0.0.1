const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageRequestSchema = new Schema({
    users: [{ type: String, required: true }],
    receiver_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    post_id: { type: String, required: true },
    status: { type: String, required: true },
    type: { type: String, required: true },
    blocked: { type: Boolean, required: true },
    messages: { type: Schema.Types.ObjectId, ref: 'Message' },
    createdAt: { type: Date, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('MessageRequest', messageRequestSchema);
