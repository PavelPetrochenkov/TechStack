const mongoose = require("mongoose");

const User = require("../models/user");
const Bike = require("../models/bikes");


exports.user_get_all_my_rented = (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      const response = {
        myBikes: docs[0].myBikes.map(doc => {
          return {
            idBike: doc.idBike,
            startTimeOfUse: doc.startTimeOfUse,
          };
        })
      }; 
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.user_add_bike = async (req, res, next) => {
  const id = req.body.bikeId;
  const startTimeOfUse = new Date();
 
  const processedBike = new  Object ({
    idBike: id,
    startTimeOfUse:startTimeOfUse
  });

  await User.findOne({}, { myBikes: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!!bike.myBikes[0]){
      console.log(err);
      res.status(500).json({
        message: "Bike is exist"
      });
  }else {
    User.updateOne({ }, { $push:{myBikes:  processedBike}})
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
    Bike.updateOne({_id:id}, {isRent:true}).exec();
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
  await Bike.updateOne({ _id: id }, { isRent: false });
  
  await User.findOne({}, { myBikes: {$elemMatch:{idBike : id}}}).then(bike => {
    if(!bike.myBikes[0]){
      res.status(500).json({
        message: "Bike isn't use"
      })}
    return bike.myBikes[0];
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike isn't use"
    });
  });

  await User.updateOne({}, {"$pull": { "myBikes": {"idBike": id} } }).then(bike=>{
    bike
    }).then(result => {
      res.status(200).json({
        message: "Bike canceled",
    })})
    .catch(err => {
    console.log(err);
    res.status(500).json({
      message: "Bike id is wrong"
    });
  });
};