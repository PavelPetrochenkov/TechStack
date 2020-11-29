const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    type: {type: String, required: false },
    price: {type: String, required: false },
    isRent: {type: Boolean, required: false},
});

module.exports = mongoose.model('User', userSchema);