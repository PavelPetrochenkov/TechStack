const mongoose = require('mongoose');

const bikeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    type: {type: String, required: true },
    price: {type: String, required: true },
    isRent: {type: Boolean, required: false},
});

module.exports = mongoose.model('Bike', bikeSchema);