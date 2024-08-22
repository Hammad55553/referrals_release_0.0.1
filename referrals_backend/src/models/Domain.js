const mongoose = require('mongoose');
const { Schema } = mongoose;

const domainSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    domain: { type: String, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('Domain', domainSchema);
