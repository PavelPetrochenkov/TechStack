const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    
        alreadyRentedBike:[{
            idBike: {type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: false },
            startTimeOfUse:{type:Date, required:false}
        }],
        wasRentedBike:[{
            idBike: {type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: false },
            usedTime : {type:Number,required:false},
            cost: {type: Number, required:false},
            isPaid: {type:Boolean, required:false}
        }]
    
});

module.exports = mongoose.model('User', userSchema);