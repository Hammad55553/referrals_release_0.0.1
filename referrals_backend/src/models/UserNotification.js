const mongoose = require('mongoose');
const { Schema } = mongoose;

const userNotificationSchema = new Schema({
    uid: { type: String, required: true },
    generator_uid: { type: String, required: true },
    module: { type: String, required: true },
    request_id: { type: Schema.Types.ObjectId, ref: 'MessageRequest' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    image_url: { type: String },
    delete: { type: Boolean, required: true },
    read: { type: Boolean, required: true },
    read_at: { type: Date },
    created_at: { type: Date, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('UserNotification', userNotificationSchema);
