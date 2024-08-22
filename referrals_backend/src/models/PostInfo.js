const mongoose = require('mongoose');
const { Schema } = mongoose;
const Address = require('./Address');

const postInfoSchema = new Schema({
    uid: { type: String, required: true },
    category: { type: String, required: true },
    categoryType: { type: String, required: true },
    imgUrl: [{ type: String }],
    titleOfPost: { type: String, required: true },
    postDescription: { type: String, required: true },
    address: Address.schema,
    availableFrom: { type: Date, required: true },
    rent: { type: Number, required: true },
    apartmentType: { type: String, required: true },
    facilities: [{ type: String }],
    priceFrom: { type: mongoose.Decimal128, required: true },
    priceTo: { type: mongoose.Decimal128, required: true },
    isDelete: { type: Boolean, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
}, { versionKey: '_v' });

module.exports = mongoose.model('PostInfo', postInfoSchema);
