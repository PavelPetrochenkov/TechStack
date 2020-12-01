const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    
        myBikes:[{
            idBike: {type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: false },
            startTimeOfUse:{type:Date, required:false}
        }]
    
});

module.exports = mongoose.model('User', userSchema);