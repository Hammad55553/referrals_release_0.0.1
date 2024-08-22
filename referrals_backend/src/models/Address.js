const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    streetNameNumber: { type: String, required: true },
    apartment: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
}, { _id: false });

module.exports = mongoose.model('Address', addressSchema);
