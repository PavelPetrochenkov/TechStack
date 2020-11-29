const mongoose = require("mongoose");

const User = require("../models/user");
const Bike = require("../models/bikes");

exports.user_add_bike = async (req, res, next) => {
  const id = req.body.bikeId;
  const startTimeOfUse = req.body.time;
 
  const processedBike = new  Object ({
    idBike: id,
    startTimeOfUse:startTimeOfUse
  });

  await User.findOne({}, { alreadyRentedBike: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!!bike.alreadyRentedBike[0]){
      console.log(err);
      res.status(500).json({
        message: "Bike is exist"
      });
  }else {
    User.update({ name: "Admin" }, { $push:{alreadyRentedBike:  processedBike}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Bike added",
    })}).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  }})
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_cancel_bike = async (req, res, next) => {
  const id = req.body.bikeId;
  await Bike.update({ _id: id }, { isRent: false });
  const bike = (await Bike.findById(id));
  
  const getBikeUseNow = (await User.findOne({}, { alreadyRentedBike: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!bike.alreadyRentedBike[0]){
      console.log(err);
      res.status(500).json({
        message: "Bike isn't use"
      })}
    return bike.alreadyRentedBike[0];
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike isn't use"
    });
  })
  );

  await User.updateOne({}, {"$pull": { "alreadyRentedBike": {"idBike": id} } }).then(bike=>{
    bike
    })
    .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike id is wrong"
    });
  });

  const usedTime =(new Date(req.body.time)-getBikeUseNow.startTimeOfUse);
  const cost =(new Date(usedTime).getSeconds())*bike.price;

  const processedBike = new  Object ({
    idBike: id,
    usedTime:usedTime,
    cost:cost,
    isPaid:false
  });

  await  User.update({}, { $push:{wasRentedBike:  processedBike}})
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Bike canceled",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};